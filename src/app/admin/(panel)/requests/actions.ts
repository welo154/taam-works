"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-session";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/lib/inquiries";
import { dbDelete, dbUpdate } from "@/lib/supabase/rest";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function guard(formData: FormData) {
  if (!(await isAdmin())) throw new Error("You are not signed in to the dashboard.");
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Unknown request.");
  return id;
}

export async function setRequestStatus(formData: FormData) {
  const id = await guard(formData);
  const status = String(formData.get("status") ?? "") as InquiryStatus;
  if (!INQUIRY_STATUSES.includes(status)) return;
  await dbUpdate(`inquiries?id=eq.${id}`, { status });
  revalidatePath("/admin", "layout");
}

export async function deleteRequest(formData: FormData) {
  const id = await guard(formData);
  await dbDelete(`inquiries?id=eq.${id}`);
  revalidatePath("/admin", "layout");
}
