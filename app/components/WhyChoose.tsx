import {
  Sparkles,
  HeartHandshake,
  Truck,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Fresh Setiap Hari",
    description:
      "Semua donat dibuat setiap hari agar selalu lembut, empuk, dan nikmat saat sampai ke pelanggan.",
  },
  {
    icon: BadgeCheck,
    title: "Bahan Premium",
    description:
      "Menggunakan bahan pilihan dengan kualitas terbaik untuk menjaga rasa dan tekstur tetap konsisten.",
  },
  {
    icon: HeartHandshake,
    title: "Dibuat dengan Cinta",
    description:
      "Setiap donat dibuat dengan perhatian terhadap rasa, kualitas, dan kepuasan pelanggan di setiap gigitan.",
  },
  {
    icon: Truck,
    title: "Siap Dipesan",
    description:
      "Pesan melalui WhatsApp dengan proses yang cepat, mudah, dan responsif untuk kebutuhan harian maupun acara spesial.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>✨</span>
            <span>Keunggulan Kami</span>
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Kenapa Memilih Donara?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Kami berkomitmen menghadirkan donat berkualitas tinggi dengan rasa
            yang konsisten, bahan terbaik, dan pelayanan yang selalu
            mengutamakan kepuasan pelanggan.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl lg:p-7"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-transparent to-orange-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/20 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900 lg:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}