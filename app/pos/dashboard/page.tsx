"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import { getProducts } from "@/lib/supabase/products";
import {
  getTodayStock,
  closeTodayStock,
  isTodayClosed,
} from "@/lib/supabase/daily-stock";

import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";
import MobileCartSheet from "../components/MobileCartSheet";

import { useMobileCart } from "../context/MobileCartContext";
import { useCart } from "../context/CartContext";
import DashboardHeader from "../components/DashboardHeader";
import PackagePickerModal from "../components/PackagePickerModal";
import usePackagePicker from "../hooks/usePackagePicker";

export default function PosDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [todayStock, setTodayStock] = useState<any>(null);
  const [todayClosed, setTodayClosed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [inputStock, setInputStock] = useState<string>("");
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const [isAdmin, setIsAdmin] = useState(true); 

  const { openCart } = useMobileCart();
  const { cart, addToCart } = useCart(); // Menambahkan fungsi addToCart untuk aksi klik produk non-paket
  const packagePicker = usePackagePicker();

  useEffect(() => {
    async function initDashboard() {
      setIsLoading(true);
      await Promise.all([loadProducts(), checkTodayStock(), loadClosedStatus()]);
      setIsLoading(false);
    }
    initDashboard();
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
    setTodayStock(stock);
  }

  async function loadClosedStatus() {
    const closed = await isTodayClosed();
    setTodayClosed(!!closed);
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
      if (todayStock?.id) {
        const currentSales = (todayStock.opening_stock || 0) - (todayStock.remaining_stock || 0);
        const newRemaining = Math.max(0, parsedStock - currentSales);

        const { error } = await supabase
          .from("daily_stock")
          .update({ 
            opening_stock: parsedStock,
            remaining_stock: newRemaining
          })
          .eq("id", todayStock.id);

        if (error) throw error;

        setTodayStock((prev: any) => ({
          ...prev,
          opening_stock: parsedStock,
          remaining_stock: newRemaining
        }));

      } else {
        const todayDate = new Date().toLocaleDateString("sv-SE");
        const { data, error } = await supabase
          .from("daily_stock")
          .insert([{ 
            opening_stock: parsedStock, 
            remaining_stock: parsedStock,
            date: todayDate,
            is_closed: false 
          }])
          .select()
          .single();

        if (error) throw error;

        if (data) setTodayStock(data);
      }

      await loadClosedStatus();
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
      <main className="flex h-auto xl:h-dvh w-full flex-col bg-gray-100 xl:overflow-hidden select-none pb-28 xl:pb-0">

        {/* BANNER TOKO TUTUP */}
        {cartDisabled && (
          isAdmin ? (
            <div className="bg-amber-600 px-4 py-2 text-center text-sm font-medium text-white shadow-md z-[110]">
              ⚠️ <span className="font-bold">Mode Admin:</span> Toko saat ini berstatus <span className="font-black">TUTUP</span>. Gunakan panel kanan untuk membuka atau mengatur stok harian Anda.
            </div>
          ) : (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-2xl bg-white p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-red-100">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-red-600 tracking-wide">TOKO TUTUP</h1>
                <p className="mt-2 text-sm text-gray-500">Operasional hari ini telah berakhir.</p>
              </div>
            </div>
          )
        )}

        {/* HEADER */}
        <DashboardHeader
          todayStock={todayStock}
          todayClosed={todayClosed}
          closing={closing}
          handleCloseDay={handleCloseDay}
          handleOpenDay={handleOpenDay}
        />

        {/* CONTENT AREA */}
        <div className="flex flex-1 flex-col xl:flex-row overflow-visible xl:overflow-hidden min-h-0">

          {/* Sisi Produk */}
          <section className={`flex flex-col min-w-0 flex-1 ${(cartDisabled && !isAdmin) ? "pointer-events-none opacity-50" : ""}`}>
            <div className="border-b bg-white p-4">
              <div className="flex items-center gap-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 rounded-2xl border p-4 outline-none focus:border-pink-500 text-base"
                />
                <button
                  onClick={loadProducts}
                  className="rounded-xl border px-5 py-4 font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-visible xl:overflow-y-auto p-4 content-start">
              {/* PERBAIKAN: Mengirimkan props cart dan handler addToCart ke ProductGrid */}
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
          <aside className="hidden h-full w-[420px] shrink-0 border-l bg-white xl:flex flex-col overflow-hidden">
            {isAdmin && (
              <div className="border-b bg-gray-50 p-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                  ⚙️ Panel Manajemen Stok (Admin)
                </h3>
                
                <form onSubmit={handleUpdateStockFromPanel}>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      {todayStock ? "Edit Stok Awal Hari Ini" : "Inisialisasi Stok Awal (Buka Toko)"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={inputStock}
                        onChange={(e) => setInputStock(e.target.value)}
                        placeholder="Contoh: 150"
                        className="flex-1 rounded-xl border bg-white px-3 py-1.5 text-xs font-bold outline-none focus:border-pink-500"
                      />
                      <button
                        type="submit"
                        disabled={isUpdatingStock}
                        className="rounded-xl bg-pink-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-700 disabled:bg-gray-300 transition-colors"
                      >
                        {isUpdatingStock ? "Proses..." : "Simpan"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Area Keranjang Belanja */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <CartPanel />
            </div>
          </aside>

        </div>

        {/* MOBILE BOTTOM CART PANEL */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 pb-safe xl:hidden shadow-[0_-6px_20px_rgba(0,0,0,0.1)] z-[90]">
          <button
            onClick={openCart}
            disabled={cartDisabled && !isAdmin} 
            className="w-full rounded-2xl bg-pink-600 p-4 text-center font-bold text-white shadow-lg active:scale-[0.98] transition-transform disabled:bg-gray-300 disabled:shadow-none"
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