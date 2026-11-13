import { NextResponse } from "next/server";
import { BackendRequestError, backendPost } from "@/lib/backend/client";
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

  try {
    const result = await backendPost("/api/v1/inquiries", JSON.stringify(inquiry), {
      "x-forwarded-for": ip,
      "x-real-ip": ip,
    });
    return NextResponse.json({ data: result.data }, { status: result.status });
  } catch (error) {
    if (error instanceof BackendRequestError) {
      if (error.code === "backend_unreachable") {
        return fail(
          503,
          "backend_unreachable",
          `Our form is offline right now. Please email ${contact.email} and we will reply directly.`,
        );
      }
      return NextResponse.json(
        {
          error: {
            code: error.code ?? "inquiry_failed",
            message: error.message,
            ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
          },
        },
        { status: error.status },
      );
    }
    return fail(502, "inquiry_failed", "Unable to send the consultation request.");
  }
}
