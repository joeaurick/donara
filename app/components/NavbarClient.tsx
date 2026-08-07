"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

type Props = {
  businessName: string;
  tagline: string;
  logo: string;
  phone: string;
  whatsappMessage: string;
};

const navigation = [
  ["Home", "#"],
  ["Tentang", "#about"],
  ["Menu", "#menu"],
  ["Gallery", "#gallery"],
  ["Review", "#review"],
  ["Kontak", "#kontak"],
] as const;

export default function NavbarClient({
  businessName,
  tagline,
  logo,
  phone,
  whatsappMessage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scroll
          ? "border-b border-pink-100 bg-white/90 shadow-lg backdrop-blur-xl"
          : "bg-white/75 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-pink-100/70 overflow-hidden">
  <Image
    src={logo || "/images/logo/logo.png"}
    alt={businessName}
    width={44}
    height={44}
    priority
    className="h-full w-full object-cover"
  />
</div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-none tracking-tight text-pink-600 sm:text-2xl lg:text-3xl">
              {businessName}
            </h1>

            <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
              {tagline}
            </p>
          </div>
        </a>

        {/* Desktop */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navigation.map(([label, link]) => (
            <a
              key={label}
              href={link}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-pink-50 hover:text-pink-600"
            >
              {label}

              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600"
          >
            Pesan Sekarang
          </a>
        </nav>

        {/* Tablet CTA */}
        <div className="hidden items-center md:flex lg:hidden">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Pesan
          </a>
        </div>

        {/* Mobile Button */}
        <button
  type="button"
  onClick={() => setOpen(!open)}
  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white/90 text-slate-700 shadow-sm transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 md:hidden"
  aria-label={open ? "Tutup menu" : "Buka menu"}
>
  <div
    className={`transform transition-transform duration-300 ${
      open ? "rotate-180 scale-110" : "rotate-0 scale-100"
    }`}
  >
    {open ? <X size={22} /> : <Menu size={22} />}
  </div>
</button>
      </div>

      {/* Mobile Menu */}
      <div
  className={`overflow-hidden border-t border-pink-100 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
    open
      ? "max-h-[520px] translate-y-0 opacity-100"
      : "max-h-0 -translate-y-2 opacity-0"
  }`}
>
  <nav className="flex flex-col gap-2 px-4 py-5 sm:px-6">
    {navigation.map(([label, link]) => (
      <a
        key={label}
        href={link}
        className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 active:scale-[0.99]"
        onClick={() => setOpen(false)}
      >
        <span>{label}</span>
        <span className="text-pink-400 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </a>
    ))}

    <div className="mt-3 rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">
        Siap pesan donat hari ini?
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        Hubungi Donara melalui WhatsApp untuk pemesanan cepat dan informasi menu terbaru.
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-600 to-orange-500 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-pink-700 hover:to-orange-600"
        onClick={() => setOpen(false)}
      >
        Pesan Sekarang
      </a>
    </div>
  </nav>
</div>
    </header>
  );
}