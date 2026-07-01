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

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scroll
          ? "bg-white/95 shadow-lg backdrop-blur-md"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <a
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src={logo || "/images/logo/logo.png"}
            alt={businessName}
            width={42}
            height={42}
            priority
          />

          <div>

            <h1 className="text-3xl font-black leading-none text-pink-600">
              {businessName}
            </h1>

            <p className="text-xs text-gray-500">
            {tagline}
            </p>

          </div>

        </a>

        {/* Desktop */}

        <nav className="hidden items-center gap-8 md:flex">

          {[
            ["Home", "#"],
            ["Tentang", "#about"],
            ["Menu", "#menu"],
            ["Gallery", "#gallery"],
            ["Review", "#review"],
            ["Kontak", "#kontak"],
          ].map(([label, link]) => (
            <a
              key={label}
              href={link}
              className="relative font-semibold text-gray-800 transition hover:text-pink-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-pink-600 after:transition-all hover:after:w-full"
            >
              {label}
            </a>
          ))}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pink-600 px-6 py-2.5 font-semibold text-white transition hover:scale-105 hover:bg-pink-700"
          >
            Pesan
          </a>

        </nav>

        {/* Mobile */}

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {open && (
        <div className="border-t bg-white md:hidden">

          <nav className="flex flex-col px-6 py-4">

            {[
              ["Home", "#"],
              ["Tentang", "#about"],
              ["Menu", "#menu"],
              ["Gallery", "#gallery"],
              ["Review", "#review"],
              ["Kontak", "#kontak"],
            ].map(([label, link]) => (
              <a
                key={label}
                href={link}
                className="py-3 font-medium text-gray-700"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full bg-pink-600 py-3 text-center font-semibold text-white"
            >
              Pesan Sekarang
            </a>

          </nav>

        </div>
      )}
    </header>
  );
}