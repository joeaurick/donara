import { createClient } from "@/lib/supabase/server";

export async function getBusinessProfile() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}