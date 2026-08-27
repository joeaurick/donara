import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/* =========================
   DONARA AI SERVER
========================= */

const DONARA_AI_SERVER_URL =
  (
    process.env.DONARA_AI_SERVER_URL ||
    "https://transcription-size-corner-growing.trycloudflare.com"
  ).replace(/\/$/, "");

/* =========================
   TYPES
========================= */

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

type DonaraAIResponse = {
  success?: boolean;
  answer?: string;
  error?: string;
  detail?: string;
};

/* =========================
   HELPER
========================= */

function getText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "#text" in value
  ) {
    const text = (
      value as {
        "#text"?: unknown;
      }
    )["#text"];

    return typeof text === "string"
      ? text
      : "";
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

/* =========================
   DONARA AI SERVER
========================= */

async function askDonaraAI(
  prompt: string,
  news: NewsItem[] = []
): Promise<string> {
  const newsContext =
    news.length > 0
      ? news
          .map(
            (item, index) =>
              `${index + 1}. ${item.title}\n` +
              `Sumber: ${item.source}\n` +
              `Waktu: ${item.time}\n` +
              `Deskripsi: ${item.description}\n` +
              `URL: ${item.url}`
          )
          .join("\n\n")
      : "";

  const aiPrompt = newsContext
    ? `Jawab pertanyaan pengguna dalam bahasa Indonesia.

Anda adalah Donara AI.

Pertanyaan pengguna:
${prompt}

Berikut adalah informasi berita yang ditemukan:

${newsContext}

Gunakan informasi berita tersebut sebagai konteks untuk menjawab pertanyaan pengguna.

Jangan membuat fakta baru yang tidak didukung oleh informasi yang tersedia.

Buat jawaban yang:
- jelas
- natural
- mudah dipahami
- ringkas tetapi tetap informatif

Jangan menampilkan URL sumber di dalam jawaban karena sumber sudah ditampilkan terpisah di aplikasi.`
    : `Anda adalah Donara AI, asisten AI yang membantu pengguna dalam bahasa Indonesia.

Jawab pertanyaan pengguna secara natural, jelas, membantu, dan mudah dipahami.

Pertanyaan pengguna:
${prompt}`;

  let response: Response;

  try {
    response = await fetch(
      `${DONARA_AI_SERVER_URL}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
        }),
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error(
      "DONARA_AI_SERVER_CONNECTION_ERROR:",
      error
    );

    throw new Error(
      "Tidak dapat terhubung ke Donara AI Server. Pastikan FastAPI dan Cloudflare Tunnel sedang berjalan."
    );
  }

  const responseText =
    await response.text();

  let data: DonaraAIResponse;

  try {
    data = JSON.parse(
      responseText
    ) as DonaraAIResponse;
  } catch {
    console.error(
      "DONARA_AI_SERVER_NON_JSON_RESPONSE:",
      {
        status: response.status,
        statusText: response.statusText,
        responseText,
      }
    );

    throw new Error(
      `Donara AI Server mengembalikan respons yang bukan JSON. Status: ${response.status}. Kemungkinan Cloudflare Tunnel bermasalah atau URL tunnel sudah berubah.`
    );
  }

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : typeof data.error === "string"
          ? data.error
          : `Donara AI Server gagal memproses permintaan. Status: ${response.status}`
    );
  }

  if (
    !data ||
    typeof data.answer !== "string" ||
    !data.answer.trim()
  ) {
    console.error(
      "DONARA_AI_SERVER_INVALID_RESPONSE:",
      data
    );

    throw new Error(
      "Donara AI Server tidak memberikan jawaban yang valid."
    );
  }

  return data.answer.trim();
}

/* =========================
   FORMAT WAKTU BERITA
========================= */

function formatNewsTime(
  pubDate?: string
): string {
  if (!pubDate) {
    return "Baru saja";
  }

  const date = new Date(pubDate);

  if (Number.isNaN(date.getTime())) {
    return pubDate;
  }

  const diff =
    Date.now() - date.getTime();

  if (diff < 0) {
    return date.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const minutes = Math.floor(
    diff / 60000
  );

  const hours = Math.floor(
    diff / 3600000
  );

  const days = Math.floor(
    diff / 86400000
  );

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

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================
   DETEKSI CHAT SEDERHANA
========================= */

function isSimpleGreeting(
  prompt: string
): boolean {
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

function needsNewsSearch(
  prompt: string
): boolean {
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

  return newsKeywords.some(
    (keyword) => text.includes(keyword)
  );
}

/* =========================
   EKSTRAK KEYWORD
========================= */

function extractKeywords(
  prompt: string
): string[] {
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
    .replace(
      /[^\p{L}\p{N}\s-]/gu,
      " "
    )
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
   HITUNG RELEVANSI
========================= */

function calculateRelevance(
  item: Omit<NewsItem, "id">,
  keywords: string[]
): number {
  if (keywords.length === 0) {
    return 1;
  }

  const title =
    item.title.toLowerCase();

  const description =
    item.description.toLowerCase();

  const source =
    item.source.toLowerCase();

  let score = 0;

  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      score += 5;
    }

    if (
      description.includes(keyword)
    ) {
      score += 3;
    }

    if (source.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

/* =========================
   AMBIL GOOGLE NEWS
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

        const sourceData =
          item.source;

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
            typeof sourceObject[
              "#text"
            ] === "string"
          ) {
            source =
              sourceObject[
                "#text"
              ] as string;
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
      (
        item: Omit<NewsItem, "id">
      ) =>
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
    .sort(
      (a, b) => b.score - a.score
    );

  return scoredNews
    .slice(0, 8)
    .map(
      ({ item }, index) => ({
        ...item,
        id: index + 1,
      })
    );
}

/* =========================
   GET CONVERSATION
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    const conversationId =
      request.nextUrl.searchParams.get(
        "conversationId"
      );

    if (!conversationId) {
      return NextResponse.json(
        {
          messages: [],
        }
      );
    }

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

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
            "Percakapan tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: messages,
      error: messagesError,
    } = await supabase
      .from("ai_messages")
      .select(
        "id, role, content, created_at"
      )
      .eq(
        "conversation_id",
        conversationId
      )
      .order("created_at", {
        ascending: true,
      });

    if (messagesError) {
      throw new Error(
        messagesError.message
      );
    }

    return NextResponse.json({
      conversationId,
      messages: messages || [],
    });
  } catch (error) {
    console.error(
      "DONARA_AI_GET_ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal memuat percakapan.";

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

/* =========================
   POST DONARA AI
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";

    const requestedConversationId =
      typeof body.conversationId ===
        "string" &&
      body.conversationId.trim()
        ? body.conversationId.trim()
        : null;

    if (!prompt) {
      return NextResponse.json(
        {
          error:
            "Prompt tidak boleh kosong.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       SUPABASE + USER
    ========================= */

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

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
       SIMPAN PESAN USER
    ========================= */

    const {
      data: savedUserMessage,
      error: saveUserMessageError,
    } = await supabase
      .from("ai_messages")
      .insert({
        conversation_id:
          conversationId,
        role: "user",
        content: prompt,
      })
      .select("id")
      .single();

    if (saveUserMessageError) {
      throw new Error(
        saveUserMessageError.message
      );
    }

    /* =========================
       TENTUKAN MODE + NEWS
    ========================= */

    let news: NewsItem[] = [];

    let mode: "chat" | "news" =
      "chat";

    if (!isSimpleGreeting(prompt)) {
      const shouldSearchNews =
        needsNewsSearch(prompt);

      if (shouldSearchNews) {
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

        mode = "news";
      }
    }

    /* =========================
       TANYAKAN KE DONARA AI
    ========================= */

    const answer = await askDonaraAI(
      prompt,
      news
    );

    /* =========================
       SIMPAN JAWABAN AI
    ========================= */

    const {
      data: savedAssistantMessage,
      error: saveAssistantMessageError,
    } = await supabase
      .from("ai_messages")
      .insert({
        conversation_id:
          conversationId,
        role: "assistant",
        content: answer,
      })
      .select("id")
      .single();

    if (saveAssistantMessageError) {
      throw new Error(
        saveAssistantMessageError.message
      );
    }

    /* =========================
       UPDATE CONVERSATION
    ========================= */

    const {
      error: updateConversationError,
    } = await supabase
      .from("ai_conversations")
      .update({
        updated_at:
          new Date().toISOString(),
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

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      success: true,
      mode,
      conversationId,
      userMessageId:
        savedUserMessage?.id ?? null,
      assistantMessageId:
        savedAssistantMessage?.id ?? null,
      prompt,
      answer,
      sources,
    });
  } catch (error) {
    console.error(
      "DONARA_AI_POST_ERROR:",
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

/* =========================
   DELETE CONVERSATION
========================= */

export async function DELETE(
  request: NextRequest
) {
  try {
    const conversationId =
      request.nextUrl.searchParams.get(
        "conversationId"
      );

    if (!conversationId) {
      return NextResponse.json(
        {
          error:
            "conversationId wajib diberikan.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Anda harus login.",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================
       CEK KEPEMILIKAN CONVERSATION
    ========================= */

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

    /* =========================
       HAPUS MESSAGES
    ========================= */

    const {
      error: deleteMessagesError,
    } = await supabase
      .from("ai_messages")
      .delete()
      .eq(
        "conversation_id",
        conversationId
      );

    if (deleteMessagesError) {
      throw new Error(
        deleteMessagesError.message
      );
    }

    /* =========================
       HAPUS CONVERSATION
    ========================= */

    const {
      error: deleteConversationError,
    } = await supabase
      .from("ai_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", user.id);

    if (deleteConversationError) {
      throw new Error(
        deleteConversationError.message
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DONARA_AI_DELETE_ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal menghapus percakapan.";

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