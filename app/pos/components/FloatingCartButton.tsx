"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useMobileCart } from "../context/MobileCartContext";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const { openCart } = useMobileCart();

  const [position, setPosition] = useState({
    x: 16,
    y: 180,
  });

  const [isReceivingItem, setIsReceivingItem] =
    useState(false);

  const dragging = useRef(false);
  const moved = useRef(false);

  const totalItem = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  useEffect(() => {
    function handleCartReceive() {
      setIsReceivingItem(true);

      const timer = window.setTimeout(() => {
        setIsReceivingItem(false);
      }, 450);

      return () => {
        window.clearTimeout(timer);
      };
    }

    window.addEventListener(
      "donara-cart-receive",
      handleCartReceive
    );

    return () => {
      window.removeEventListener(
        "donara-cart-receive",
        handleCartReceive
      );
    };
  }, []);

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    dragging.current = true;
    moved.current = false;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    if (!dragging.current) {
      return;
    }

    moved.current = true;

    const buttonSize = 58;
    const safeBottom = 90;

    const maxX =
      window.innerWidth - buttonSize;

    const maxY =
      window.innerHeight -
      buttonSize -
      safeBottom;

    const nextX = Math.min(
      Math.max(
        8,
        event.clientX - buttonSize / 2
      ),
      maxX
    );

    const nextY = Math.min(
      Math.max(
        80,
        event.clientY - buttonSize / 2
      ),
      maxY
    );

    setPosition({
      x: nextX,
      y: nextY,
    });
  }

  function handlePointerUp() {
    dragging.current = false;

    if (!moved.current) {
      openCart();
    }
  }

  function handlePointerCancel() {
    dragging.current = false;
  }

  return (
    <button
      id="mobile-floating-cart"
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        left: position.x,
        top: position.y,
      }}
      className={`fixed z-[240] flex h-[58px] w-[58px] touch-none select-none items-center justify-center rounded-full bg-[#fffaf5] text-[#2d1b16] ring-1 ring-orange-100 transition-all duration-300 xl:hidden ${
        dragging.current
          ? "cursor-grabbing scale-105 shadow-[0_14px_35px_rgba(45,27,22,0.30)]"
          : "cursor-grab shadow-[0_10px_28px_rgba(45,27,22,0.22)] active:scale-95"
      } ${
        isReceivingItem
          ? "scale-125 shadow-[0_0_0_10px_rgba(255,183,3,0.18)]"
          : ""
      }`}
      aria-label={`Buka keranjang, ${totalItem} item`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#2d1b16] transition-transform duration-300 ${
          isReceivingItem
            ? "scale-110 rotate-[12deg]"
            : ""
        }`}
      >
        <ShoppingCart
          size={22}
          strokeWidth={2.5}
          className="text-[#ffb703]"
        />
      </div>

      {totalItem > 0 && (
        <span
          className={`absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#fffaf5] bg-[#ff5c86] px-1 text-[10px] font-black text-white shadow-sm transition-transform duration-300 ${
            isReceivingItem
              ? "scale-125"
              : "scale-100"
          }`}
        >
          {totalItem > 99
            ? "99+"
            : totalItem}
        </span>
      )}
    </button>
  );
}