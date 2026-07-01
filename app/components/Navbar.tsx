import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();

  const { data } = await supabase
  .from("business_profile")
  .select(`
    business_name,
    tagline,
    logo,
    phone,
    whatsapp_message
  `)
  .eq("id", 1)
  .single();

  return (
    <NavbarClient
  businessName={data?.business_name || "Donara"}
  tagline={data?.tagline || "Fresh Every Day"}
  logo={data?.logo || "/images/logo/logo.png"}
  phone={data?.phone || ""}
  whatsappMessage={
    data?.whatsapp_message ||
    "Halo, saya ingin memesan donat."
  }
/>
  );
}