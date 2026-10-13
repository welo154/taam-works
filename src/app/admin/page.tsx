import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin route area stub. Auth, dashboard, and publication land in Prompts 5–6.
 */
export default function AdminIndexPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-4 text-neutral-400">
        Sign-in and the project dashboard are not implemented in the fixture
        frontend stages. Public portfolio pages use local fixtures only.
      </p>
    </div>
  );
}
