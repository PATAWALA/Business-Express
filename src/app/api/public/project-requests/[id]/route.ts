// src/app/api/project-requests/[id]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

const VALID_STATUSES = ["new", "contacted", "quoted", "converted", "archived"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const patch: TablesUpdate<"project_requests"> = {};

  if (
    body.status &&
    VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])
  ) {
    patch.status = body.status;
  }
  if ("notes" in body) {
    patch.notes = body.notes ? String(body.notes).trim() : null;
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });

  patch.updated_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_requests")
    .update(patch)
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_requests")
    .delete()
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}