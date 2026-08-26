"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Globe2,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

type NewsItem = {
  title: string;
  source: string;
  time: string;
  description: string;
  url: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  news?: NewsItem[];
};

type ConversationHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "donara-ai-conversation";

const suggestions = [
  "Cari berita bisnis dan ekonomi terbaru hari ini",
  "Apa berita terbaru tentang teknologi AI?",
  "Cari berita terbaru yang berpengaruh pada bisnis kuliner",
  "Ringkas berita penting hari ini",
];

export default function DonaraAIPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState<number | null>(null);
  const [isMemoryLoaded, setIsMemoryLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const savedConversation = localStorage.getItem(STORAGE_KEY);

      if (savedConversation) {
        const parsedConversation = JSON.parse(savedConversation);

        if (Array.isArray(parsedConversation)) {
          const validMessages = parsedConversation.filter(
            (message): message is Message =>
              message &&
              typeof message === "object" &&
              typeof message.id === "number" &&
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string"
          );

          setMessages(validMessages);
        }
      }
    } catch (error) {
      console.error(
        "DONARA_AI_MEMORY_LOAD_ERROR:",
        error
      );
    } finally {
      setIsMemoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isMemoryLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "DONARA_AI_MEMORY_SAVE_ERROR:",
        error
      );
    }
  }, [messages, isMemoryLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  function getConversationHistory(): ConversationHistoryItem[] {
    return messages
      .filter(
        (message) =>
          message.content.trim().length > 0
      )
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const question = prompt.trim();

    if (!question || loading) {
      return;
    }

    const conversationHistory =
      getConversationHistory();

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setPrompt("");
    setLoading(true);
    setShowSources(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Gagal memproses permintaan."
        );
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
        news: data.sources || [],
      };

      setMessages((current) => [
        ...current,
        aiMessage,
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses permintaan.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Maaf, ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function useSuggestion(value: string) {
    if (loading) {
      return;
    }

    setPrompt(value);
  }

  function clearConversation() {
    if (loading) {
      return;
    }

    setMessages([]);
    setShowSources(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(
        "DONARA_AI_MEMORY_CLEAR_ERROR:",
        error
      );
    }
  }

  function renderMessageContent(content: string) {
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map((paragraph, index) => {
      const lines = paragraph.split("\n");

      return (
        <div
          key={`${index}-${paragraph.slice(0, 30)}`}
          className={index > 0 ? "mt-4" : ""}
        >
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              return null;
            }

            const cleanLine = trimmedLine
              .replace(/^\*\*(.+)\*\*$/, "$1")
              .trim();

            if (
              trimmedLine.startsWith("- ") ||
              trimmedLine.startsWith("• ")
            ) {
              return (
                <div
                  key={`${lineIndex}-${trimmedLine}`}
                  className="mt-2 flex gap-3"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />

                  <p>{trimmedLine.slice(2)}</p>
                </div>
              );
            }

            const numberedMatch = trimmedLine.match(
              /^(\d+)\.\s+(.+)$/
            );

            if (numberedMatch) {
              return (
                <div
                  key={`${lineIndex}-${trimmedLine}`}
                  className="mt-3 flex gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[11px] font-bold text-amber-300">
                    {numberedMatch[1]}
                  </span>

                  <p className="pt-0.5">
                    {numberedMatch[2]}
                  </p>
                </div>
              );
            }

            return (
              <p
                key={`${lineIndex}-${trimmedLine}`}
                className={
                  lineIndex > 0
                    ? "mt-2.5"
                    : ""
                }
              >
                {cleanLine}
              </p>
            );
          })}
        </div>
      );
    });
  }

  return (
    <main className="min-h-screen w-full bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden border-x border-white/[0.06] bg-[#111113]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/[0.035] blur-[120px]" />

        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-orange-500/[0.025] blur-[120px]" />

        <header className="relative z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#111113]/80 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1d] shadow-[0_8px_25px_rgba(0,0,0,0.25)]">
              <Image
                src="/images/logo/logo-new.png"
                alt="Donara"
                width={44}
                height={44}
                priority
                className="h-full w-full object-contain p-1.5"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  Donara AI
                </h1>

                <span className="rounded-md border border-amber-400/20 bg-amber-400/[0.07] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-300">
                  Beta
                </span>
              </div>

              <p className="mt-0.5 text-xs text-zinc-500">
                Cari dan pahami informasi terbaru.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                disabled={loading}
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-zinc-500 transition hover:border-red-400/20 hover:bg-red-400/[0.07] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                aria-label="Hapus percakapan"
                title="Hapus percakapan"
              >
                <Trash2 size={16} />
              </button>
            )}

            <Link
  href="/admin"
  className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-medium text-zinc-400 transition hover:border-amber-400/20 hover:bg-amber-400/[0.07] hover:text-amber-300"
>
  ← Menu ADMIN
</Link>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              Online
            </div>
          </div>
        </header>

        <section className="relative z-10 min-h-[calc(100vh-150px)] flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-[520px] max-w-3xl flex-col items-center justify-center pb-12">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-amber-400/[0.06] blur-3xl" />

                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/[0.1] bg-[#18181b] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/images/logo/logo-new.png"
                    alt="Donara AI"
                    width={82}
                    height={82}
                    priority
                    className="h-full w-full object-contain p-2.5"
                  />
                </div>
              </div>

              <h2 className="mt-8 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Apa yang ingin Anda ketahui?
              </h2>

              <p className="mt-3 max-w-xl text-center text-sm leading-6 text-zinc-500">
                Cari informasi terbaru, pahami berbagai
                sumber, dan dapatkan jawaban yang lebih
                ringkas dan mudah dipahami.
              </p>

              <div className="mt-9 grid w-full gap-3 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      useSuggestion(suggestion)
                    }
                    disabled={loading}
                    className="group flex min-h-[88px] items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/20 hover:bg-white/[0.045] hover:shadow-[0_15px_40px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.07] text-amber-300 transition-transform duration-200 group-hover:scale-105">
                      <Search size={17} />
                    </span>

                    <span className="pt-1 text-sm font-medium leading-5 text-zinc-300 transition-colors group-hover:text-white">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl space-y-9">
              {messages.map((message) => {
                const hasSources =
                  message.role === "assistant" &&
                  message.news &&
                  message.news.length > 0;

                const isSourcesOpen =
                  showSources === message.id;

                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mr-3 mt-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#18181b] shadow-[0_5px_18px_rgba(0,0,0,0.2)]">
                        <Image
                          src="/images/logo/logo-new.png"
                          alt="Donara AI"
                          width={36}
                          height={36}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    )}

                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[85%] rounded-[1.5rem] rounded-br-md border border-amber-400/10 bg-[#2a2119] px-5 py-3.5 text-sm leading-6 text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sm:max-w-[70%]"
                          : "min-w-0 max-w-[calc(100%-3rem)] flex-1 pt-1 text-sm leading-7 text-zinc-300"
                      }
                    >
                      {message.role === "user" ? (
                        <p>{message.content}</p>
                      ) : (
                        <div className="space-y-3">
                          {renderMessageContent(
                            message.content
                          )}
                        </div>
                      )}

                      {hasSources && (
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() =>
                              setShowSources((current) =>
                                current === message.id
                                  ? null
                                  : message.id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-xs font-medium text-zinc-400 transition hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-zinc-200"
                          >
                            <Globe2 size={14} />

                            <span>
                              {message.news?.length} sumber
                            </span>

                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isSourcesOpen
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          {isSourcesOpen && (
                            <div className="mt-3 space-y-1.5 border-l border-white/[0.08] pl-3">
                              {message.news?.map(
                                (news, index) => (
                                  <a
                                    key={`${news.url}-${index}`}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.035]"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-bold text-amber-400">
                                          [{index + 1}]
                                        </span>

                                        <span className="text-[11px] font-medium text-zinc-500">
                                          {news.source}
                                        </span>

                                        <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                                          <Clock3 size={10} />

                                          {news.time}
                                        </span>
                                      </div>

                                      <p className="mt-1.5 text-xs font-medium leading-5 text-zinc-400 transition group-hover:text-zinc-100">
                                        {news.title}
                                      </p>
                                    </div>

                                    <ExternalLink
                                      size={14}
                                      className="mt-1 shrink-0 text-zinc-600 transition group-hover:text-amber-400"
                                    />
                                  </a>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start">
                  <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#18181b]">
                    <Image
                      src="/images/logo/logo-new.png"
                      alt="Donara AI"
                      width={36}
                      height={36}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div className="flex h-9 items-center gap-1.5 px-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <div className="sticky bottom-0 z-20 border-t border-white/[0.06] bg-[#111113]/85 px-4 py-4 backdrop-blur-2xl sm:px-8 sm:py-5">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-4xl items-center gap-2 rounded-[1.5rem] border border-white/[0.1] bg-[#1a1a1d] p-2 shadow-[0_15px_50px_rgba(0,0,0,0.35)] transition focus-within:border-white/[0.16] focus-within:bg-[#1d1d20]"
          >
            <input
  type="text"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  placeholder="Tanyakan sesuatu..."
  disabled={loading}
  autoComplete="off"
  style={{
    color: "#FFFFFF",
    opacity: 1,
  }}
  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base font-semibold placeholder:text-zinc-500 caret-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
/>

            <button
              type="submit"
              disabled={
                !prompt.trim() || loading
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-[0_5px_20px_rgba(255,255,255,0.08)] transition-all hover:scale-[1.03] hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Kirim pertanyaan"
            >
              {loading ? (
                <Sparkles
                  size={18}
                  className="animate-pulse"
                />
              ) : (
                <ArrowUp
                  size={19}
                  strokeWidth={2.8}
                />
              )}
            </button>
          </form>

          <p className="mx-auto mt-3 flex max-w-4xl items-center justify-center gap-1.5 text-center text-[10px] text-zinc-600">
            <Check size={11} />
            Percakapan disimpan di perangkat ini.
            Informasi dapat berubah dan jawaban
            didasarkan pada sumber yang tersedia.
          </p>
        </div>
      </div>
    </main>
  );
}