import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EditableImage } from "@/components/admin/EditableImage";
import { T } from "@/components/T";
import { curriculum, daySchedules, enrichment, programs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "School Day, Day Care, partial week, Summer School, enrichment, and Fun Lunch. Ages 2–6.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title={<T k="programs.hero.title" />}
        lede={<T k="programs.hero.lede" />}
        image={{
          key: "programs.hero",
          mobileKey: "programs.hero.mobile",
          src: "/images/hero-circle-time-wide.jpg",
          // Phones keep the unextended photo so the children stay large.
          srcMobile: "/images/hero-circle-time-hd.jpg",
          alt: "Smiling preschoolers sit in a row on the classroom rug while a teacher plays guitar",
          // Focal: the row of children's faces.
          focal: "50% 50%",
          focalMobile: "45% 50%",
        }}
      />

      <Section tone="white">
        <div className="space-y-16">
          {programs.map((p, i) => {
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
                  <p className="kicker text-sun-deep"><T k={`program.${p.id}.hours`} fallback={p.hours} /></p>
                  <h3 className="font-display mt-3 text-3xl font-medium leading-[1.1] text-navy">
                    <T k={`program.${p.id}.name`} fallback={p.name} />
                  </h3>
                  <div className="prose-school mt-5 max-w-xl text-[1.0625rem] text-ink/85">
                    <p><T k={`program.${p.id}.body`} fallback={p.body.join("\n")} multiline /></p>
                  </div>
                </div>
                <div
                  className={`relative aspect-[4/3] w-full max-w-[17.5rem] overflow-hidden rounded-2xl sm:max-w-[20rem] lg:col-span-5 lg:max-w-[22rem] ${
                    flip ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end"
                  }`}
                >
                  <EditableImage
                    imageKey={`programs.${p.id}`}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 352px, 320px"
                    className="object-cover"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="day">
        <SectionHeading title={<T k="programs.day.title" />} />
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-14">
          {daySchedules.map((schedule) => (
            <div key={schedule.id} id={schedule.id} className="scroll-mt-28">
              <h3 className="font-display text-2xl font-medium leading-[1.15] text-navy">
                <T k={`schedule.${schedule.id}.title`} fallback={schedule.title} />
              </h3>
              <div className="mt-6 space-y-8">
                {schedule.sections.map((section) => (
                  <div key={section.name}>
                    <p className="kicker text-sun-deep"><T k={section.name === "Morning Session" ? "schedule.morning" : section.name === "Afternoon Session" ? "schedule.afternoon" : "schedule.daycare"} fallback={section.name} /></p>
                    <ol className="mt-3">
                      {section.slots.map((slot, slotIndex) => (
                        <li
                          key={`${section.name}-${slot.time}-${slot.label}`}
                          className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-5"
                        >
                          <p className="text-sm font-semibold tabular-nums text-navy sm:text-[0.95rem]">
                            <T k={`schedule.${schedule.id}.${schedule.sections.indexOf(section)}.${slotIndex}.time`} fallback={slot.time} />
                          </p>
                          <p className="text-[0.95rem] leading-relaxed text-muted"><T k={`schedule.${schedule.id}.${schedule.sections.indexOf(section)}.${slotIndex}.label`} fallback={slot.label} /></p>
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
              title={<T k="programs.curriculum.title" />}
              lede={<T k="programs.curriculum.lede" />}
            />
            <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
              {curriculum.map((c) => (
                <li key={c.id}>
                  <p className="font-semibold text-navy"><T k={`curriculum.${c.id}.name`} fallback={c.name} /></p>
                  <p className="mt-1 text-sm leading-relaxed text-muted"><T k={`curriculum.${c.id}.short`} fallback={c.short} /></p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6">
            <EditableImage
              imageKey="programs.curriculum"
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
              title={<T k="programs.enrichment.title" />}
              lede={<T k="programs.enrichment.lede" />}
            />
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {enrichment.map((e) => (
                <li key={e.name} className="border-t border-navy/15 pt-4">
                  <p className="font-display text-xl font-medium text-navy">
                    <T k={`enrichment.${enrichment.indexOf(e)}.name`} fallback={e.name} />
                    {e.badge ? (
                      <span className="kicker ml-2 align-middle text-[0.65rem] text-sun-deep">
                        <T k={`enrichment.${enrichment.indexOf(e)}.badge`} fallback={e.badge} />
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[0.95rem] text-muted"><T k={`enrichment.${enrichment.indexOf(e)}.note`} fallback={e.note} /></p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-[3/4] lg:max-h-[32rem]">
            <EditableImage
              imageKey="programs.enrichment"
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
            <EditableImage
              imageKey="programs.funLunch"
              fill
              quality={90}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading title={<T k="programs.funLunch.title" />} />
            <div className="prose-school mt-5 max-w-xl text-[1.0625rem] text-ink/85">
              <p>
                <T k="programs.funLunch.body" />
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-2xl bg-white p-5">
                <dt className="kicker text-sun-deep"><T k="programs.funLunch.whenLabel" /></dt>
                <dd className="font-display mt-2 text-2xl font-medium text-navy"><T k="programs.funLunch.when" /></dd>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <dt className="kicker text-sun-deep"><T k="programs.funLunch.costLabel" /></dt>
                <dd className="font-display mt-2 text-2xl font-medium text-navy"><T k="programs.funLunch.cost" /></dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
