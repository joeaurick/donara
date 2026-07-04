export type PackageProduct = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export type PackageItem = {
  id: string;
  name: string;
  price: number;

  totalItem: number;

  products: PackageProduct[];
};