import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/LoginForm";
import { hasAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (await hasAdminSession()) redirect("/");

  return (
    <section className="site-wrap flex min-h-[70vh] items-center justify-center py-24">
      <div className="w-full max-w-md rounded-3xl border border-line bg-cream p-8 shadow-soft">
        <p className="kicker text-sun-deep">Admin</p>
        <h1 className="font-display mt-3 text-4xl font-medium text-navy">Sign in to edit</h1>
        <p className="mt-4 text-muted">
          Enter the site password to edit copy, PDFs, and images. Changes stay unpublished until
          you choose Publish.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
