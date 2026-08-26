import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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
   RESPONSE LOKAL
========================= */

function generateLocalResponse(
  prompt: string,
  news: NewsItem[] = []
): string {
  const normalized = prompt
    .toLowerCase()
    .trim()
    .replace(/[!?.,]/g, "");

  if (
    normalized === "halo" ||
    normalized === "hai" ||
    normalized === "hi" ||
    normalized === "hello"
  ) {
    return "Halo, ada yang bisa saya bantu?";
  }

  if (
    normalized === "apa kabar"
  ) {
    return "Baik. Ada yang ingin Anda cari atau ketahui?";
  }

  if (
    normalized === "tes" ||
    normalized === "test"
  ) {
    return "Sistem berjalan dengan baik.";
  }

  if (news.length > 0) {
    if (news.length === 1) {
      return `Saya menemukan 1 berita yang relevan dengan pertanyaan Anda. Silakan lihat hasil dan sumber yang tersedia.`;
    }

    return `Saya menemukan ${news.length} berita yang relevan dengan pertanyaan Anda. Hasil yang paling relevan telah ditampilkan beserta sumbernya.`;
  }

  if (needsNewsSearch(prompt)) {
    return "Saya belum menemukan berita yang cukup relevan dengan pencarian tersebut.";
  }

  return "Saat ini saya dapat membantu mencari informasi dan berita berdasarkan kata kunci. Coba tanyakan berita atau informasi terbaru yang ingin Anda cari.";
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
       TENTUKAN RESPONSE
    ========================= */

    let answer = "";

    let news: NewsItem[] = [];

    let mode: "chat" | "news" =
      "chat";

    if (isSimpleGreeting(prompt)) {
      answer =
        generateLocalResponse(prompt);
    } else {
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

      answer = generateLocalResponse(
        prompt,
        news
      );
    }

    /* =========================
       SIMPAN JAWABAN
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