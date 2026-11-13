import { NextResponse } from "next/server";
import { rpc, SupabaseError } from "@/lib/supabase/rest";
import { contact } from "@/content/site";

export const dynamic = "force-dynamic";

const MAX_BODY_CHARS = 12000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best effort per instance; the backend should enforce its own limit too.
const recent = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) {
    for (const [key, times] of recent) {
      if (times.every((at) => now - at >= WINDOW_MS)) recent.delete(key);
    }
  }
  return false;
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return fail(413, "payload_too_large", "Inquiry payload too large");
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid_json", "Unable to read the consultation request.");
  }

  // Honeypot: people never see this field, bots fill it. Pretend success.
  const { website, ...inquiry } = payload;
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ data: { received: true } }, { status: 201 });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return fail(429, "rate_limited", "Too many requests. Please wait before submitting again.");
  }

  const field = (key: string, max: number) => {
    const value = inquiry[key];
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  };
  const name = field("name", 200);
  const email = field("email", 320);
  const serviceInterest = field("serviceInterest", 200);
  const brief = field("brief", 5000);
  const fieldErrors: Record<string, string[]> = {};
  if (!name) fieldErrors.name = ["Please add your name."];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = ["Please add a valid email."];
  }
  if (!serviceInterest) fieldErrors.serviceInterest = ["Please choose a service."];
  if (brief.length < 10) fieldErrors.brief = ["Please add a short brief."];
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_inquiry",
          message: "Please check the highlighted fields.",
          fieldErrors,
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await rpc<{ id: string; duplicate: boolean }>("submit_inquiry", {
      p_name: name,
      p_email: email,
      p_company: field("company", 200) || null,
      p_service_interest: serviceInterest,
      p_brief: brief,
      p_budget: field("budget", 200) || null,
      p_timeline: field("timeline", 200) || null,
      p_source_page: field("sourcePage", 200) || null,
      p_rate_key: ip,
      p_limit: MAX_PER_WINDOW,
      p_window_seconds: WINDOW_MS / 1000,
    });
    return NextResponse.json({ data: { id: result.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseError) {
      if (/rate|too many/i.test(error.message)) {
        return fail(429, "rate_limited", "Too many requests. Please wait before submitting again.");
      }
      if (error.code === "23514") {
        return fail(400, "invalid_inquiry", "Please check your details and try again.");
      }
      console.error("[inquiries] could not store inquiry.", error);
      return fail(
        503,
        "backend_unreachable",
        `Our form is offline right now. Please email ${contact.email} and we will reply directly.`,
      );
    }
    return fail(502, "inquiry_failed", "Unable to send the consultation request.");
  }
}
