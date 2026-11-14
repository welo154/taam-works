import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { adminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand side */}
      <section className="relative hidden overflow-hidden bg-yellow p-12 text-black lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/brand/tab-icon.svg" alt="" width={44} height={44} />
          <span className="text-lg font-bold tracking-tight">taamworks</span>
        </div>
        <div>
          <p className="text-[clamp(3.5rem,6.5vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.06em]">
            Let
            <br />
            Taam
            <br />
            Work.
          </p>
          <p className="mt-8 max-w-sm text-lg leading-snug">
            The studio dashboard. Add projects, stack their photos and films,
            and follow up on consultation requests.
          </p>
        </div>
        <p className="text-sm opacity-70">Design · Tech · Events · Space &amp; Objects</p>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#ff7dff]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-24 h-40 w-40 rounded-full bg-black"
        />
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="admin-rise w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <Image src="/brand/tab-icon.svg" alt="" width={40} height={40} />
            <span className="text-lg font-bold tracking-tight text-cream">taamworks</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-cream">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Use the studio username and password.
          </p>
          {adminConfigured() ? null : (
            <p className="mt-6 rounded-xl border border-yellow/40 bg-yellow/10 px-4 py-3 text-sm text-yellow">
              No login is set up yet. Add ADMIN_USER and ADMIN_PASSWORD to the
              site settings, then redeploy.
            </p>
          )}
          <LoginForm next={next ?? ""} />
        </div>
      </section>
    </main>
  );
}
