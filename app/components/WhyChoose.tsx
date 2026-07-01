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
      "Semua donat dibuat setiap hari agar selalu lembut dan nikmat.",
  },
  {
    icon: BadgeCheck,
    title: "Bahan Premium",
    description:
      "Menggunakan bahan pilihan dengan kualitas terbaik.",
  },
  {
    icon: HeartHandshake,
    title: "Dibuat dengan Cinta",
    description:
      "Setiap donat dibuat dengan perhatian terhadap rasa dan kualitas.",
  },
  {
    icon: Truck,
    title: "Siap Dipesan",
    description:
      "Pesan melalui WhatsApp dengan proses yang cepat dan mudah.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 bg-pink-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="text-pink-600 font-semibold">
            Keunggulan Kami
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-black text-gray-900">
            Kenapa Memilih Donara?
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-gray-600 leading-8">
            Kami berkomitmen menghadirkan donat berkualitas tinggi
            dengan rasa yang konsisten dan pelayanan terbaik.
          </p>

        </div>

        <div className="grid gap-8 mt-20 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">

                  <Icon
                    size={32}
                    className="text-pink-600"
                  />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-7">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}