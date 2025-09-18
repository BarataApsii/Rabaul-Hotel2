import { NextResponse } from "next/server";
import { fetchWp } from "@/lib/wordpress";

export async function GET() {
  try {
    const data = await fetchWp("/rooms?_embed");
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
