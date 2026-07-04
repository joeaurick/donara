"use client";

import { useEffect, useState } from "react";

import { getProducts } from "@/lib/supabase/products";
import {
  getTodayStock,
  refreshTodayStock,
  closeTodayStock,
  isTodayClosed,
} from "@/lib/supabase/daily-stock";

import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";
import MobileCartSheet from "../components/MobileCartSheet";
import DailyStockModal from "../components/DailyStockModal";

import { useMobileCart } from "../context/MobileCartContext";
import { useCart } from "../context/CartContext";
import DashboardHeader from "../components/DashboardHeader";
import PackagePickerModal from "../components/PackagePickerModal";
import usePackagePicker from "../hooks/usePackagePicker";


type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;

  is_package: boolean;
  package_size: number;

  category: string | null;
  package_type: string | null;
};

export default function PosDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [todayStock, setTodayStock] = useState<any>(null);
  const [todayClosed, setTodayClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  const { openCart } = useMobileCart();
  const {
  cart,
  addPackageToCart,
} = useCart();
  const packagePicker = usePackagePicker();

  useEffect(() => {
    loadProducts();
    checkTodayStock();
  }, []);

  useEffect(() => {
  async function reloadStock() {
    const stock = await refreshTodayStock();

    if (stock) {
      setTodayStock(stock);
    }
  }

  window.addEventListener("stock-updated", reloadStock);

  return () => {
    window.removeEventListener(
      "stock-updated",
      reloadStock
    );
  };
}, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data ?? []);
  }

  async function checkTodayStock() {
  const stock = await getTodayStock();

  if (!stock) {
    setStockModalOpen(true);
    return;
  }

  setTodayStock(stock);

  const closed = await isTodayClosed();
  setTodayClosed(closed);
}

  async function handleStockSaved() {
  setStockModalOpen(false);

  const stock = await getTodayStock();

  setTodayStock(stock);
}

async function handleCloseDay() {
  if (!confirm("Tutup operasional hari ini?")) {
    return;
  }

  try {
    setClosing(true);

    await closeTodayStock();

    setTodayClosed(true);

    alert("Operasional hari ini berhasil ditutup.");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setClosing(false);
  }
}

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalItem = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  console.log(packagePicker.selectedPackage);
  const donuts = products.filter((x: any) => {
  if (x.is_package) return false;

  if (!packagePicker.selectedPackage) return false;

  if (
    packagePicker.selectedPackage.package_type ===
    "hemat"
  ) {
    return x.category === "hemat";
  }

  return x.category === "normal";
});

  return (
    <>
      <DailyStockModal
        open={stockModalOpen}
        onSaved={handleStockSaved}
      />

      <main className="flex h-screen flex-col bg-gray-100">

        {/* HEADER */}

        <DashboardHeader
        todayStock={todayStock}
        todayClosed={todayClosed}
       closing={closing}
        handleCloseDay={handleCloseDay}
      />

        

        {/* CONTENT */}

        <div className="flex flex-1 overflow-hidden">

          <section className="flex min-w-0 flex-1 flex-col">

            <div className="border-b bg-white p-4">

  <div className="flex items-center gap-4">

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Cari produk..."
      className="flex-1 rounded-2xl border p-4 outline-none focus:border-pink-500"
    />

    <button
      onClick={loadProducts}
      className="rounded-xl border px-5 py-4 font-bold hover:bg-gray-100"
    >
      Refresh
    </button>

  </div>

</div>

            <div className="flex-1 overflow-y-auto p-4">

              <ProductGrid
              products={filtered}
              onPackageClick={packagePicker.openPicker}
              />

            </div>

          </section>

          <aside className="hidden h-full w-[420px] shrink-0 border-l bg-white xl:flex">

            <CartPanel />

          </aside>

        </div>

        <div className="border-t bg-white p-3 xl:hidden">

          <button
            onClick={openCart}
            className="w-full rounded-2xl bg-pink-600 p-4 text-left text-white"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="font-bold">
                  Keranjang
                </div>

                <div className="text-sm text-pink-100">

                  {cart.length === 0
                    ? "Belum ada produk"
                    : cart
                        .slice(0, 2)
                        .map((item) => `${item.name} (${item.qty})`)
                        .join(", ") +
                      (cart.length > 2
                        ? ` +${cart.length - 2} lainnya`
                        : "")}

                </div>

              </div>

              <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">

                {totalItem} Item

              </div>

            </div>

          </button>

        </div>

        <MobileCartSheet />

<PackagePickerModal
  open={packagePicker.open}
  title={
    packagePicker.selectedPackage?.name ?? ""
  }
  maxSelect={
    packagePicker.selectedPackage
      ?.package_size ?? 0
  }
  products={donuts}
  selected={packagePicker.selectedProducts}
  onIncrease={packagePicker.increase}
  onDecrease={packagePicker.decrease}
  onClose={packagePicker.closePicker}
  onSave={packagePicker.savePackage}
/>

      </main>
    </>
  );
}