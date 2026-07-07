import { createClient } from "@/lib/supabase/server";

export async function getHomepageContent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}