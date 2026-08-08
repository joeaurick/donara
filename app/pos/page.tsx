import Link from "next/link";

export default function PosPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
            🍩
          </div>

          <h1 className="text-4xl font-black text-pink-600">
            DONARA POS
          </h1>

          <p className="mt-3 text-gray-500">
            Point of Sale
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/pos/login"
            className="block rounded-2xl bg-pink-600 py-4 text-center font-bold text-white transition hover:bg-pink-700"
          >
            Masuk POS
          </Link>

          <Link
            href="/"
            className="block rounded-2xl border border-gray-200 py-4 text-center font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Kembali ke Website
          </Link>
        </div>
      </div>
    </main>
  );
}