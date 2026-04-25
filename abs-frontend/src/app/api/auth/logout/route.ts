import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN, COOKIE_USER } from "@/lib/cookies";

export async function POST() {
  const jar = await cookies();
  jar.delete(COOKIE_ACCESS_TOKEN);
  jar.delete(COOKIE_USER);
  return NextResponse.json({ ok: true });
}
