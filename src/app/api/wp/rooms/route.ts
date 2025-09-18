import { NextResponse } from "next/server";
import { fetchWp } from "@/lib/wordpress";

export async function GET() {
  try {
    const data = await fetchWp("/rooms?_embed");
    return NextResponse.json(data);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
