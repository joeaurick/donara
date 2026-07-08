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

  setDiscount: (value: number) => void;

  setTax: (value: number) => void;
};

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [discount, setDiscount] =
    useState(0);

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
    setDiscount(0);
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

        setDiscount,

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