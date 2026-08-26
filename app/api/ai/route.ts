import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type NewsItem = {
  id: number;
  title: string;
  source: string;
  time: string;
  description: string;
  url: string;
};

type SourceItem = {
  id: number;
  title: string;
  source: string;
  time: string;
  url: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AIMemory = {
  id: string;
  memory: string;
};

function getText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "#text" in value
  ) {
    const text = (value as { "#text"?: unknown })["#text"];

    return typeof text === "string" ? text : "";
  }

  return "";
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNewsTime(pubDate?: string): string {
  if (!pubDate) {
    return "Baru saja";
  }

  const date = new Date(pubDate);

  if (Number.isNaN(date.getTime())) {
    return pubDate;
  }

  const diff = Date.now() - date.getTime();

  if (diff < 0) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return "Baru saja";
  }

  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  if (days === 1) {
    return "Kemarin";
  }

  if (days < 7) {
    return `${days} hari lalu`;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================
   DETEKSI CHAT SEDERHANA
========================= */

function isSimpleGreeting(prompt: string): boolean {
  const normalized = prompt
    .toLowerCase()
    .trim()
    .replace(/[!?.,]/g, "");

  const greetings = [
    "halo",
    "hai",
    "hi",
    "hello",
    "pagi",
    "selamat pagi",
    "siang",
    "selamat siang",
    "sore",
    "selamat sore",
    "malam",
    "selamat malam",
    "apa kabar",
    "tes",
    "test",
  ];

  return greetings.includes(normalized);
}

/* =========================
   DETEKSI PERLU BERITA
========================= */

function needsNewsSearch(prompt: string): boolean {
  const text = prompt.toLowerCase();

  const newsKeywords = [
    "berita terbaru",
    "berita terkini",
    "berita hari ini",
    "berita sekarang",
    "kabar terbaru",
    "update terbaru",
    "perkembangan terbaru",
    "perkembangan saat ini",
    "perkembangan sekarang",
    "saat ini",
    "hari ini",
    "terkini",
    "terbaru",
    "update",
    "berita",
    "kejadian terbaru",
    "kejadian hari ini",
    "apa yang terjadi",
    "apa yang terjadi hari ini",
    "kondisi terbaru",
    "situasi terbaru",
    "situasi saat ini",
    "harga hari ini",
    "harga terbaru",
    "trending",
    "viral",
  ];

  return newsKeywords.some((keyword) =>
    text.includes(keyword)
  );
}

/* =========================
   EKSTRAK KATA KUNCI
========================= */

function extractKeywords(prompt: string): string[] {
  const stopWords = new Set([
    "cari",
    "carikan",
    "carilah",
    "tolong",
    "berita",
    "informasi",
    "info",
    "tentang",
    "mengenai",
    "terkait",
    "yang",
    "dan",
    "atau",
    "dari",
    "di",
    "ke",
    "untuk",
    "saya",
    "aku",
    "terbaru",
    "terkini",
    "hari",
    "ini",
    "hariini",
    "sekarang",
    "dong",
    "ya",
    "please",
    "berikan",
    "tampilkan",
    "tampilkanlah",
    "berita-berita",
    "update",
    "updates",
    "apa",
    "saja",
    "ada",
    "bagaimana",
    "jelaskan",
    "perkembangan",
    "saat",
  ]);

  const cleaned = prompt
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned
    .split(" ")
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length >= 3 &&
        !stopWords.has(word)
    );

  return [...new Set(words)];
}

/* =========================
   CEK RELEVANSI BERITA
========================= */

function calculateRelevance(
  item: Omit<NewsItem, "id">,
  keywords: string[]
): number {
  if (keywords.length === 0) {
    return 1;
  }

  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const source = item.source.toLowerCase();

  let score = 0;

  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      score += 5;
    }

    if (description.includes(keyword)) {
      score += 3;
    }

    if (source.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

/* =========================
   FORMAT RIWAYAT CHAT
========================= */

function formatConversationHistory(
  messages: ChatMessage[]
): string {
  if (messages.length === 0) {
    return "Belum ada riwayat percakapan sebelumnya.";
  }

  return messages
    .map((message) => {
      const speaker =
        message.role === "user"
          ? "PENGGUNA"
          : "DONARA AI";

      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}

/* =========================
   FORMAT MEMORY
========================= */

function formatMemories(
  memories: AIMemory[]
): string {
  if (memories.length === 0) {
    return "Belum ada ingatan khusus tentang pengguna.";
  }

  return memories
    .map(
      (memory, index) =>
        `${index + 1}. ${memory.memory}`
    )
    .join("\n");
}

/* =========================
   AMBIL MEMORY PENTING
========================= */

async function extractMemory(
  prompt: string,
  answer: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return [];
  }

  const memoryPrompt = `
Analisis percakapan berikut dan tentukan apakah ada informasi pribadi atau preferensi jangka panjang yang berguna untuk diingat oleh asisten AI.

PESAN PENGGUNA:
${prompt}

JAWABAN ASISTEN:
${answer}

Simpan HANYA informasi yang:
- kemungkinan berguna di percakapan berikutnya
- merupakan preferensi pengguna
- merupakan identitas yang secara sukarela disampaikan pengguna
- merupakan tujuan, proyek, pekerjaan, atau minat jangka panjang
- bukan informasi sementara
- bukan pertanyaan biasa
- bukan informasi sensitif yang tidak perlu diingat

Jika tidak ada informasi penting untuk diingat, jawab:
NONE

Jika ada, tulis maksimal 3 memory.

Format:
MEMORY: isi memory pertama
MEMORY: isi memory kedua

Jangan menulis penjelasan lain.
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: memoryPrompt,
                },
              ],
            },
          ],
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== "string") {
      return [];
    }

    if (text.trim().toUpperCase() === "NONE") {
      return [];
    }

    return text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) =>
        line.startsWith("MEMORY:")
      )
      .map((line: string) =>
        line.replace("MEMORY:", "").trim()
      )
      .filter(
        (memory: string) => memory.length > 0
      )
      .slice(0, 3);
  } catch {
    return [];
  }
}

/* =========================
   SIMPAN MEMORY
========================= */

async function saveMemories(
  userId: string,
  memories: string[]
) {
  if (memories.length === 0) {
    return;
  }

  const supabase = await createClient();

  const { data: existingMemories, error } =
    await supabase
      .from("ai_memories")
      .select("memory")
      .eq("user_id", userId);

  if (error) {
    console.error(
      "GAGAL_MENGAMBIL_MEMORY:",
      error
    );

    return;
  }

  const existing = new Set(
    (existingMemories || []).map((item) =>
      item.memory.toLowerCase().trim()
    )
  );

  const newMemories = memories.filter(
    (memory) =>
      !existing.has(memory.toLowerCase().trim())
  );

  if (newMemories.length === 0) {
    return;
  }

  const { error: insertError } =
    await supabase
      .from("ai_memories")
      .insert(
        newMemories.map((memory) => ({
          user_id: userId,
          memory,
        }))
      );

  if (insertError) {
    console.error(
      "GAGAL_MENYIMPAN_MEMORY:",
      insertError
    );
  }
}

/* =========================
   GEMINI REQUEST
========================= */

async function generateWithGemini(
  prompt: string,
  news: NewsItem[] = [],
  conversationHistory: ChatMessage[] = [],
  memories: AIMemory[] = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY belum ditemukan di environment."
    );
  }

  const hasNews = news.length > 0;

  const historyContext =
    formatConversationHistory(
      conversationHistory
    );

  const memoryContext =
    formatMemories(memories);

  const newsContext = hasNews
    ? news
        .map(
          (item) => `
SUMBER [${item.id}]
Judul: ${item.title}
Media: ${item.source}
Waktu: ${item.time}
Isi: ${item.description}
`
        )
        .join("\n-------------------\n")
    : "";

  const aiPrompt = hasNews
    ? `
Kamu adalah asisten AI yang membantu pengguna secara natural dalam Bahasa Indonesia.

Gunakan ingatan pengguna dan riwayat percakapan hanya jika relevan dengan pertanyaan saat ini.

INGATAN TENTANG PENGGUNA:
${memoryContext}

RIWAYAT PERCAKAPAN TERBARU:
${historyContext}

PERTANYAAN PENGGUNA SAAT INI:
${prompt}

INFORMASI TERBARU YANG DITEMUKAN:
${newsContext}

ATURAN:

- Jawab langsung ke inti pertanyaan.
- Jangan selalu membuka jawaban dengan "Halo".
- Jangan selalu memperkenalkan diri.
- Jangan mengatakan "Saya adalah Donara AI" kecuali pengguna secara khusus menanyakan identitasmu.
- Jangan berbicara dengan gaya robot atau customer service.
- Gunakan bahasa Indonesia yang natural.
- Gunakan memory untuk memahami konteks pengguna, tetapi jangan menyebut "saya menyimpan memory" kecuali ditanya.
- Jangan berpura-pura mengingat sesuatu jika tidak ada di memory atau riwayat.
- Analisis dan gabungkan informasi dari beberapa sumber jika relevan.
- Berikan kesimpulan jika memang diperlukan.
- Jangan mengarang fakta di luar data yang diberikan.
- Jika informasi yang tersedia tidak cukup, katakan dengan jujur.
- Jangan menampilkan URL.
- Jangan membuat daftar link.
- Jangan menuliskan bagian "Sumber".
- Jika sebuah fakta penting berasal dari sumber tertentu, tambahkan penanda kecil seperti [1], [2], atau [1][2].
- Nomor sumber harus sesuai dengan nomor SUMBER yang diberikan.
- Jangan memasukkan penanda sumber di setiap kalimat.
- Jangan menyebut Gemini.
- Jangan menjelaskan proses internal pencarian.

Jawablah seperti percakapan manusia yang natural.
`
    : `
Kamu adalah asisten AI yang membantu pengguna secara natural dalam Bahasa Indonesia.

Gunakan ingatan pengguna dan riwayat percakapan untuk memahami konteks jika relevan.

INGATAN TENTANG PENGGUNA:
${memoryContext}

RIWAYAT PERCAKAPAN TERBARU:
${historyContext}

PERTANYAAN PENGGUNA SAAT INI:
${prompt}

ATURAN:

- Jawab langsung dan natural.
- Jangan selalu membuka jawaban dengan "Halo".
- Jangan selalu memperkenalkan diri.
- Jangan mengatakan "Saya adalah Donara AI" kecuali pengguna menanyakan identitasmu.
- Jangan menggunakan gaya bot atau customer service yang kaku.
- Gunakan informasi dari riwayat chat jika pengguna merujuk ke percakapan sebelumnya.
- Gunakan memory jika relevan.
- Jangan menyebut sistem memory secara tiba-tiba.
- Jangan mengarang informasi yang tidak ada.
- Jangan mengarang informasi terbaru jika pengguna tidak meminta informasi terkini.
- Jawab berdasarkan pengetahuan dan kemampuan penalaranmu.
- Jika pertanyaan pengguna sederhana, jawaban juga boleh sederhana.
- Jangan memaksakan jawaban panjang.
- Jangan menawarkan daftar topik yang tidak diminta.
- Jangan mengubah pertanyaan umum menjadi pembahasan berita.
- Jangan menyebut Gemini.
- Jangan menggunakan URL.
- Jangan membuat daftar sumber.

Contoh gaya yang benar:

Pengguna: halo
Jawaban: Halo, ada yang bisa saya bantu?

Pengguna: apa yang harus saya pelajari?
Jawaban: Itu tergantung tujuan Anda. Kalau Anda ingin, ceritakan dulu tujuan Anda—misalnya untuk kerja, bisnis, teknologi, atau hal lain—nanti saya bantu menentukan apa yang paling penting untuk dipelajari.

Jawab secara natural sesuai konteks pengguna.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: aiPrompt,
              },
            ],
          },
        ],
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      "Gagal mendapatkan respons AI.";

    throw new Error(errorMessage);
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== "string") {
    throw new Error(
      "AI tidak menghasilkan jawaban."
    );
  }

  return text.trim();
}

/* =========================
   AMBIL BERITA GOOGLE NEWS
========================= */

async function searchNews(
  searchQuery: string,
  keywords: string[]
): Promise<NewsItem[]> {
  const googleNewsUrl =
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      searchQuery
    )}&hl=id&gl=ID&ceid=ID:id`;

  const response = await fetch(
    googleNewsUrl,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil berita dari Google News."
    );
  }

  const xml = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xml);

  const rawItems =
    parsed?.rss?.channel?.item;

  const items = Array.isArray(rawItems)
    ? rawItems
    : rawItems
      ? [rawItems]
      : [];

  const allNews = items
    .map(
      (
        item: Record<string, unknown>
      ): Omit<NewsItem, "id"> => {
        const title = stripHtml(
          getText(item.title)
        );

        const sourceData = item.source;

        let source = "Google News";

        if (
          sourceData &&
          typeof sourceData === "object"
        ) {
          const sourceObject =
            sourceData as {
              "#text"?: unknown;
            };

          if (
            typeof sourceObject["#text"] ===
            "string"
          ) {
            source =
              sourceObject["#text"];
          }
        } else if (
          typeof sourceData === "string"
        ) {
          source = sourceData;
        }

        const description = stripHtml(
          getText(item.description)
        );

        return {
          title,
          source: stripHtml(source),
          time: formatNewsTime(
            getText(item.pubDate)
          ),
          description:
            description ||
            "Informasi tersedia dari hasil pencarian berita.",
          url: getText(item.link),
        };
      }
    )
    .filter(
      (item: Omit<NewsItem, "id">) =>
        item.title &&
        item.url
    );

  const scoredNews = allNews
    .map((item) => ({
      item,
      score: calculateRelevance(
        item,
        keywords
      ),
    }))
    .filter(({ score }) => {
      if (keywords.length === 0) {
        return true;
      }

      return score > 0;
    })
    .sort((a, b) => b.score - a.score);

  return scoredNews
    .slice(0, 8)
    .map(({ item }, index) => ({
      ...item,
      id: index + 1,
    }));
}

/* =========================
   API DONARA AI
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";

    const requestedConversationId =
      typeof body.conversationId === "string" &&
      body.conversationId.trim()
        ? body.conversationId.trim()
        : null;

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Prompt tidak boleh kosong.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       SUPABASE + USER
    ========================= */

    const supabase = await createClient();

    const {
      data: {
        user,
      },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Anda harus login untuk menggunakan Donara AI.",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================
       CARI / BUAT CONVERSATION
    ========================= */

    let conversationId =
      requestedConversationId;

    if (conversationId) {
      const {
        data: conversation,
        error: conversationError,
      } = await supabase
        .from("ai_conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single();

      if (
        conversationError ||
        !conversation
      ) {
        return NextResponse.json(
          {
            error:
              "Percakapan tidak ditemukan atau tidak dapat diakses.",
          },
          {
            status: 404,
          }
        );
      }
    } else {
      const {
        data: newConversation,
        error: createConversationError,
      } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: user.id,
          title: prompt.slice(0, 100),
        })
        .select("id")
        .single();

      if (
        createConversationError ||
        !newConversation
      ) {
        throw new Error(
          createConversationError?.message ||
            "Gagal membuat percakapan baru."
        );
      }

      conversationId =
        newConversation.id;
    }

    /* =========================
       AMBIL RIWAYAT CHAT
    ========================= */

    const {
      data: previousMessages,
      error: historyError,
    } = await supabase
      .from("ai_messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (historyError) {
      throw new Error(
        historyError.message
      );
    }

    const conversationHistory: ChatMessage[] =
      (previousMessages || [])
        .reverse()
        .map((message) => ({
          role:
            message.role === "assistant"
              ? "assistant"
              : "user",
          content: message.content,
        }));

    /* =========================
       AMBIL MEMORY USER
    ========================= */

    const {
      data: memoryData,
      error: memoryError,
    } = await supabase
      .from("ai_memories")
      .select("id, memory")
      .eq("user_id", user.id)
      .order("updated_at", {
        ascending: false,
      })
      .limit(20);

    if (memoryError) {
      console.error(
        "GAGAL_MENGAMBIL_MEMORY:",
        memoryError
      );
    }

    const memories: AIMemory[] =
      (memoryData || []).map((memory) => ({
        id: memory.id,
        memory: memory.memory,
      }));

    /* =========================
       SIMPAN PESAN USER
    ========================= */

    const {
      error: saveUserMessageError,
    } = await supabase
      .from("ai_messages")
      .insert({
        conversation_id: conversationId,
        role: "user",
        content: prompt,
      });

    if (saveUserMessageError) {
      throw new Error(
        saveUserMessageError.message
      );
    }

    let answer: string;
    let news: NewsItem[] = [];
    let mode: "chat" | "news" = "chat";

    /* =========================
       CHAT SEDERHANA
    ========================= */

    if (isSimpleGreeting(prompt)) {
      answer = await generateWithGemini(
        prompt,
        [],
        conversationHistory,
        memories
      );
    } else {
      /* =========================
         TENTUKAN MODE
      ========================= */

      const shouldSearchNews =
        needsNewsSearch(prompt);

      /* =========================
         CHAT NORMAL
      ========================= */

      if (!shouldSearchNews) {
        answer = await generateWithGemini(
          prompt,
          [],
          conversationHistory,
          memories
        );
      } else {
        /* =========================
           NEWS + AI
        ========================= */

        const keywords =
          extractKeywords(prompt);

        const searchQuery =
          keywords.length > 0
            ? keywords.join(" ")
            : prompt;

        news = await searchNews(
          searchQuery,
          keywords
        );

        if (news.length === 0) {
          answer = await generateWithGemini(
            prompt,
            [],
            conversationHistory,
            memories
          );
        } else {
          mode = "news";

          answer = await generateWithGemini(
            prompt,
            news,
            conversationHistory,
            memories
          );
        }
      }
    }

    /* =========================
       SIMPAN JAWABAN AI
    ========================= */

    const {
      error: saveAssistantMessageError,
    } = await supabase
      .from("ai_messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: answer,
      });

    if (saveAssistantMessageError) {
      throw new Error(
        saveAssistantMessageError.message
      );
    }

    /* =========================
       UPDATE WAKTU CONVERSATION
    ========================= */

    const { error: updateConversationError } =
      await supabase
        .from("ai_conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", user.id);

    if (updateConversationError) {
      console.error(
        "GAGAL_UPDATE_CONVERSATION:",
        updateConversationError
      );
    }

    /* =========================
       BUAT MEMORY BARU
    ========================= */

    const newMemories =
      await extractMemory(
        prompt,
        answer
      );

    await saveMemories(
      user.id,
      newMemories
    );

    /* =========================
       FORMAT SUMBER
    ========================= */

    const sources: SourceItem[] =
      news.map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        time: item.time,
        url: item.url,
      }));

    return NextResponse.json({
      success: true,
      mode,
      conversationId,
      prompt,
      answer,
      sources,
      newMemories,
    });
  } catch (error) {
    console.error(
      "DONARA_AI_ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memproses permintaan.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}