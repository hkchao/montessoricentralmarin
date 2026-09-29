import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EventList } from "@/components/EventList";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { docs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Parent education nights, school closures, celebrations, and the 2026–27 school calendar.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        kicker="Events"
        title="News and the school year"
        lede="Parent nights, closures, and celebrations — plus the full calendar PDF."
        image={{
          src: "/images/gallery-garden-lemon-tree.jpg",
          alt: "Children gather around the lemon tree in the school garden",
          focal: "50% 40%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              kicker="Upcoming"
              title="Dates to know"
              lede="Parent nights, holidays, and school celebrations."
            />
            <div className="mt-8">
              <EventList mobileLimit={8} />
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-3xl bg-navy p-7 text-white md:p-9 lg:sticky lg:top-28">
              <p className="kicker text-sun">School calendar</p>
              <h2 className="font-display mt-3 text-2xl font-medium">2026–27 calendar</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">
                Holidays, closures, and parent nights in one PDF.
              </p>
              <ButtonLink href={docs.calendar.href} className="mt-6">
                Download calendar (PDF)
              </ButtonLink>
              <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/70">
                Parent Education Nights are open to current and prospective families.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="kicker text-sun-deep">Programs</p>
            <h2 className="font-display mt-2 text-2xl font-medium text-navy sm:text-3xl">
              Looking for hours and days?
            </h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-muted">
              School Day, Day Care, partial week, summer, and enrichment live on Programs.
            </p>
          </div>
          <ButtonLink href="/programs" variant="ghost" className="shrink-0">
            View programs <ArrowIcon />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
