"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import { getProducts } from "@/lib/supabase/products";
import {
  getTodayStock,
  closeTodayStock,
  isTodayClosed,
  saveOrUpdateTodayStock,
} from "@/lib/supabase/daily-stock";

import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";
import MobileCartSheet from "../components/MobileCartSheet";

import { useMobileCart } from "../context/MobileCartContext";
import { useCart } from "../context/CartContext";
import DashboardHeader from "../components/DashboardHeader";
import PackagePickerModal from "../components/PackagePickerModal";
import usePackagePicker from "../hooks/usePackagePicker";
import { useRouter } from "next/navigation";

export default function PosDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [todayStock, setTodayStock] = useState<any>(null);
  const [todayClosed, setTodayClosed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [inputStock, setInputStock] = useState<string>("");
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // State untuk melipat ringkasan dashboard di versi mobile
  const [showMobileMetrics, setShowMobileMetrics] = useState(false);
  const [showAdminPanelMobile, setShowAdminPanelMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); 

  const { openCart } = useMobileCart();
  const { cart, addToCart } = useCart();
  const packagePicker = usePackagePicker();

  useEffect(() => {
  async function checkLogin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("SESSION DASHBOARD =", session);

    await loadProducts();
    await checkTodayStock();

    setIsLoading(false);
  }

  checkLogin();
}, []);

  useEffect(() => {
    if (todayStock) {
      setInputStock(todayStock.opening_stock?.toString() || "0");
    }
  }, [todayStock]);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data ?? []);
  }

  async function checkTodayStock() {
  const stock = await getTodayStock();

  if (!stock) {
    setTodayStock(null);
    setTodayClosed(true);
    return;
  }

  setTodayStock(stock);
  setTodayClosed(stock.is_closed);
}

  async function handleUpdateStockFromPanel(e: React.FormEvent) {
  e.preventDefault();

  const parsedStock = parseInt(inputStock, 10);

  if (isNaN(parsedStock) || parsedStock < 0) {
    alert("Mohon masukkan angka jumlah stok yang valid.");
    return;
  }

  setIsUpdatingStock(true);

  try {
    const stock = await saveOrUpdateTodayStock(parsedStock);

    setTodayStock(stock);

    await checkTodayStock();

    alert("Data stok berhasil diperbarui!");
  } catch (err: any) {
    alert("Gagal memperbarui stok: " + err.message);
  } finally {
    setIsUpdatingStock(false);
  }
}

  async function handleCloseDay() {
    if (!confirm("Tutup operasional hari ini?")) return;

    setClosing(true);
    try {
      await closeTodayStock();
      setTodayClosed(true);
      setTodayStock((prev: any) => prev ? { ...prev, is_closed: true } : null);
      alert("Toko berhasil ditutup");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClosing(false);
    }
  }

  async function handleOpenDay() {
    if (!confirm("Buka kembali operasional toko hari ini?")) return;
    if (!todayStock?.id) {
      alert("Gagal membuka toko: Data stok hari ini belum diinisialisasi.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("daily_stock")
        .update({ is_closed: false })
        .eq("id", todayStock.id);

      if (error) throw error;

      setTodayClosed(false);
      setTodayStock((prev: any) => prev ? { ...prev, is_closed: false } : null);
      
      alert("Toko berhasil dibuka kembali");
    } catch (err: any) {
      alert("Gagal membuka toko: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const cartDisabled = todayClosed === true;

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const donuts = products.filter((x: any) => {
    if (x.is_package) return false;
    if (!packagePicker.selectedPackage) return false;

    if (packagePicker.selectedPackage.package_type === "hemat") {
      return x.category === "hemat";
    }

    return x.category === "normal";
  });

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-100">
        <p className="font-semibold text-gray-500 animate-pulse">Memuat POS Donara...</p>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-dvh w-full flex-col bg-gray-50 overflow-hidden select-none pb-[80px] xl:pb-0">

        {/* BANNER TOKO TUTUP */}
        {cartDisabled && (
          isAdmin ? (
            <div className="bg-amber-600 px-4 py-2 text-center text-xs font-medium text-white shadow-md z-[110] shrink-0">
              ⚠️ Mode Admin: Status Toko <span className="font-black">TUTUP</span>.
            </div>
          ) : (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-2xl bg-white p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-red-100">
                <h1 className="text-2xl font-black text-red-600 tracking-wide">TOKO TUTUP</h1>
                <p className="mt-2 text-sm text-gray-500">Operasional hari ini telah berakhir.</p>
              </div>
            </div>
          )
        )}

        {/* HEADER RESPONSIVE TOGGLE */}
        {/* Di Desktop tampil penuh seperti biasa. Di Mobile, dibungkus kontainer lipat agar hemat tempat */}
        <div className="shrink-0 bg-white border-b border-gray-200">
          <div className="xl:hidden px-4 py-2.5 flex justify-between items-center bg-white">
            <div className="flex flex-col">
              <span className="text-sm font-black text-pink-600 tracking-tight">DONARA POS</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                ● Toko Buka ({todayStock?.remaining_stock ?? 0} Sisa)
              </span>
            </div>
            <button
              onClick={() => setShowMobileMetrics(!showMobileMetrics)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-black text-gray-700 transition-colors"
            >
              {showMobileMetrics ? "✕ Tutup Menu" : "📊 Menu Admin"}
            </button>
          </div>

          <div className={`${showMobileMetrics ? "block" : "hidden"} xl:block`}>
            <DashboardHeader
              todayStock={todayStock}
              todayClosed={todayClosed}
              closing={closing}
              handleCloseDay={handleCloseDay}
              handleOpenDay={handleOpenDay}
            />
          </div>
        </div>

        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 xl:grid-cols-4 flex-1 overflow-hidden min-h-0 w-full">

          <section className={`col-span-1 xl:col-span-3 flex flex-col min-h-0 bg-gray-50 ${(cartDisabled && !isAdmin) ? "pointer-events-none opacity-50" : ""}`}>
            
            {/* PANEL MANAJEMEN STOK (LIPAT TOTAL DI MOBILE) */}
            {isAdmin && (
              <div className="bg-white border-b px-4 py-2 xl:p-4 xl:mx-4 xl:mt-4 xl:rounded-xl xl:shadow-sm shrink-0">
                <div className="flex justify-between items-center xl:hidden">
                  <button 
                    type="button"
                    onClick={() => setShowAdminPanelMobile(!showAdminPanelMobile)}
                    className="text-xs font-bold text-gray-600 flex items-center justify-between w-full"
                  >
                    <span className="flex items-center gap-1">⚙️ {showAdminPanelMobile ? "Sembunyikan" : "Atur"} Kapasitas Adonan Awal</span>
                    <span className="text-pink-600 font-black">{showAdminPanelMobile ? "▲" : "▼"}</span>
                  </button>
                </div>

                <div className={`${showAdminPanelMobile ? "flex" : "hidden"} xl:flex flex-col md:flex-row md:items-center justify-between gap-3 mt-2 xl:mt-0`}>
                  <div className="hidden xl:flex items-center gap-2">
                    <span className="text-lg">⚙️</span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Panel Manajemen Stok</h3>
                      <p className="text-[11px] text-gray-400">Atur kapasitas ketersediaan adonan donat hari ini</p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateStockFromPanel} className="flex gap-2 items-center w-full xl:w-auto">
                    <input
                      type="number"
                      value={inputStock}
                      onChange={(e) => setInputStock(e.target.value)}
                      placeholder="Stok"
                      className="flex-1 xl:w-32 rounded-lg border bg-gray-50 px-3 py-2 text-xs font-bold outline-none focus:border-pink-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isUpdatingStock}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors shrink-0"
                    >
                      {isUpdatingStock ? "Simpan..." : "Simpan"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* BAR PENCARIAN COMPACT */}
            <div className="p-3 xl:p-4 shrink-0 bg-white xl:bg-transparent border-b xl:border-b-0">
              <div className="flex items-center gap-2 bg-gray-100 xl:bg-white p-1 rounded-xl border border-transparent xl:border-gray-100 shadow-none xl:shadow-sm">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk donat..."
                  className="flex-1 bg-transparent rounded-lg p-2 outline-none text-xs xl:text-sm"
                />
                <button
                  onClick={loadProducts}
                  className="rounded-lg bg-white xl:bg-gray-50 border px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors shadow-sm xl:shadow-none"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* AREA UTAMA DAFTAR DONAT (Mendominasi Sisa Layar) */}
            <div className="flex-1 overflow-y-auto p-3 xl:px-4 pb-6">
              <ProductGrid
  products={filtered}
  todayStock={todayStock}
  onPackageClick={packagePicker.openPicker}
  cart={cart}
  onProductClick={(product) => addToCart(product)}
/>
            </div>
          </section>

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden xl:flex col-span-1 h-full bg-white border-l border-gray-200 flex-col overflow-hidden">
            <CartPanel onPaymentSuccess={checkTodayStock} />
          </aside>

        </div>

        {/* BOTTOM NAV BAR UNTUK MOBILE */}
        {/* Menaikkan z-index ke 250 agar berada di atas indikator issue/error bawaan localhost */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 pb-safe xl:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-[250] shrink-0">
          <button
            onClick={openCart}
            disabled={cartDisabled && !isAdmin} 
            className="w-full rounded-xl bg-pink-600 py-3.5 text-center font-black text-xs tracking-wider uppercase text-white shadow-lg shadow-pink-600/20 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400"
          >
            Lihat Keranjang ({cart?.length ?? 0} Item)
          </button>
        </div>

        <MobileCartSheet />

        <PackagePickerModal
          open={packagePicker.open}
          title={packagePicker.selectedPackage?.name ?? ""}
          maxSelect={packagePicker.selectedPackage?.package_size ?? 0}
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