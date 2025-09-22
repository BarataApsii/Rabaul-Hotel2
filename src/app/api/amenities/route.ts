// app/api/amenities/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.WP_BASE}/wp-json/wp/v2/amenities?_embed`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
