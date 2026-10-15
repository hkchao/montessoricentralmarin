import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { afterSchool, curriculum, enrichment, programs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "School Day, Day Care, partial week, Summer School, enrichment, and Fun Lunch. Ages 2–6.",
};

const rhythm = [
  { time: "7:30 – 8:45", label: "Early arrival", note: "Art and games for Day Care arrivals." },
  { time: "9:00 – 12:00", label: "Montessori work period", note: "Independent work with the materials, plus group time." },
  { time: "12:00", label: "Lunch", note: "Friday Fun Lunch, cooked by the children." },
  { time: "12:30 – 2:30", label: "Nap or cultural program", note: "Rest, or zoology, botany, geography, history, music, and art." },
  { time: "2:45", label: "School Day pick-up", note: "15-minute window on either side." },
  { time: "2:45 – 5:30", label: "Extended day", note: "Until 5:30 pm for Day Care children." },
];

const programPhotos: Record<string, { src: string; alt: string }> = {
  "school-day": {
    src: "/images/photo-pouring-guide.jpeg",
    alt: "A teacher guides a child pouring from a small pitcher during practical life work",
  },
  "day-care": {
    src: "/images/photo-sandbox.jpeg",
    alt: "Two children play together in the sandbox with trucks and shovels",
  },
  "partial-week": {
    src: "/images/photo-bead-chains.jpeg",
    alt: "A child counts along coloured Montessori bead chains on a work mat",
  },
  summer: {
    src: "/images/photo-beach-shore.jpeg",
    alt: "A child dips a pink tub at the shoreline on a summer field trip",
  },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Our Programs"
        lede="Ages 2–6. Same curriculum in every schedule."
        image={{
          src: "/images/photo-circle-time.jpeg",
          alt: "Children and teachers gathered for circle time in the Montessori classroom",
          focal: "50% 40%",
        }}
      />

      <Section tone="white">
        <div className="space-y-16">
          {programs.map((p, i) => {
            const photo = programPhotos[p.id];
            const flip = i % 2 === 1;
            return (
              <article
                key={p.id}
                id={p.id}
                className={`scroll-mt-28 grid items-start gap-6 lg:grid-cols-12 lg:gap-10 ${
                  i > 0 ? "border-t border-line pt-10" : ""
                }`}
              >
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <p className="kicker text-sun-deep">{p.hours}</p>
                  <h3 className="font-display mt-3 text-3xl font-medium leading-[1.1] text-navy">
                    {p.name}
                  </h3>
                  <div className="prose-school mt-5 max-w-xl text-[1.0625rem] text-ink/85">
                    {p.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </div>
                {photo && (
                  <div
                    className={`relative aspect-[4/3] w-full max-w-[17.5rem] overflow-hidden rounded-2xl sm:max-w-[20rem] lg:col-span-5 lg:max-w-[22rem] ${
                      flip ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 352px, 320px"
                      className="object-cover"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="day">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Schedule" title="A typical day" />
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/photo-number-rods.jpeg"
                alt="A child arranges Montessori number rods on a floor mat during the work period"
                fill
                quality={90}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="lg:col-span-7">
            {rhythm.map((r) => (
              <li
                key={r.time}
                className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
              >
                <p className="font-semibold tabular-nums text-navy">{r.time}</p>
                <div>
                  <p className="font-semibold text-navy">{r.label}</p>
                  <p className="mt-0.5 text-[0.95rem] text-muted">{r.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="white" id="curriculum">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              kicker="Curriculum"
              title="What children learn"
              lede="Six areas of work, in English and Spanish."
            />
            <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
              {curriculum.map((c) => (
                <li key={c.id}>
                  <Link href={`/curriculum#${c.id}`} className="group block">
                    <p className="font-semibold text-navy underline-offset-4 group-hover:underline">
                      {c.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.short}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/curriculum" variant="ghost" className="mt-8">
              Full curriculum <ArrowIcon />
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6">
            <Image
              src="/images/photo-stamp-game.jpeg"
              alt="A child works with Montessori stamp-game tiles for math on a table"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 50%" }}
            />
          </div>
        </div>
      </Section>

      <Section id="enrichment">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <SectionHeading
              kicker="Enrichment"
              title="Music, yoga, cooking, and more"
              lede="Weekly classes, plus optional after-school gymnastics and drama."
            />
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {enrichment.map((e) => (
                <li key={e.name} className="border-t border-navy/15 pt-4">
                  <p className="font-display text-xl font-medium text-navy">{e.name}</p>
                  <p className="mt-1 text-[0.95rem] text-muted">{e.note}</p>
                </li>
              ))}
              {afterSchool.map((e) => (
                <li key={e.name} className="border-t border-navy/15 pt-4">
                  <p className="font-display text-xl font-medium text-navy">
                    {e.name}{" "}
                    <span className="kicker ml-1 align-middle text-[0.65rem] text-sun-deep">
                      After school
                    </span>
                  </p>
                  <p className="mt-1 text-[0.95rem] text-muted">{e.note}</p>
                </li>
              ))}
              <li className="border-t border-navy/15 pt-4">
                <p className="font-display text-xl font-medium text-navy">Monthly field trips</p>
                <p className="mt-1 text-[0.95rem] text-muted">Into the community</p>
              </li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-[3/4] lg:max-h-[32rem]">
            <Image
              src="/images/photo-yoga.jpeg"
              alt="Children practice yoga on colourful mats with a guide standing by"
              fill
              quality={90}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section tone="sand" id="fun-lunch">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-5">
            <Image
              src="/images/photo-lunch.jpeg"
              alt="A smiling child sits at the table with an open lunch box"
              fill
              quality={90}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading kicker="Fridays" title="Fun Lunch" />
            <div className="prose-school mt-5 max-w-xl text-[1.0625rem] text-ink/85">
              <p>
                During the school year, Friday lunch alternates pizza and pesto pasta, with
                vegetables, fruit, and juice or milk. Children cook the meal in class.{" "}
                <strong>$7</strong> per meal.
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-2xl bg-white p-5">
                <dt className="kicker text-sun-deep">When</dt>
                <dd className="font-display mt-2 text-2xl font-medium text-navy">Fridays</dd>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <dt className="kicker text-sun-deep">Cost</dt>
                <dd className="font-display mt-2 text-2xl font-medium text-navy">$7 / meal</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
