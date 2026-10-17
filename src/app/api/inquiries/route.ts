import { NextResponse } from "next/server";
import { BackendRequestError, backendPost } from "@/lib/backend/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 12000) {
    return NextResponse.json(
      { error: { code: "payload_too_large", message: "Inquiry payload too large" } },
      { status: 413 },
    );
  }

  try {
    const result = await backendPost("/api/v1/inquiries", raw, {
      "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      "x-real-ip": request.headers.get("x-real-ip") ?? "",
    });
    return NextResponse.json({ data: result.data }, { status: result.status });
  } catch (error) {
    if (error instanceof BackendRequestError) {
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
    return NextResponse.json(
      {
        error: {
          code: "inquiry_failed",
          message: "Unable to send the consultation request.",
        },
      },
      { status: 502 },
    );
  }
}
