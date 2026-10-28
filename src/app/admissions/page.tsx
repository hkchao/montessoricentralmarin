import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { DocButton, DocDownloadLink } from "@/components/admin/DocButton";
import { EditableImage } from "@/components/admin/EditableImage";
import { PhoneLink, EmailLink } from "@/components/ContactBits";
import { T } from "@/components/T";
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
        title={<T k="admissions.hero.title" />}
        lede={<T k="admissions.hero.lede" />}
        image={{
          key: "admissions.hero",
          src: "/images/hero-school-front.jpg",
          alt: "The front of the Montessori School of Central Marin building with its sign and blooming bougainvillea",
          // Focal: the front steps, planting, and forecourt.
          focal: "50% 78%",
          focalMobile: "85% 50%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker={<T k="admissions.process.kicker" />}
              title={<T k="admissions.process.title" />}
              lede={<T k="admissions.process.lede" />}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href}>
                <T k="cta.primary" fallback={primaryCta.label} /> <ArrowIcon />
              </ButtonLink>
              <PhoneLink className="inline-flex items-center justify-center gap-2 rounded-full border border-navy/25 px-5 py-2.5 text-[0.9375rem] font-semibold text-navy hover:border-navy hover:bg-navy-tint" />
            </div>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
              <EditableImage
                imageKey="admissions.process"
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
                  <h3 className="font-semibold text-navy"><T k={`admissions.step.${i}.title`} fallback={s.title} /></h3>
                  {s.body.includes(site.phone) ? (
                    <p className="mt-1.5 text-[1rem] leading-relaxed text-muted">
                      <T k="admissions.step.0.prefix" />{" "}
                      <PhoneLink className="font-semibold text-navy underline-offset-4 hover:underline" />{" "}
                      <T k="admissions.step.0.middle" />{" "}
                      <EmailLink className="break-all font-semibold text-navy underline-offset-4 hover:underline" />
                      .
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[1rem] leading-relaxed text-muted"><T k={`admissions.step.${i}.body`} fallback={s.body} /></p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="tuition">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading kicker={<T k="admissions.tuition.kicker" />} title={<T k="admissions.tuition.title" />} />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <DocButton docKey="tuition" variant="navy" size="lg">
              <T k="admissions.tuition.cta" />
            </DocButton>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy"><T k="admissions.tuition.payment.title" /></h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              <T k="admissions.tuition.payment.body" />
            </p>
          </div>
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy"><T k="admissions.tuition.sibling.title" /></h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              <T k="admissions.tuition.sibling.body" />
            </p>
          </div>
          <div className="border-t-2 border-navy pt-5">
            <h3 className="font-display text-2xl font-medium text-navy"><T k="admissions.tuition.summer.title" /></h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              <T k="admissions.tuition.summer.body" />
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" id="downloads">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker={<T k="admissions.downloads.kicker" />}
              title={<T k="admissions.downloads.title" />}
              lede={<T k="admissions.downloads.lede" />}
            />
            <p className="mt-6 rounded-2xl bg-sun/15 p-5 text-[0.95rem] leading-relaxed text-navy">
              <T k="admissions.downloads.note" />
            </p>
          </div>
          <ul className="grid gap-3 self-start lg:col-span-7">
            {downloads.map((d) => (
              <li key={d.href}>
                <DocDownloadLink
                  docKey={Object.entries(docs).find(([, doc]) => doc.href === d.href)?.[0] ?? "calendar"}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-cream px-5 py-4 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-soft"
                >
                  <DocIcon />
                  <span className="flex-1 font-semibold text-navy">{d.label}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    <T k="admissions.downloads.type" />
                  </span>
                </DocDownloadLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
