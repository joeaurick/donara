import { createClient } from "@/lib/supabase/server";

export async function getSeo() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}