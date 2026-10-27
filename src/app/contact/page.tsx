import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { TourForm } from "@/components/TourForm";
import { ButtonLink } from "@/components/Button";
import { AddressText, EmailLink, PhoneLink } from "@/components/ContactBits";
import { T } from "@/components/T";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `${site.address.full}. Call ${site.phone} or request a tour. Open ${site.hours}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title={<T k="contact.hero.title" />}
        lede={<T k="contact.hero.lede" />}
        ledeOnMobile
        mapSrc={site.mapsEmbed}
      />

      <Section tone="white" still>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading kicker={<T k="contact.details.kicker" />} title={<T k="contact.details.title" />} />
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="kicker text-sun-deep"><T k="contact.phone.label" /></dt>
                <dd className="mt-1.5">
                  <PhoneLink className="font-display text-2xl font-medium text-navy tabular-nums underline-offset-4 hover:underline" />
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep"><T k="contact.email.label" /></dt>
                <dd className="mt-1.5">
                  <EmailLink className="break-all text-lg font-semibold text-navy underline-offset-4 hover:underline" />
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep"><T k="contact.address.label" /></dt>
                <dd className="mt-1.5 text-lg text-ink/85">
                  <AddressText />
                </dd>
                <dd className="mt-3">
                  <ButtonLink href={site.mapsHref} variant="ghost">
                    <T k="contact.directions" />
                  </ButtonLink>
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep"><T k="contact.hours.label" /></dt>
                <dd className="mt-1.5 text-lg text-ink/85"><T k="contact.hours" /></dd>
              </div>
            </dl>
          </div>

          <div id="tour" className="scroll-mt-28 lg:col-span-7">
            <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8 md:p-10">
              <h2 className="font-display text-3xl font-medium leading-[1.1] text-navy">
                <T k="contact.tour.title" />
              </h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-muted">
                <T k="contact.tour.body" />
              </p>
              <div className="mt-8">
                <TourForm />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="bg-sand" aria-label="Map">
        <div className="site-wrap py-10 md:py-14">
          <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
            <iframe
              title={`Map showing ${site.name} at ${site.address.full}`}
              src={site.mapsEmbed}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[300px] w-full md:h-[420px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
