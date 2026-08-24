"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import { getProducts } from "@/lib/supabase/products";

import {
  getTodayStock,
  closeTodayStock,
  saveOrUpdateTodayStock,
  consumeTodayStock,
} from "@/lib/supabase/daily-stock";

import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";
import MobileCartSheet from "../components/MobileCartSheet";

import { useMobileCart } from "../context/MobileCartContext";
import { useCart } from "../context/CartContext";

import DashboardHeader from "../components/DashboardHeader";

import PackagePickerModal from "../components/PackagePickerModal";
import usePackagePicker from "../hooks/usePackagePicker";

import PendingOrdersModal from "../components/PendingOrdersModal";

export default function PosDashboardPage() {
  // =========================
  // PRODUCTS
  // =========================
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // =========================
  // STOCK
  // =========================
  const [todayStock, setTodayStock] =
    useState<any>(null);

  const [todayClosed, setTodayClosed] =
    useState(false);

  const [closing, setClosing] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [inputStock, setInputStock] =
    useState("");

  const [isUpdatingStock, setIsUpdatingStock] =
    useState(false);

  // =========================
  // MAKAN SENDIRI
  // =========================
  const [showConsumeModal, setShowConsumeModal] =
    useState(false);

  const [consumeQty, setConsumeQty] =
    useState("");

  const [isConsuming, setIsConsuming] =
    useState(false);

  // =========================
  // HEADER / DASHBOARD UI
  // =========================
  const [showMobileMetrics, setShowMobileMetrics] =
    useState(false);

  const [showDesktopHeader, setShowDesktopHeader] =
    useState(true);

  // =========================
  // STOCK PANEL DESKTOP
  // =========================
  const [
    showDesktopStockPanel,
    setShowDesktopStockPanel,
  ] = useState(true);

  // =========================
  // ADMIN PANEL MOBILE
  // =========================
  const [
    showAdminPanelMobile,
    setShowAdminPanelMobile,
  ] = useState(false);

  // =========================
  // ADMIN
  // =========================
  const [isAdmin] = useState(true);

  // =========================
  // CART
  // =========================
  const { openCart } =
    useMobileCart();

  const { cart, addToCart } =
    useCart();

  const packagePicker =
    usePackagePicker();

  // =========================
  // LOAD COLLAPSE SETTINGS
  // =========================
  useEffect(() => {
    const savedDesktopHeader =
      localStorage.getItem(
        "donara-desktop-header"
      );

    if (savedDesktopHeader !== null) {
      setShowDesktopHeader(
        savedDesktopHeader === "true"
      );
    }

    const savedDesktopStockPanel =
      localStorage.getItem(
        "donara-desktop-stock-panel"
      );

    if (savedDesktopStockPanel !== null) {
      setShowDesktopStockPanel(
        savedDesktopStockPanel === "true"
      );
    }
  }, []);

  // =========================
  // SAVE HEADER COLLAPSE
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "donara-desktop-header",
      String(showDesktopHeader)
    );
  }, [showDesktopHeader]);

  // =========================
  // SAVE STOCK PANEL COLLAPSE
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "donara-desktop-stock-panel",
      String(showDesktopStockPanel)
    );
  }, [showDesktopStockPanel]);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    async function initializeDashboard() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log(
          "SESSION DASHBOARD =",
          session
        );

        await Promise.all([
          loadProducts(),
          checkTodayStock(),
        ]);
      } catch (error) {
        console.error(
          "Gagal memuat POS:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    initializeDashboard();
  }, []);

  // =========================
  // SYNC INPUT STOCK
  // =========================
  useEffect(() => {
    if (todayStock) {
      setInputStock(
        Number(
          todayStock.opening_stock || 0
        ).toString()
      );
    }
  }, [todayStock]);

  // =========================
  // LOAD PRODUCTS
  // =========================
  async function loadProducts() {
    const data =
      await getProducts();

    setProducts(data ?? []);

    console.log(
      "PRODUCTS POS:",
      data
    );
  }

  // =========================
  // CHECK TODAY STOCK
  // =========================
  async function checkTodayStock() {
    const stock =
      await getTodayStock();

    if (!stock) {
      setTodayStock(null);

      setTodayClosed(true);

      return;
    }

    setTodayStock(stock);

    setTodayClosed(
      Boolean(stock.is_closed)
    );
  }

  // =========================
  // UPDATE STOCK
  // =========================
  async function handleUpdateStockFromPanel(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const parsedStock =
      parseInt(inputStock, 10);

    if (
      Number.isNaN(parsedStock) ||
      parsedStock < 0
    ) {
      alert(
        "Mohon masukkan jumlah stok yang valid."
      );

      return;
    }

    setIsUpdatingStock(true);

    try {
      const stock =
        await saveOrUpdateTodayStock(
          parsedStock
        );

      setTodayStock(stock);

      await checkTodayStock();

      alert(
        "Data stok berhasil diperbarui."
      );
    } catch (err: any) {
      alert(
        "Gagal memperbarui stok: " +
          (err?.message || "Terjadi kesalahan")
      );
    } finally {
      setIsUpdatingStock(false);
    }
  }

  // =========================
  // MAKAN SENDIRI
  // =========================
  async function handleConsumeStock() {
    const qty =
      parseInt(consumeQty, 10);

    if (
      Number.isNaN(qty) ||
      qty <= 0
    ) {
      alert(
        "Masukkan jumlah donat yang dimakan."
      );

      return;
    }

    if (!todayStock) {
      alert(
        "Stok hari ini belum dibuat."
      );

      return;
    }

    const remainingStock =
      Number(
        todayStock.remaining_stock || 0
      );

    if (qty > remainingStock) {
      alert(
        `Jumlah tidak boleh melebihi stok tersedia (${remainingStock} pcs).`
      );

      return;
    }

    setIsConsuming(true);

    try {
      const updated =
        await consumeTodayStock(qty);

      setTodayStock(updated);

      setConsumeQty("");

      setShowConsumeModal(false);

      await checkTodayStock();

      alert(
        `${qty} donat berhasil dicatat sebagai makan sendiri.`
      );
    } catch (err: any) {
      alert(
        "Gagal mencatat makan sendiri: " +
          (err?.message || "Terjadi kesalahan")
      );
    } finally {
      setIsConsuming(false);
    }
  }

  // =========================
  // CLOSE DAY
  // =========================
  async function handleCloseDay() {
    if (
      !confirm(
        "Tutup operasional hari ini?"
      )
    ) {
      return;
    }

    setClosing(true);

    try {
      await closeTodayStock();

      setTodayClosed(true);

      setTodayStock((prev: any) =>
        prev
          ? {
              ...prev,
              is_closed: true,
            }
          : null
      );

      alert(
        "Toko berhasil ditutup."
      );
    } catch (err: any) {
      alert(
        err?.message ||
          "Gagal menutup toko."
      );
    } finally {
      setClosing(false);
    }
  }

  // =========================
  // OPEN DAY
  // =========================
  async function handleOpenDay() {
    if (
      !confirm(
        "Buka kembali operasional toko hari ini?"
      )
    ) {
      return;
    }

    if (!todayStock?.id) {
      alert(
        "Data stok hari ini belum diinisialisasi."
      );

      return;
    }

    setIsLoading(true);

    try {
      const { error } =
        await supabase
          .from("daily_stock")
          .update({
            is_closed: false,
          })
          .eq(
            "id",
            todayStock.id
          );

      if (error) {
        throw error;
      }

      setTodayClosed(false);

      setTodayStock((prev: any) =>
        prev
          ? {
              ...prev,
              is_closed: false,
            }
          : null
      );

      alert(
        "Toko berhasil dibuka kembali."
      );
    } catch (err: any) {
      alert(
        "Gagal membuka toko: " +
          (err?.message || "Terjadi kesalahan")
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =========================
  // CART STATUS
  // =========================
  const cartDisabled =
    todayClosed === true;

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filtered =
    products.filter((item) =>
      item.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // =========================
  // PACKAGE PRODUCTS
  // =========================
  const donuts =
    products.filter((x: any) => {
      if (x.is_package) {
        return false;
      }

      if (
        !packagePicker.selectedPackage
      ) {
        return false;
      }

      if (
        packagePicker.selectedPackage
          .package_type === "hemat"
      ) {
        return (
          x.category === "hemat"
        );
      }

      return (
        x.category === "normal"
      );
    });

  // =========================
  // STOCK DATA
  // =========================
  const openingStock =
    Number(
      todayStock?.opening_stock || 0
    );

  const selfConsumed =
    Number(
      todayStock?.self_consumed || 0
    );

  const remainingStock =
    Number(
      todayStock?.remaining_stock || 0
    );

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-100">
        <p className="animate-pulse font-semibold text-gray-500">
          Memuat POS Donara...
        </p>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-dvh w-full flex-col overflow-hidden bg-gray-50 pb-[76px] select-none xl:pb-0">

        {/* =========================
            TOKO TUTUP BANNER
        ========================= */}
        {cartDisabled && (
          isAdmin ? (
            <div className="z-[110] shrink-0 bg-amber-500 px-4 py-2 text-center text-xs font-medium text-white">
              ⚠️ Mode Admin — Status Toko{" "}
              <span className="font-black">
                TUTUP
              </span>
            </div>
          ) : (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
                  🏪
                </div>

                <h1 className="mt-5 text-2xl font-black text-red-600">
                  TOKO TUTUP
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Operasional hari ini telah
                  berakhir.
                </p>
              </div>
            </div>
          )
        )}

        {/* =========================
            HEADER POS
        ========================= */}
        <div className="shrink-0 border-b border-gray-200 bg-white">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-4 py-2.5 xl:hidden">
            <div>
              <p className="text-sm font-black tracking-tight text-pink-600">
                DONARA POS
              </p>

              <p
                className={`mt-0.5 text-[10px] font-semibold ${
                  todayClosed
                    ? "text-red-500"
                    : "text-emerald-600"
                }`}
              >
                {todayClosed
                  ? "● Toko Tutup"
                  : "● Toko Sedang Buka"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowMobileMetrics(
                  !showMobileMetrics
                )
              }
              className="rounded-xl bg-gray-100 px-3 py-2 text-[11px] font-black text-gray-700 transition hover:bg-gray-200"
            >
              {showMobileMetrics
                ? "Tutup Menu"
                : "Menu Admin"}
            </button>
          </div>

          {/* MOBILE DASHBOARD HEADER */}
          <div
            className={`${
              showMobileMetrics
                ? "block"
                : "hidden"
            } xl:hidden`}
          >
            <DashboardHeader
              todayStock={todayStock}
              todayClosed={todayClosed}
              closing={closing}
              handleCloseDay={
                handleCloseDay
              }
              handleOpenDay={
                handleOpenDay
              }
            />
          </div>

          {/* DESKTOP DASHBOARD HEADER */}
          <div className="hidden xl:block">
            {showDesktopHeader ? (
              <div className="relative">
                <DashboardHeader
                  todayStock={todayStock}
                  todayClosed={todayClosed}
                  closing={closing}
                  handleCloseDay={
                    handleCloseDay
                  }
                  handleOpenDay={
                    handleOpenDay
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowDesktopHeader(false)
                  }
                  className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[10px] font-bold text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-pink-600"
                >
                  ▲ Sembunyikan Header
                </button>
              </div>
            ) : (
              <div className="flex h-11 items-center justify-between border-b border-gray-200 bg-white px-5">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black tracking-tight text-pink-600">
                    DONARA POS
                  </p>

                  <div className="h-4 w-px bg-gray-200" />

                  <p
                    className={`text-[10px] font-bold ${
                      todayClosed
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {todayClosed
                      ? "● Toko Tutup"
                      : "● Toko Buka"}
                  </p>

                  <div className="h-4 w-px bg-gray-200" />

                  <p className="text-[10px] font-semibold text-gray-400">
                    Stok:{" "}
                    <span className="font-black text-gray-700">
                      {remainingStock}
                    </span>
                  </p>

                  <p className="text-[10px] font-semibold text-gray-400">
                    Terjual:{" "}
                    <span className="font-black text-gray-700">
                      {Math.max(
                        0,
                        openingStock -
                          remainingStock -
                          selfConsumed
                      )}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDesktopHeader(true)
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[10px] font-black text-gray-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                >
                  ▼ Tampilkan Header POS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden xl:grid-cols-4">

          {/* LEFT AREA */}
          <section
            className={`col-span-1 flex min-h-0 flex-col bg-gray-50 xl:col-span-3 ${
              cartDisabled && !isAdmin
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >

            {/* =========================
                STOCK MANAGEMENT
            ========================= */}
            {isAdmin && (
              <div className="shrink-0 px-3 pt-3 xl:px-4 xl:pt-4">

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  {/* MOBILE TOGGLE */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowAdminPanelMobile(
                        !showAdminPanelMobile
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-3 xl:hidden"
                  >
                    <div className="text-left">
                      <p className="text-xs font-black text-gray-800">
                        Manajemen Stok
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Stok dan makan sendiri
                      </p>
                    </div>

                    <span className="text-xs font-black text-pink-600">
                      {showAdminPanelMobile
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {/* DESKTOP STOCK TOGGLE */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowDesktopStockPanel(
                        !showDesktopStockPanel
                      )
                    }
                    className="hidden w-full items-center justify-between border-b border-gray-100 px-4 py-3 xl:flex"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-lg">
                        ⚙️
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-800">
                          Manajemen Stok
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          Kelola stok donat hari ini
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[10px] font-black text-gray-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
                      {showDesktopStockPanel
                        ? "▲ Sembunyikan"
                        : "▼ Tampilkan"}
                    </span>
                  </button>

                  {/* =========================
                      PANEL CONTENT
                  ========================= */}
                  <div
                    className={`
                      ${
                        showAdminPanelMobile
                          ? "block"
                          : "hidden"
                      }
                      ${
                        showDesktopStockPanel
                          ? "xl:block"
                          : "xl:hidden"
                      }
                    `}
                  >

                    {/* TOP TOOLBAR */}
                    <div className="flex flex-col gap-4 border-t border-gray-100 p-4 xl:flex-row xl:items-center xl:justify-between">

                      {/* TITLE */}
                      <div className="hidden min-w-[180px] xl:block">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-800">
                          Pengaturan Hari Ini
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          Atur stok dan catat donat
                          yang diambil.
                        </p>
                      </div>

                      {/* ACTION AREA */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                        {/* STOCK FORM */}
                        <form
                          onSubmit={
                            handleUpdateStockFromPanel
                          }
                          className="flex items-center gap-2"
                        >
                          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-gray-200 bg-gray-50 sm:w-[180px]">
                            <span className="shrink-0 px-3 text-[10px] font-bold uppercase text-gray-400">
                              Stok
                            </span>

                            <input
                              type="number"
                              min="0"
                              value={inputStock}
                              onChange={(e) =>
                                setInputStock(
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-center text-sm font-black text-gray-800 outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={
                              isUpdatingStock
                            }
                            className="h-10 shrink-0 rounded-xl bg-gray-900 px-4 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
                          >
                            {isUpdatingStock
                              ? "Menyimpan..."
                              : "Simpan"}
                          </button>
                        </form>

                        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

                        {/* MAKAN SENDIRI */}
                        <button
                          type="button"
                          disabled={
                            !todayStock ||
                            todayClosed
                          }
                          onClick={() =>
                            setShowConsumeModal(
                              true
                            )
                          }
                          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-black text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          <span>🍩</span>

                          <span>
                            Makan Sendiri
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* STOCK SUMMARY */}
                    <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100">

                      <div className="bg-white px-3 py-3 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          Stok Awal
                        </p>

                        <p className="mt-1 text-base font-black text-gray-800">
                          {openingStock}
                        </p>

                        <p className="text-[9px] text-gray-400">
                          pcs
                        </p>
                      </div>

                      <div className="bg-white px-3 py-3 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-orange-400">
                          Dimakan
                        </p>

                        <p className="mt-1 text-base font-black text-orange-600">
                          {selfConsumed}
                        </p>

                        <p className="text-[9px] text-orange-300">
                          pcs
                        </p>
                      </div>

                      <div className="bg-white px-3 py-3 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                          Stok Tersedia
                        </p>

                        <p className="mt-1 text-base font-black text-emerald-600">
                          {remainingStock}
                        </p>

                        <p className="text-[9px] text-emerald-300">
                          pcs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH BAR */}
            <div className="shrink-0 p-3 xl:p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Cari produk donat..."
                  className="h-10 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-xs font-medium text-gray-700 outline-none xl:text-sm"
                />

                <button
                  type="button"
                  onClick={loadProducts}
                  className="h-10 shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 text-xs font-bold text-gray-600 transition hover:bg-gray-100"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="flex-1 overflow-y-auto px-3 pb-5 xl:px-4">
              <ProductGrid
                products={filtered}
                todayStock={todayStock}
                onPackageClick={
                  packagePicker.openPicker
                }
                cart={cart}
                onProductClick={(product) =>
                  addToCart({
                    id: Number(product.id),
                    name: product.name,
                    price: product.price,
                    image:
                      product.image_url ||
                      product.image ||
                      "",
                    category:
                      product.category,
                    track_stock:
                      product.track_stock,
                    promo_code:
                      product.promo_code,
                    isPackage: false,
                  })
                }
              />
            </div>
          </section>

          {/* DESKTOP CART */}
          <aside className="col-span-1 hidden h-full flex-col overflow-hidden border-l border-gray-200 bg-white xl:flex">
            <CartPanel
              onPaymentSuccess={
                checkTodayStock
              }
            />
          </aside>
        </div>

        {/* MOBILE CART BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 z-[250] border-t border-gray-200 bg-white p-3 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.06)] xl:hidden">

          <button
            type="button"
            onClick={openCart}
            disabled={
              cartDisabled && !isAdmin
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 text-center text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-pink-600/20 transition active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
          >
            <span>
              Lihat Keranjang
            </span>

            <span className="rounded-md bg-white/20 px-2 py-0.5">
              {cart?.length ?? 0}
            </span>
          </button>
        </div>

        {/* MOBILE CART */}
        <MobileCartSheet />

        {/* PACKAGE PICKER */}
        <PackagePickerModal
          open={packagePicker.open}
          title={
            packagePicker.selectedPackage
              ?.name ?? ""
          }
          maxSelect={
            packagePicker.selectedPackage
              ?.package_size ?? 0
          }
          products={donuts}
          selected={
            packagePicker.selectedProducts
          }
          onIncrease={
            packagePicker.increase
          }
          onDecrease={
            packagePicker.decrease
          }
          onClose={
            packagePicker.closePicker
          }
          onSave={
            packagePicker.savePackage
          }
        />
      </main>

      {/* =========================
          MODAL MAKAN SENDIRI
      ========================= */}
      {showConsumeModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl">
                  🍩
                </div>

                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Makan Sendiri
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Catat donat yang diambil
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">

              <div className="rounded-2xl bg-gray-50 p-3 text-center">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Stok Tersedia
                </p>

                <p className="mt-1 text-2xl font-black text-emerald-600">
                  {remainingStock}

                  <span className="ml-1 text-xs text-emerald-400">
                    pcs
                  </span>
                </p>
              </div>

              <div className="mt-5">

                <label className="text-xs font-bold text-gray-600">
                  Jumlah yang dimakan
                </label>

                <input
                  autoFocus
                  type="number"
                  min="1"
                  max={remainingStock}
                  value={consumeQty}
                  onChange={(e) =>
                    setConsumeQty(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConsumeStock();
                    }
                  }}
                  placeholder="Masukkan jumlah"
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-center text-lg font-black text-gray-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <p className="mt-2 text-center text-[10px] text-gray-400">
                  Jumlah akan mengurangi stok
                  tersedia dan tercatat di
                  laporan.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4">

              <button
                type="button"
                disabled={isConsuming}
                onClick={() => {
                  setShowConsumeModal(false);
                  setConsumeQty("");
                }}
                className="h-11 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={
                  isConsuming ||
                  !consumeQty
                }
                onClick={
                  handleConsumeStock
                }
                className="h-11 rounded-xl bg-orange-500 text-xs font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConsuming
                  ? "Menyimpan..."
                  : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PendingOrdersModal />
    </>
  );
}