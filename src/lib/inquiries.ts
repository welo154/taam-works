import { db } from "@/lib/supabase/rest";

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "qualified",
  "closed",
];

export type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  service_interest: string;
  brief: string;
  budget: string | null;
  timeline: string | null;
  status: InquiryStatus;
  source_page: string | null;
  created_at: string;
  // Present once the bookings database update has been run.
  phone?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
};

/** Address stored for phone-only bookings before the database update. */
export const PLACEHOLDER_EMAIL = "phone-booking@taamworks.com";

export function listInquiries(limit = 200) {
  return db<Inquiry[]>(`inquiries?select=*&order=created_at.desc&limit=${limit}`);
}

/** Phone, date and time, from their own columns or from the booking text. */
export function bookingDetails(inquiry: Inquiry) {
  const fromBrief = (label: string) =>
    inquiry.brief.match(new RegExp(`^${label}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? null;
  const clean = (value: string | null) =>
    value && value !== "not given" ? value : null;
  return {
    phone: inquiry.phone ?? clean(fromBrief("Phone")),
    date: inquiry.preferred_date ?? clean(fromBrief("Preferred date")),
    time: inquiry.preferred_time ?? clean(fromBrief("Preferred time")),
    email:
      inquiry.email && inquiry.email !== PLACEHOLDER_EMAIL ? inquiry.email : null,
    isBooking: inquiry.brief.startsWith("Consultation booking."),
  };
}
