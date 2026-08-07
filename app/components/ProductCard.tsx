import Image from "next/image";

type ProductProps = {
  name: string;
  image: string;
  price: number;
  rating: number;
  description: string;
};

export default function ProductCard({
  name,
  image,
  price,
  rating,
  description,
}: ProductProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white/85 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-100/40">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-50/40 via-transparent to-orange-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Badge */}
      <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg sm:left-5 sm:top-5 sm:px-4 sm:py-2">
        <span>🔥</span>
        <span>Best Seller</span>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-white to-orange-50 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.12),transparent_60%)] opacity-80" />

        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          priority
          className="relative z-10 mx-auto h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:h-52 md:h-56"
        />
      </div>

      {/* Content */}
      <div className="relative space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
              {name}
            </h3>

            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-pink-500">
              Donat Premium
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-600 shadow-sm">
            ⭐ {rating.toFixed(1)}
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-pink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Mulai dari
            </p>

            <h4 className="mt-1 text-2xl font-black tracking-tight text-pink-600 sm:text-3xl">
              Rp {price.toLocaleString("id-ID")}
            </h4>
          </div>

          <a
            href={`https://wa.me/6287837970001?text=Halo%20Donara,%20saya%20ingin%20memesan%20${encodeURIComponent(
              name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600 hover:shadow-xl sm:h-11 sm:px-6 sm:text-base"
          >
            Pesan Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}