import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUsers() {
  const {
    data: { users },
    error,
  } = await admin.auth.admin.listUsers();

  if (error) throw error;

  const { data: profiles, error: profileError } =
    await admin
      .from("profiles")
      .select("*");

  if (profileError) throw profileError;

  return users.map((user) => {
    const profile = profiles?.find(
      (p) => p.id === user.id
    );

    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,

      name: profile?.name ?? "",

      role: profile?.role ?? "customer",

      active: profile?.active ?? true,
    };
  });
}

export async function GET() {
  try {
    const users = await getUsers();

    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      name,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email dan Password wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    await admin
      .from("profiles")
      .upsert({
        id: data.user.id,
        name: name ?? "",
        role: "cashier",
        active: true,
      });

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}