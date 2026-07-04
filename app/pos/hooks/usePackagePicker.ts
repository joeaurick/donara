"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  package_size: number;
  package_type: string | null;
};

type SelectedProduct = {
  id: number;
  name: string;
  qty: number;
};

export default function usePackagePicker() {
  const { addPackageToCart } = useCart();

  const [open, setOpen] = useState(false);

  const [selectedPackage, setSelectedPackage] =
    useState<Product | null>(null);

  const [selectedProducts, setSelectedProducts] =
    useState<SelectedProduct[]>([]);

  function openPicker(pkg: Product) {
    setSelectedPackage(pkg);
    setSelectedProducts([]);
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
    setSelectedProducts([]);
    setSelectedPackage(null);
  }

  function increase(product: {
    id: number;
    name: string;
  }) {
    if (!selectedPackage) return;

    const total = selectedProducts.reduce(
      (sum, x) => sum + x.qty,
      0
    );

    if (total >= selectedPackage.package_size) return;

    setSelectedProducts((prev) => {
      const exist = prev.find(
        (x) => x.id === product.id
      );

      if (exist) {
        return prev.map((x) =>
          x.id === product.id
            ? {
                ...x,
                qty: x.qty + 1,
              }
            : x
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          qty: 1,
        },
      ];
    });
  }

  function decrease(product: {
    id: number;
    name: string;
  }) {
    setSelectedProducts((prev) =>
      prev
        .map((x) =>
          x.id === product.id
            ? {
                ...x,
                qty: x.qty - 1,
              }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  }

  function savePackage() {
    if (!selectedPackage) return;

    const total = selectedProducts.reduce(
      (sum, x) => sum + x.qty,
      0
    );

    if (total !== selectedPackage.package_size) {
      alert(
        `Pilih tepat ${selectedPackage.package_size} donat`
      );
      return;
    }

    addPackageToCart(
      {
        id: Date.now(),
        name: selectedPackage.name,
        price: selectedPackage.price,
        image: selectedPackage.image,
        isPackage: true,
      },
      selectedProducts
    );

    closePicker();
  }

  return {
    open,

    selectedPackage,

    selectedProducts,

    openPicker,

    closePicker,

    increase,

    decrease,

    savePackage,
  };
}