import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { TourForm } from "@/components/TourForm";
import { ButtonLink } from "@/components/Button";
import { docs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `${site.address.full}. Call ${site.phone} or request a tour. Open ${site.hours}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Visit and tour"
        lede={`Open ${site.hours}. Tours by appointment.`}
        ledeOnMobile
      />

      <Section tone="white" still>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Details" title="Phone, email, and address" />
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="kicker text-sun-deep">Phone</dt>
                <dd className="mt-1.5">
                  <a
                    href={site.phoneHref}
                    className="font-display text-2xl font-medium text-navy tabular-nums underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-lg font-semibold text-navy underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep">Address</dt>
                <dd className="mt-1.5 text-lg text-ink/85">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </dd>
                <dd className="mt-3">
                  <ButtonLink href={site.mapsHref} variant="ghost">
                    Get directions
                  </ButtonLink>
                </dd>
              </div>
              <div>
                <dt className="kicker text-sun-deep">Hours</dt>
                <dd className="mt-1.5 text-lg text-ink/85">{site.hours}</dd>
              </div>
            </dl>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/gallery-garden-friends.jpg"
                alt="Children and a teacher outdoors at the school"
                fill
                quality={90}
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div id="tour" className="scroll-mt-28 lg:col-span-7">
            <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8 md:p-10">
              <h2 className="font-display text-3xl font-medium leading-[1.1] text-navy">
                Request a tour
              </h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-muted">
                We&rsquo;ll confirm a time. You&rsquo;ll see the classroom during the work period.
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

      <Section tone="white">
        <div className="flex flex-col gap-6 rounded-3xl bg-navy-tint p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="kicker text-sun-deep">Calendar</p>
            <h2 className="font-display mt-2 text-2xl font-medium text-navy">
              Upcoming dates and closures
            </h2>
            <p className="mt-2 max-w-xl text-[1rem] leading-relaxed text-muted">
              Parent nights, holidays, and the full school year live on Events.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/events" variant="navy">
              View events
            </ButtonLink>
            <ButtonLink href={docs.calendar.href} variant="ghost">
              Calendar (PDF)
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
