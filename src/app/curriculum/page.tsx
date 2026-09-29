import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { curriculum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Curriculum",
  description:
    "Practical Life, Sensorial, Mathematics, Language Arts, Spanish, and Cultural Studies.",
};

export default function CurriculumPage() {
  return (
    <>
      <PageHero
        kicker="Curriculum"
        title="The Montessori curriculum"
        lede="Six areas of work, in English and Spanish."
        image={{
          src: "/images/hero-materials.png",
          alt: "A child's hands placing a cube on the Montessori pink tower",
          // Focal: the child's hands at the top of the pink tower.
          focal: "70% 30%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading kicker="Overview" title="The six areas" />
            <div className="prose-school mt-6 max-w-2xl text-[1.0625rem] text-ink/85">
              <p>
                Practical Life, Sensorial, Mathematics, and Language Arts, plus daily Spanish
                and Cultural Studies. Every area practices the same skills:{" "}
                <strong>concentration, order, coordination, and independence</strong>.
              </p>
              <p>
                Classroom ground rules help children work together while they learn about
                themselves and the world.
              </p>
            </div>
          </div>
          <nav aria-label="Curriculum areas" className="lg:col-span-5">
            <p className="kicker text-sun-deep">Jump to</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {curriculum.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="inline-flex items-baseline gap-2 py-1 font-semibold text-navy underline-offset-4 hover:underline">
                    <span className="kicker text-[0.65rem] text-sun-deep">{String(i + 1).padStart(2, "0")}</span>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>

      {curriculum.map((c, i) => {
        const flip = i % 2 === 1;
        return (
          <Section key={c.id} id={c.id} tone={i % 2 === 0 ? "cream" : "white"} className="!py-14 md:!py-20">
            <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-tint lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
                <p className="kicker text-sun-deep">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="font-display mt-3 text-3xl font-medium leading-[1.1] text-navy sm:text-4xl">{c.name}</h2>
                <div className="prose-school mt-5 max-w-2xl text-[1.0625rem] text-ink/85">
                  {c.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          </Section>
        );
      })}
    </>
  );
}
