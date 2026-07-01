import { supabase } from "./client";

export async function getGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}