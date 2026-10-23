// src/app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

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
  const patch: TablesUpdate<"tasks"> = {};
  if (typeof body.completed === "boolean") patch.completed = body.completed;
  if (typeof body.title === "string") patch.title = body.title;
  if ("description" in body)
    patch.description = body.description ? String(body.description) : null;
  if (body.priority) patch.priority = body.priority;
  if ("due_date" in body) patch.due_date = body.due_date || null;

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("tasks").update(patch).eq("id", id);
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
  const { error } = await admin.from("tasks").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}