import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="site-wrap flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="kicker text-sun-deep">404</p>
      <h1 className="font-display mt-3 text-4xl font-medium text-navy sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        That address isn't on this site. Head home, or contact the office.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Contact us
        </ButtonLink>
      </div>
    </section>
  );
}
