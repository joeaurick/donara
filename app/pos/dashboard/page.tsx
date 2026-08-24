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

import PosReminderTicker from "../components/PosReminderTicker";

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
      <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 shadow-[0_12px_30px_rgba(236,72,153,0.22)]" />

          <p className="text-sm font-black tracking-tight text-[#2d1b16]">
            Memuat POS Donara...
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#a18f87]">
            Menyiapkan data operasional hari ini
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-dvh w-full flex-col overflow-hidden bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white pb-[76px] select-none xl:pb-0">

        {/* =========================
            TOKO TUTUP BANNER
        ========================= */}
        {cartDisabled && (
          isAdmin ? (
            <div className="z-[110] shrink-0 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-[#ffb703] px-4 py-2 text-center text-xs font-bold text-white shadow-sm">
              ⚠️ Mode Admin — Status Toko{" "}
              <span className="font-black">
                TUTUP
              </span>
            </div>
          ) : (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2d1b16]/75 p-4 backdrop-blur-md">
              <div className="w-full max-w-sm overflow-hidden rounded-[30px] border border-pink-100 bg-white shadow-[0_24px_80px_rgba(45,27,22,0.28)]">
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 text-3xl shadow-sm">
                    🏪
                  </div>

                  <h1 className="mt-5 text-2xl font-black tracking-tight text-[#2d1b16]">
                    TOKO TUTUP
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-[#8c7a72]">
                    Operasional hari ini telah
                    berakhir.
                  </p>
                </div>

                <div className="border-t border-pink-100 bg-[#fffaf5] px-6 py-3 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-500">
                    Donara POS
                  </span>
                </div>
              </div>
            </div>
          )
        )}

        {/* =========================
            HEADER POS
        ========================= */}
        <div className="shrink-0 border-b border-pink-100 bg-white/85 backdrop-blur-xl">

          {/* =========================
              REMINDER BERJALAN
          ========================= */}
          <PosReminderTicker />
       
          {/* MOBILE HEADER */}
<div className="px-3 py-3 xl:hidden">
  <div className="relative overflow-hidden rounded-[20px] border border-[#f3dfe4] bg-[#fffaf8] p-3 shadow-[0_8px_22px_rgba(45,27,22,0.06)]">

    {/* DECORATION */}
    <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-pink-200/30 blur-2xl" />

    <div className="relative flex items-center justify-between gap-3">

      {/* BRAND */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#ff5a83] to-[#ec1975] text-white shadow-[0_8px_18px_rgba(236,25,117,0.22)]">
          <span className="text-sm">
            🍩
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black tracking-[0.04em] text-[#2d1b16]">
            DONARA POS
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                todayClosed
                  ? "bg-red-500"
                  : "bg-[#46cfa4]"
              }`}
            />

            <p
              className={`text-[8px] font-bold uppercase tracking-[0.1em] ${
                todayClosed
                  ? "text-red-500"
                  : "text-[#9a8179]"
              }`}
            >
              {todayClosed
                ? "Toko Tutup"
                : "Toko Sedang Buka"}
            </p>
          </div>
        </div>
      </div>

      {/* ADMIN BUTTON */}
      <button
        type="button"
        onClick={() =>
          setShowMobileMetrics(
            !showMobileMetrics
          )
        }
        className="
          flex
          shrink-0
          items-center
          gap-2
          rounded-xl
          border
          border-pink-100
          bg-gradient-to-r
          from-[#fff0f4]
          to-[#fff7f2]
          px-3
          py-2
          text-[9px]
          font-black
          tracking-wide
          text-[#d93668]
          shadow-sm
          transition
          active:scale-95
        "
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white text-[10px] shadow-sm">
          ⚙
        </span>

        {showMobileMetrics
          ? "Tutup"
          : "Menu Admin"}
      </button>
    </div>
  </div>
</div>

          {/* =========================
              MOBILE DASHBOARD HEADER
          ========================= */}
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

          {/* =========================
              DESKTOP DASHBOARD HEADER
          ========================= */}
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
                  className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-pink-100 bg-white px-4 py-1.5 text-[10px] font-bold text-[#8c7a72] shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                >
                  ▲ Sembunyikan Header
                </button>
              </div>
            ) : (
              <div className="flex h-12 items-center justify-between bg-white/80 px-5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black tracking-tight text-[#2d1b16]">
                    DONARA POS
                  </p>

                  <div className="h-5 w-px bg-pink-100" />

                  <p
                    className={`text-[10px] font-black uppercase tracking-wide ${
                      todayClosed
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {todayClosed
                      ? "● Toko Tutup"
                      : "● POS Online"}
                  </p>

                  <div className="h-5 w-px bg-pink-100" />

                  <p className="text-[10px] font-semibold text-[#a18f87]">
                    Stok:{" "}
                    <span className="font-black text-[#2d1b16]">
                      {remainingStock}
                    </span>
                  </p>

                  <p className="text-[10px] font-semibold text-[#a18f87]">
                    Terjual:{" "}
                    <span className="font-black text-[#2d1b16]">
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
                  className="rounded-xl border border-pink-100 bg-[#fff8f7] px-3.5 py-2 text-[10px] font-black text-[#8c7a72] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
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

          {/* =========================
              LEFT AREA
          ========================= */}
          <section
            className={`col-span-1 flex min-h-0 flex-col xl:col-span-3 ${
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
                <div className="overflow-hidden rounded-[24px] border border-pink-100 bg-white shadow-[0_10px_30px_rgba(45,27,22,0.06)]">

                  {/* =========================
                      MOBILE TOGGLE
                  ========================= */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowAdminPanelMobile(
                        !showAdminPanelMobile
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-3.5 xl:hidden"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-base">
                        ⚙️
                      </div>

                      <div>
                        <p className="text-xs font-black text-[#2d1b16]">
                          Manajemen Stok
                        </p>

                        <p className="mt-0.5 text-[9px] font-medium text-[#a18f87]">
                          Stok dan makan sendiri
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-pink-600">
                      {showAdminPanelMobile
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {/* =========================
                      DESKTOP STOCK TOGGLE
                  ========================= */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowDesktopStockPanel(
                        !showDesktopStockPanel
                      )
                    }
                    className="hidden w-full items-center justify-between border-b border-pink-100 px-5 py-4 xl:flex"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 text-lg">
                        ⚙️
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2d1b16]">
                          Manajemen Stok
                        </p>

                        <p className="mt-1 text-[10px] text-[#a18f87]">
                          Kelola stok donat hari ini
                        </p>
                      </div>
                    </div>

                    <span className="rounded-xl border border-pink-100 bg-[#fff8f7] px-3.5 py-2 text-[10px] font-black text-[#8c7a72] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
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

                    {/* =========================
                        TOP TOOLBAR
                    ========================= */}
                    <div className="flex flex-col gap-4 border-t border-pink-50 p-4 xl:flex-row xl:items-center xl:justify-between xl:px-5 xl:py-4">

                      {/* TITLE */}
                      <div className="hidden min-w-[180px] xl:block">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2d1b16]">
                          Pengaturan Hari Ini
                        </p>

                        <p className="mt-1 text-[10px] text-[#a18f87]">
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
                          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-pink-100 bg-[#fffaf5] sm:w-[190px]">
                            <span className="shrink-0 px-3 text-[10px] font-black uppercase tracking-wide text-[#a18f87]">
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
                              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-center text-sm font-black text-[#2d1b16] outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={
                              isUpdatingStock
                            }
                            className="h-10 shrink-0 rounded-2xl bg-[#2d1b16] px-4 text-xs font-black text-white shadow-[0_8px_18px_rgba(45,27,22,0.16)] transition hover:bg-[#432821] active:scale-[0.98] disabled:opacity-60"
                          >
                            {isUpdatingStock
                              ? "Menyimpan..."
                              : "Simpan"}
                          </button>
                        </form>

                        <div className="hidden h-8 w-px bg-pink-100 sm:block" />

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
                          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-[#ffb703] px-4 text-xs font-black text-white shadow-[0_8px_18px_rgba(255,183,3,0.18)] transition hover:brightness-[0.98] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#f3eee9] disabled:text-[#b9a79f] disabled:shadow-none"
                        >
                          <span>🍩</span>

                          <span>
                            Makan Sendiri
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* =========================
                        STOCK SUMMARY
                    ========================= */}
                    <div className="grid grid-cols-3 gap-px border-t border-pink-100 bg-pink-50">

                      <div className="bg-white px-3 py-3.5 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#a18f87]">
                          Stok Awal
                        </p>

                        <p className="mt-1 text-base font-black text-[#2d1b16]">
                          {openingStock}
                        </p>

                        <p className="text-[9px] text-[#b9a79f]">
                          pcs
                        </p>
                      </div>

                      <div className="bg-white px-3 py-3.5 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-orange-400">
                          Dimakan
                        </p>

                        <p className="mt-1 text-base font-black text-orange-500">
                          {selfConsumed}
                        </p>

                        <p className="text-[9px] text-orange-300">
                          pcs
                        </p>
                      </div>

                      <div className="bg-white px-3 py-3.5 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-emerald-500">
                          Tersedia
                        </p>

                        <p className="mt-1 text-base font-black text-emerald-600">
                          {remainingStock}
                        </p>

                        <p className="text-[9px] text-emerald-400">
                          pcs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================
                SEARCH BAR
            ========================= */}
            <div className="shrink-0 p-3 xl:p-4">
              <div className="flex items-center gap-2 rounded-[22px] border border-pink-100 bg-white p-1.5 shadow-[0_8px_24px_rgba(45,27,22,0.05)]">

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Cari produk donat..."
                  className="h-10 min-w-0 flex-1 rounded-2xl bg-[#fffaf5] px-4 text-xs font-medium text-[#5f5049] placeholder:text-[#b9a79f] outline-none transition focus:bg-pink-50 xl:text-sm"
                />

                <button
                  type="button"
                  onClick={loadProducts}
                  className="h-10 shrink-0 rounded-2xl border border-pink-100 bg-[#fff8f7] px-4 text-xs font-black text-[#8c7a72] transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 active:scale-[0.98]"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* =========================
                PRODUCT GRID
            ========================= */}
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

          {/* =========================
              DESKTOP CART
          ========================= */}
          <aside className="col-span-1 hidden h-full flex-col overflow-hidden border-l border-pink-100 bg-white/85 shadow-[-10px_0_30px_rgba(45,27,22,0.04)] backdrop-blur-xl xl:flex">
            <CartPanel
              onPaymentSuccess={
                checkTodayStock
              }
            />
          </aside>
        </div>

        {/* =========================
    MOBILE CART BUTTON
========================= */}
<div className="fixed inset-x-0 bottom-0 z-[250] border-t border-[#eaded7] bg-[#fffaf5]/95 px-3 pb-3 pt-2 backdrop-blur-xl xl:hidden">
  <button
    id="mobile-cart-button"
    type="button"
    onClick={openCart}
    disabled={
      cartDisabled && !isAdmin
    }
    className="group relative flex w-full items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-r from-[#ec0755] via-[#f00663] to-[#ec0755] px-4 py-3.5 text-white shadow-[0_10px_24px_rgba(236,7,85,0.28)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:text-gray-500"
  >
    {/* GLOW */}
    <span className="pointer-events-none absolute -left-8 top-0 h-full w-20 bg-white/10 blur-xl" />

    {/* ICON */}
    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[11px] font-black">
      N
    </span>

    {/* TEXT */}
    <span className="relative z-10 mx-3 text-[10px] font-black uppercase tracking-[0.16em]">
      Lihat Keranjang
    </span>

    {/* ITEM BADGE */}
    <span className="relative z-10 flex min-w-[24px] items-center justify-center rounded-full bg-white/20 px-2 py-1 text-[10px] font-black shadow-sm">
      {cart?.reduce(
        (total, item) =>
          total + item.qty,
        0
      ) ?? 0}
    </span>
  </button>
</div>

        {/* =========================
            MOBILE CART
        ========================= */}
        <MobileCartSheet />

        {/* =========================
            PACKAGE PICKER
        ========================= */}
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
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#2d1b16]/55 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm overflow-hidden rounded-[30px] border border-pink-100 bg-white shadow-[0_24px_80px_rgba(45,27,22,0.28)]">

            {/* MODAL HEADER */}
            <div className="border-b border-pink-100 bg-gradient-to-r from-[#fff8f7] to-white px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-[#fff3cf] text-xl shadow-sm">
                  🍩
                </div>

                <div>
                  <h2 className="text-base font-black text-[#2d1b16]">
                    Makan Sendiri
                  </h2>

                  <p className="mt-0.5 text-xs text-[#a18f87]">
                    Catat donat yang diambil
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">

                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-500">
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

                <label className="text-xs font-black text-[#5f5049]">
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
                  className="mt-2 h-12 w-full rounded-2xl border border-pink-100 bg-[#fffaf5] px-4 text-center text-lg font-black text-[#2d1b16] outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />

                <p className="mt-2 text-center text-[10px] leading-relaxed text-[#a18f87]">
                  Jumlah akan mengurangi stok
                  tersedia dan tercatat di
                  laporan.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="grid grid-cols-2 gap-3 border-t border-pink-100 bg-[#fffaf5] p-4">

              <button
                type="button"
                disabled={isConsuming}
                onClick={() => {
                  setShowConsumeModal(false);
                  setConsumeQty("");
                }}
                className="h-11 rounded-2xl border border-pink-100 bg-white text-xs font-black text-[#8c7a72] transition hover:bg-pink-50 hover:text-pink-600 disabled:opacity-50"
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
                className="h-11 rounded-2xl bg-gradient-to-r from-orange-400 to-[#ffb703] text-xs font-black text-white shadow-[0_8px_18px_rgba(255,183,3,0.18)] transition hover:brightness-[0.98] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConsuming
                  ? "Menyimpan..."
                  : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          PENDING ORDERS
      ========================= */}
      <PendingOrdersModal />
    </>
  );
}