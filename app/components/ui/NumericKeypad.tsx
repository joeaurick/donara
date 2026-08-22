"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Delete, X } from "lucide-react";

type NumericKeypadProps = {
  isOpen: boolean;
  onClose: () => void;

  value: string;
  onChange: (value: string) => void;

  maxLength?: number;

  title?: string;
  description?: string;

  disabled?: boolean;

  onDone?: () => void;
};

export default function NumericKeypad({
  isOpen,
  onClose,
  value,
  onChange,
  maxLength,
  title = "Masukkan Angka",
  description,
  disabled = false,
  onDone,
}: NumericKeypadProps) {
  function handleNumber(number: string) {
    if (disabled) return;

    if (
      maxLength !== undefined &&
      value.length >= maxLength
    ) {
      return;
    }

    onChange(value + number);
  }

  function handleBackspace() {
    if (disabled) return;

    onChange(value.slice(0, -1));
  }

  function handleClose() {
    if (disabled) return;

    onClose();
  }

  function handleDone() {
    if (disabled) return;

    if (onDone) {
      onDone();
      return;
    }

    onClose();
  }

  const numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Tutup keypad"
            disabled={disabled}
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="fixed inset-0 z-[1000] cursor-default bg-black/20 backdrop-blur-[1px]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 34,
            }}
            className="fixed inset-x-0 bottom-0 z-[1001] mx-auto w-full max-w-lg"
          >
            <div className="rounded-t-[32px] border border-slate-200/80 bg-white px-5 pb-8 pt-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
              {/* Handle */}
              <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-200" />

              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-900">
                    {title}
                  </h3>

                  {description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 disabled:cursor-not-allowed"
                  aria-label="Tutup"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-3">
                {numbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      handleNumber(number)
                    }
                    className="flex h-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold text-slate-900 transition duration-150 hover:bg-slate-100 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {number}
                  </button>
                ))}

                {/* Kosong */}
                <div />

                {/* Nol */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleNumber("0")}
                  className="flex h-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold text-slate-900 transition duration-150 hover:bg-slate-100 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  0
                </button>

                {/* Backspace */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleBackspace}
                  className="flex h-14 items-center justify-center rounded-2xl text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Hapus angka terakhir"
                >
                  <Delete size={21} strokeWidth={2} />
                </button>
              </div>

              {/* Done */}
              <button
                type="button"
                disabled={disabled}
                onClick={handleDone}
                className="mt-5 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-sm transition duration-150 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Selesai
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}