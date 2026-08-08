"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type PackageProduct = {
  id: number;
  name: string;
  qty: number;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;

  category?: string;

  track_stock?: boolean;

  // TAMBAHAN
  promo_code?: string | null;

  isPackage: boolean;

  packageProducts?: PackageProduct[];
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    item: Omit<CartItem, "qty">
  ) => void;

  addPackageToCart: (
    packageItem: Omit<CartItem, "qty">,
    products: PackageProduct[]
  ) => void;

  increase: (id: number) => void;

  decrease: (id: number) => void;

  remove: (id: number) => void;

  clear: () => void;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  setTax: (value: number) => void;
};

const CartContext =
  createContext<CartContextType | null>(null);

function calculatePromoDiscount(cart: CartItem[]) {
  let discount = 0;

  // GROUP PROMO
  const groups: Record<
    string,
    { qty: number; total: number; unitPrice: number }
  > = {};

  for (const item of cart) {
    if (!item.promo_code || item.promo_code === "NORMAL") {
      continue;
    }

    if (!groups[item.promo_code]) {
      groups[item.promo_code] = {
        qty: 0,
        total: 0,
        unitPrice: item.price,
      };
    }

    groups[item.promo_code].qty += item.qty;
    groups[item.promo_code].total += item.price * item.qty;
  }

  // DONAT 3 PCS = 10.000
  if (groups["DONAT_3"]) {
    const g = groups["DONAT_3"];

    const bundleCount = Math.floor(g.qty / 3);
    const remaining = g.qty % 3;

    const promoTotal =
      bundleCount * 10000 +
      remaining * g.unitPrice;

    discount += g.total - promoTotal;
  }

  // DONAT 6 PCS = 23.000
  if (groups["DONAT_6"]) {
    const g = groups["DONAT_6"];

    const bundleCount = Math.floor(g.qty / 6);
    const remaining = g.qty % 6;

    const promoTotal =
      bundleCount * 23000 +
      remaining * g.unitPrice;

    discount += g.total - promoTotal;
  }

  return discount;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);


  const [tax, setTax] = useState(0);

  function addToCart(
    item: Omit<CartItem, "qty">
  ) {
    setCart((prev) => {
      if (!item.isPackage) {
        const exist = prev.find(
          (x) =>
            !x.isPackage &&
            x.id === item.id
        );

        if (exist) {
  return prev.map((x) =>
    x.id === item.id
      ? {
          ...x,
          qty: x.qty + 1,

          // PENTING
          promo_code:
            item.promo_code ?? x.promo_code,
        }
      : x
  );
}
      }

      return [
        ...prev,
        {
          ...item,
          qty: 1,
        },
      ];
    });
  }

  function addPackageToCart(
    packageItem: Omit<CartItem, "qty">,
    products: PackageProduct[]
  ) {
    setCart((prev) => [
      ...prev,
      {
        ...packageItem,
        qty: 1,
        isPackage: true,
        packageProducts: products,
      },
    ]);
  }

  function increase(id: number) {
    setCart((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              qty: x.qty + 1,
            }
          : x
      )
    );
  }

  function decrease(id: number) {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id
            ? {
                ...x,
                qty: x.qty - 1,
              }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  }

  function remove(id: number) {
    setCart((prev) =>
      prev.filter((x) => x.id !== id)
    );
  }

  function clear() {
    setCart([]);
    setTax(0);
  }

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.price * item.qty,
      0
    );
  }, [cart]);

  const discount = useMemo(() => {
  return calculatePromoDiscount(cart);
}, [cart]);

console.log(
  "PROMO RESULT",
  cart,
  discount
);

  const total = useMemo(() => {
    return subtotal - discount + tax;
  }, [
    subtotal,
    discount,
    tax,
  ]);

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        addPackageToCart,

        increase,

        decrease,

        remove,

        clear,

        subtotal,

        discount,

        tax,

        total,

        setTax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart harus berada di dalam CartProvider"
    );
  }

  return context;
}