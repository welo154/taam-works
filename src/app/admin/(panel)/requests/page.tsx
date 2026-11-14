import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/app/admin/(panel)/projects/ConfirmButton";
import { deleteRequest, setRequestStatus } from "@/app/admin/(panel)/requests/actions";
import { badge, btnDanger, btnSmall, card, cardPad, eyebrow, pageTitle, STATUS_BADGE } from "@/app/admin/ui";
import {
  bookingDetails,
  INQUIRY_STATUSES,
  listInquiries,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/inquiries";
import { supabaseConfigured } from "@/lib/supabase/rest";

export const metadata: Metadata = { title: "Requests" };
export const dynamic = "force-dynamic";

const NEXT_STEP: Record<InquiryStatus, { status: InquiryStatus; label: string } | null> = {
  new: { status: "contacted", label: "Mark contacted" },
  contacted: { status: "qualified", label: "Mark qualified" },
  qualified: { status: "closed", label: "Close" },
  closed: { status: "new", label: "Reopen" },
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function niceDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-neutral-100">{children}</dd>
    </div>
  );
}

function RequestCard({ inquiry }: { inquiry: Inquiry }) {
  const details = bookingDetails(inquiry);
  const step = NEXT_STEP[inquiry.status];
  return (
    <li className={`${card} p-5 md:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-cream">{inquiry.name}</h2>
            <span className={`${badge} ${STATUS_BADGE[inquiry.status]}`}>
              {inquiry.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {when(inquiry.created_at)}
            {inquiry.source_page ? ` · from ${inquiry.source_page}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {step ? (
            <form action={setRequestStatus}>
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value={step.status} />
              <button className={btnSmall}>{step.label}</button>
            </form>
          ) : null}
          <form action={deleteRequest}>
            <input type="hidden" name="id" value={inquiry.id} />
            <ConfirmButton
              className={btnDanger}
              message={`Delete the request from ${inquiry.name}? This cannot be undone.`}
            >
              Delete
            </ConfirmButton>
          </form>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Service">{inquiry.service_interest}</Detail>
        {details.phone ? (
          <Detail label="Phone">
            <a href={`tel:${details.phone.replace(/[^\d+]/g, "")}`} className="text-yellow hover:underline">
              {details.phone}
            </a>
          </Detail>
        ) : null}
        {details.email ? (
          <Detail label="Email">
            <a href={`mailto:${details.email}`} className="text-yellow hover:underline">
              {details.email}
            </a>
          </Detail>
        ) : null}
        {details.date ? (
          <Detail label="Preferred slot">
            {niceDate(details.date)}
            {details.time ? ` · ${details.time}` : ""}
          </Detail>
        ) : null}
        {inquiry.company ? <Detail label="Company">{inquiry.company}</Detail> : null}
        {inquiry.budget ? <Detail label="Budget">{inquiry.budget}</Detail> : null}
        {inquiry.timeline ? <Detail label="Timeline">{inquiry.timeline}</Detail> : null}
      </dl>

      {details.isBooking ? null : (
        <p className="mt-5 whitespace-pre-line rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-neutral-200">
          {inquiry.brief}
        </p>
      )}
    </li>
  );
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = INQUIRY_STATUSES.includes(status as InquiryStatus)
    ? (status as InquiryStatus)
    : null;

  if (!supabaseConfigured()) {
    return (
      <p className={`${cardPad} text-sm text-neutral-300`}>
        The database is not connected. Set SUPABASE_URL and SUPABASE_SECRET_KEY.
      </p>
    );
  }

  let all: Inquiry[] = [];
  let failed = false;
  try {
    all = await listInquiries();
  } catch {
    failed = true;
  }
  const shown = filter ? all.filter((inquiry) => inquiry.status === filter) : all;
  const count = (value: InquiryStatus) =>
    all.filter((inquiry) => inquiry.status === value).length;

  const tab = (href: string, label: string, total: number, on: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-2 text-sm transition ${
        on
          ? "bg-cream font-bold text-black"
          : "border border-white/12 text-neutral-300 hover:border-white/40"
      }`}
    >
      {label} <span className="opacity-60">{total}</span>
    </Link>
  );

  return (
    <div className="space-y-8">
      <header>
        <p className={eyebrow}>Requests</p>
        <h1 className={`${pageTitle} mt-2`}>Consultation requests</h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-400">
          Everything sent through “Let’s connect” and the contact form. Move a
          request along as you reply to it.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Filter requests">
        {tab("/admin/requests", "All", all.length, !filter)}
        {INQUIRY_STATUSES.map((value) =>
          tab(
            `/admin/requests?status=${value}`,
            value[0].toUpperCase() + value.slice(1),
            count(value),
            filter === value,
          ),
        )}
      </nav>

      {failed ? (
        <p className={`${cardPad} text-sm text-red-300`}>
          The requests could not be loaded. Check that the database is running.
        </p>
      ) : shown.length === 0 ? (
        <p className={`${cardPad} text-sm text-neutral-400`}>
          {filter ? `No ${filter} requests.` : "No requests yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {shown.map((inquiry) => (
            <RequestCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </ul>
      )}
    </div>
  );
}
