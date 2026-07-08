import { supabase } from "./client";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      image,
      rating,
      description,
      is_package,
      package_size,
      category,
      package_type,
      product_type,
      track_stock
    `)
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}