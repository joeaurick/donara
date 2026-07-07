import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

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
      package_type
    `)
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}