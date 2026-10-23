import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("order_ref, status, margin_fcfa")
    .limit(3);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, count: data?.length, orders: data });
}