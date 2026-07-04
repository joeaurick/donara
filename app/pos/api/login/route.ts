import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("pos_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = randomUUID();

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    await supabase.from("pos_sessions").insert({
      token,
      user_id: user.id,
      expires_at: expires.toISOString(),
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("pos_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan." },
      { status: 500 }
    );
  }
}