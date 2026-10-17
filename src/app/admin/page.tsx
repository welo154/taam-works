import type { Metadata } from "next";
import { getAdminDashboardUrl } from "@/lib/backend/env";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin editing lives on the backend dashboard. This public app only
 * reads published project records from that API.
 */
export default function AdminIndexPage() {
  const dashboard = getAdminDashboardUrl();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-4 text-neutral-400">
        Project drafts, media, and publication are managed in the backend
        dashboard. This site reads published works from that database.
      </p>
      <p className="mt-6">
        <a
          href={dashboard}
          className="text-yellow underline-offset-4 hover:underline"
        >
          Open the project dashboard
        </a>
      </p>
    </div>
  );
}
