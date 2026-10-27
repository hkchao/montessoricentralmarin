import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { curriculum, daySchedules, enrichment, programs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "School Day, Day Care, partial week, Summer School, enrichment, and Fun Lunch. Ages 2–6.",
};

const programPhotos: Record<string, { src: string; alt: string }> = {
  "school-day": {
    src: "/images/gallery-child-writing.jpg",
    alt: "A child writes carefully during the work period",
  },
  "day-care": {
    src: "/images/gallery-guide-and-child.jpg",
    alt: "A teacher guides a child through a tray activity",
  },
  "partial-week": {
    src: "/images/gallery-knobbed-cylinders.jpg",
    alt: "A child works with Montessori knobbed cylinders",
  },
  summer: {
    src: "/images/gallery-garden-lemon-tree.jpg",
    alt: "Children explore the lemon tree during outdoor learning",
  },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Our Programs"
        lede="Ages 2–6. Same curriculum in every schedule."
        image={{
          src: "/images/hero-classroom.png",
          alt: "A bright Montessori classroom with low wooden shelves of materials",
          focal: "66% 40%",
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
        <SectionHeading kicker="Schedule" title="A typical day" />
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-14">
          {daySchedules.map((schedule) => (
            <div key={schedule.id} id={schedule.id} className="scroll-mt-28">
              <h3 className="font-display text-2xl font-medium leading-[1.15] text-navy">
                {schedule.title}
              </h3>
              <div className="mt-6 space-y-8">
                {schedule.sections.map((section) => (
                  <div key={section.name}>
                    <p className="kicker text-sun-deep">{section.name}</p>
                    <ol className="mt-3">
                      {section.slots.map((slot) => (
                        <li
                          key={`${section.name}-${slot.time}-${slot.label}`}
                          className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-5"
                        >
                          <p className="text-sm font-semibold tabular-nums text-navy sm:text-[0.95rem]">
                            {slot.time}
                          </p>
                          <p className="text-[0.95rem] leading-relaxed text-muted">{slot.label}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
                  <p className="font-semibold text-navy">{c.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{c.short}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6">
            <Image
              src="/images/hero-spanish.png"
              alt="A bilingual language shelf with Spanish vocabulary cards and objects"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "100% 50%" }}
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
              lede="In addition to the curriculum there are several enrichment activities, some available to all children during the school day, others only available by sign-up."
            />
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {enrichment.map((e) => (
                <li key={e.name} className="border-t border-navy/15 pt-4">
                  <p className="font-display text-xl font-medium text-navy">
                    {e.name}
                    {e.badge ? (
                      <span className="kicker ml-2 align-middle text-[0.65rem] text-sun-deep">
                        {e.badge}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[0.95rem] text-muted">{e.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-[3/4] lg:max-h-[32rem]">
            <Image
              src="/images/gallery-garden-lemon-tree.jpg"
              alt="A teacher shows children the lemon tree in the school garden"
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
              src="/images/gallery-child-painting.jpg"
              alt="A child paints at an easel during the school day"
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
                During the school year, Friday “Fun Lunch” is a part of our cooking enrichment.
                Children assist in the preparation of food. Lunch alternates between vegetarian
                pizza and pesto pasta, with vegetables, fruit, and juice or milk for a complete
                and wholesome meal. <strong>$7</strong> per meal. Weekly, monthly, or annual
                sign-up available.
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
