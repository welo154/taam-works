import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <section className="site-shell py-[var(--space-section)]">
      <h1 className="text-3xl text-cream">Project not found</h1>
      <p className="mt-4 text-cream/70">
        This project is unavailable or the address is incorrect.
      </p>
      <Link
        href="/works"
        className="mt-8 inline-flex text-yellow underline-offset-4 hover:underline"
      >
        Back to Works
      </Link>
    </section>
  );
}
