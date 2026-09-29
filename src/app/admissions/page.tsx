import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { admissionSteps, docs, primaryCta, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How to apply: tour, application, tuition, sibling discount, and 2026–27 forms.",
};

function DocIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5 shrink-0 text-sage">
      <path
        d="M5.5 2.5h6l3 3v11a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 2.5v3h3M7.5 10h5M7.5 13h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdmissionsPage() {
  const downloads = [docs.application, docs.enrollment, docs.reEnrollment, docs.tuition, docs.calendar];

  return (
    <>
      <PageHero
        kicker="Admissions"
        title="How to apply"
        lede="Ages 2–6. Tour first. Places are first come, first served."
        image={{
          src: "/images/hero-entry.png",
          alt: "A row of small wooden cubbies holding children's backpacks",
          focal: "70% 45%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker="The process"
              title="The steps"
              lede="Five steps from tour to first day."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href}>
                {primaryCta.label} <ArrowIcon />
              </ButtonLink>
              <ButtonLink href={site.phoneHref} variant="ghost">
                {site.phone}
              </ButtonLink>
            </div>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/gallery-guide-and-child.jpg"
                alt="A teacher and child working together in the classroom"
                fill
                quality={90}
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="lg:col-span-7">
            {admissionSteps.map((s, i) => (
              <li
                key={s.title}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6 first:pt-0"
              >
                <span className="font-display flex size-12 items-center justify-center rounded-full bg-navy-tint text-xl font-semibold text-navy">
                  {i + 1}
                </span>
                <div className="pt-2">
                  <h3 className="font-semibold text-navy">{s.title}</h3>
                  <p className="mt-1.5 text-[1rem] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="tuition">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading
              kicker="Tuition"
              title="Tuition and sibling discount"
              lede="Nine monthly payments. Families with more than one child enrolled receive 10% off the oldest child&rsquo;s tuition."
            />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <ButtonLink href={docs.tuition.href} variant="navy" size="lg">
              Download 2026–27 tuition (PDF)
            </ButtonLink>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy">Payment schedule</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              September 1 through May 1. The $500 enrollment deposit is due before the first
              day and is applied to the last payment.
            </p>
          </div>
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy">Sibling discount</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              <strong className="text-navy">10% off</strong> the oldest child&rsquo;s tuition when
              more than one child is enrolled.
            </p>
          </div>
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy">Summer school</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              Summer tuition is separate (June, July, and August). Rates are on the tuition
              sheet.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" id="downloads">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker="Downloads"
              title="Application forms"
              lede="Send the 2-page application with a $100 fee and $500 tuition deposit (check or money order)."
            />
            <p className="mt-6 rounded-2xl bg-sun/15 p-5 text-[0.95rem] leading-relaxed text-navy">
              New-family applications for 2027–28 open <strong>January 1, 2027</strong>.
            </p>
          </div>
          <ul className="grid gap-3 self-start lg:col-span-7">
            {downloads.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-cream px-5 py-4 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-soft"
                >
                  <DocIcon />
                  <span className="flex-1 font-semibold text-navy">{d.label}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    PDF
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
