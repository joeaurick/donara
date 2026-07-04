import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      name,
      role,
      active,
      password,
    } = body;

    const updateProfile: any = {};

    if (name !== undefined) {
      updateProfile.name = name;
    }

    if (role !== undefined) {
      updateProfile.role = role;
    }

    if (active !== undefined) {
      updateProfile.active = active;
    }

    if (Object.keys(updateProfile).length > 0) {
      const { error } = await admin
        .from("profiles")
        .update(updateProfile)
        .eq("id", id);

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
    }

    if (
      password &&
      password.trim() !== ""
    ) {
      const { error } =
        await admin.auth.admin.updateUserById(
          id,
          {
            password,
          }
        );

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
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    await admin
      .from("profiles")
      .delete()
      .eq("id", id);

    const { error } =
      await admin.auth.admin.deleteUser(id);

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