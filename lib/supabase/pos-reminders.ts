import { supabase } from "@/lib/supabase/client";

export type PosReminder = {
  id: string;
  business_id: string | null;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// =========================
// GET ACTIVE REMINDERS
// =========================
export async function getActivePosReminders() {
  const { data, error } = await supabase
    .from("pos_reminders")
    .select("*")
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as PosReminder[];
}

// =========================
// CREATE REMINDER
// =========================
export async function createPosReminder(
  message: string
) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error(
      "Isi reminder tidak boleh kosong."
    );
  }

  const { data, error } = await supabase
    .from("pos_reminders")
    .insert({
      message: cleanMessage,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as PosReminder;
}

// =========================
// DEACTIVATE REMINDER
// =========================
export async function deactivatePosReminder(
  id: string
) {
  const { data, error } = await supabase
    .from("pos_reminders")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as PosReminder;
}

// =========================
// DELETE REMINDER
// =========================
export async function deletePosReminder(
  id: string
) {
  const { error } = await supabase
    .from("pos_reminders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}

// =========================
// UPDATE REMINDER
// =========================

export async function updatePosReminder(
  id: string,
  message: string
) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error(
      "Isi reminder tidak boleh kosong."
    );
  }

  const { data, error } = await supabase
    .from("pos_reminders")
    .update({
      message: cleanMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as PosReminder;
}