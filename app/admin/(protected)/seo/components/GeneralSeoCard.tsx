"use client";

type FormType = {
  site_title: string;
  homepage_h1: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  focus_keyword: string;
  robots: string;
  og_image: string;
  favicon: string;
  google_analytics: string;
  google_verification: string;
};

type Props = {
  form: FormType;
  setForm: React.Dispatch<
    React.SetStateAction<FormType>
  >;
};

export default function GeneralSeoCard({
  form,
  setForm,
}: Props) {

  const titleLength = form.site_title.length;
  const descriptionLength =
    form.meta_description.length;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="mb-10">

        <h2 className="text-3xl font-black text-pink-600">
          🌐 General SEO
        </h2>

        <p className="mt-2 text-gray-500">
          Kelola pengaturan utama SEO website Donara.
        </p>

      </div>

      <div className="space-y-8">

        {/* Website Title */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Website Title
          </label>

          <p className="mb-3 text-gray-500">
            Judul yang tampil pada Google dan tab browser.
          </p>

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="Donara Street Food | Donat Premium Fresh Bekasi"
            value={form.site_title}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                site_title:e.target.value
              }))
            }
          />

          <div className="mt-2 flex justify-between">

            <span className="text-sm text-gray-400">
              {titleLength} karakter
            </span>

            {titleLength >= 50 &&
            titleLength <= 60 ? (
              <span className="font-semibold text-green-600">
                Ideal
              </span>
            ) : (
              <span className="font-semibold text-orange-500">
                Disarankan 50-60 karakter
              </span>
            )}

          </div>

        </div>

        {/* Homepage H1 */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Homepage H1
          </label>

          <p className="mb-3 text-gray-500">
            Judul utama yang tampil pada halaman depan website.
          </p>

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="Donat Premium Fresh dengan Topping Melimpah di Bekasi Barat"
            value={form.homepage_h1}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                homepage_h1:e.target.value
              }))
            }
          />

        </div>

        {/* Meta Description */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Meta Description
          </label>

          <p className="mb-3 text-gray-500">
            Deskripsi yang tampil pada hasil pencarian Google.
          </p>

          <textarea
            rows={5}
            className="w-full rounded-2xl border p-4"
            placeholder="Nikmati donat premium..."
            value={form.meta_description}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                meta_description:e.target.value
              }))
            }
          />

          <div className="mt-2 flex justify-between">

            <span className="text-sm text-gray-400">
              {descriptionLength}/160
            </span>

            {descriptionLength >= 140 &&
            descriptionLength <= 160 ? (
              <span className="font-semibold text-green-600">
                Ideal
              </span>
            ) : (
              <span className="font-semibold text-orange-500">
                Disarankan 140-160 karakter
              </span>
            )}

          </div>

        </div>

        {/* Focus Keyword */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Focus Keyword
          </label>

          <p className="mb-3 text-gray-500">
            Keyword utama yang ingin ditargetkan.
          </p>

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="donat bekasi"
            value={form.focus_keyword}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                focus_keyword:e.target.value
              }))
            }
          />

        </div>

        {/* Keywords */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Additional Keywords
          </label>

          <p className="mb-3 text-gray-500">
            Pisahkan menggunakan tanda koma (,).
          </p>

          <textarea
            rows={4}
            className="w-full rounded-2xl border p-4"
            placeholder="donat bekasi, donat premium bekasi, donat kranji"
            value={form.keywords}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                keywords:e.target.value
              }))
            }
          />

        </div>

        {/* Canonical */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Canonical URL
          </label>

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="https://donara.id"
            value={form.canonical_url}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                canonical_url:e.target.value
              }))
            }
          />

        </div>

        {/* Robots */}

        <div>

          <label className="mb-2 block text-lg font-bold">
            Robots Meta
          </label>

          <select
            className="w-full rounded-2xl border p-4"
            value={form.robots}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                robots:e.target.value
              }))
            }
          >
            <option value="index,follow">
              index,follow
            </option>

            <option value="noindex,nofollow">
              noindex,nofollow
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}