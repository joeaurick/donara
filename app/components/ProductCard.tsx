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
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">

      {/* Badge */}

      <div className="absolute left-5 top-5 z-20 rounded-full bg-pink-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
        Best Seller
      </div>

      {/* Image */}

      <div className="bg-gradient-to-b from-pink-50 to-orange-50 p-8">

        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          priority
          className="mx-auto h-56 w-auto object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-6"
        />

      </div>

      {/* Content */}

      <div className="space-y-4 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold text-gray-900">
            {name}
          </h3>

          <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-600">
            ⭐ {rating}.0
          </div>

        </div>

        <p className="leading-7 text-gray-600">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">

          <div>

            <p className="text-sm text-gray-400">
              Mulai dari
            </p>

            <h4 className="text-3xl font-black text-pink-600">
              Rp {price.toLocaleString("id-ID")}
            </h4>

          </div>

          <a
            href={`https://wa.me/6287837970001?text=Halo%20Donara,%20saya%20ingin%20memesan%20${encodeURIComponent(
              name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Pesan
          </a>

        </div>

      </div>

    </div>
  );
}