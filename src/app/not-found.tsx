import { ButtonLink } from "@/components/Button";
import { T } from "@/components/T";

export default function NotFound() {
  return (
    <section className="site-wrap flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="kicker text-sun-deep"><T k="notFound.kicker" /></p>
      <h1 className="font-display mt-3 text-4xl font-medium text-navy sm:text-5xl"><T k="notFound.title" /></h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        <T k="notFound.body" />
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/"><T k="notFound.home" /></ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          <T k="notFound.contact" />
        </ButtonLink>
      </div>
    </section>
  );
}
