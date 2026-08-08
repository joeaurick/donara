export type PosProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;

  category?: string;
  track_stock?: boolean;

  // TAMBAHAN
  promo_code?: string | null;
};