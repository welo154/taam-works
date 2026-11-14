import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/app/admin/(panel)/AdminNav";
import { signOut } from "@/app/admin/auth-actions";
import { adminOpenInDev } from "@/lib/admin-auth";
import { isAdmin } from "@/lib/admin-session";
import { db, supabaseConfigured } from "@/lib/supabase/rest";

export const dynamic = "force-dynamic";

async function countNewRequests() {
  if (!supabaseConfigured()) return 0;
  try {
    const rows = await db<{ id: string }[]>("inquiries?select=id&status=eq.new");
    return rows.length;
  } catch {
    return 0;
  }
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The proxy already redirects signed-out visitors; this is the second lock.
  if (!(await isAdmin())) redirect("/admin/login");
  const newRequests = await countNewRequests();

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur lg:h-screen lg:gap-8 lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/tab-icon.svg" alt="" width={36} height={36} />
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-cream">
                taamworks
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Dashboard
              </span>
            </span>
          </Link>
        </div>

        <AdminNav newRequests={newRequests} />

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-cream"
          >
            <span aria-hidden="true">↗</span> View site
          </Link>
          {adminOpenInDev() ? (
            <p className="px-3.5 text-xs text-neutral-500">
              Local mode: no login set.
            </p>
          ) : (
            <form action={signOut}>
              <button className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm text-neutral-300 transition hover:bg-white/5 hover:text-cream">
                <span aria-hidden="true">⎋</span> Sign out
              </button>
            </form>
          )}
        </div>
      </aside>

      <main className="admin-rise mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-12">
        {children}
      </main>
    </div>
  );
}
