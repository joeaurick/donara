import { createClient } from "@/lib/supabase/server";

export async function getSeo() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  return data;
}