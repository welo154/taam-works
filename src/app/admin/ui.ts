/** Shared class names for the dashboard, so every section looks the same. */

export const card = "rounded-2xl border border-white/10 bg-white/[0.035]";

export const cardPad = `${card} p-6 md:p-7`;

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-yellow px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-100 transition hover:border-white/40 hover:bg-white/5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30";

export const btnSmall =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30";

export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-red-400/25 px-3 py-1.5 text-xs text-red-300 transition hover:border-red-400/60 hover:bg-red-500/10";

export const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-sm text-neutral-200 transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-25";

export const input =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-yellow focus:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40";

export const selectSmall =
  "rounded-full border border-white/12 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 outline-none transition focus:border-yellow";

export const label = "block text-sm font-medium text-neutral-300";

export const eyebrow =
  "text-xs font-bold uppercase tracking-[0.18em] text-neutral-500";

export const pageTitle = "text-3xl font-bold tracking-tight text-cream md:text-4xl";

export const STATUS_BADGE: Record<string, string> = {
  published: "bg-emerald-400/15 text-emerald-300",
  draft: "bg-white/10 text-neutral-300",
  archived: "bg-red-400/15 text-red-300",
  new: "bg-yellow/20 text-yellow",
  contacted: "bg-sky-400/15 text-sky-300",
  qualified: "bg-emerald-400/15 text-emerald-300",
  closed: "bg-white/10 text-neutral-400",
};

export const badge =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide";
