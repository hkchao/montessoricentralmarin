import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EditableImage } from "@/components/admin/EditableImage";
import { T } from "@/components/T";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bilingual Montessori learning community in San Rafael. Mission, philosophy, and AMS affiliation.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={<T k="about.hero.title" />}
        lede={<T k="about.hero.lede" />}
        image={{
          key: "about.hero",
          src: "/images/hero-garden.png",
          alt: "A sunny preschool garden with a lemon tree and raised beds",
          focal: "72% 45%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title={<T k="about.what.title" />} />
            <div className="prose-school mt-6 max-w-2xl text-[1.0625rem] text-ink/85">
              <p>
                <T k="about.what.body1" />
              </p>
              <p>
                <T k="about.what.body2" />
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] self-start overflow-hidden rounded-2xl lg:col-span-5">
            <EditableImage
              imageKey="about.what"
              fill
              quality={90}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-3xl font-medium leading-[1.1] text-navy">
              <T k="about.mission.title" />
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              <T k="about.mission.body" />
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-medium leading-[1.1] text-navy">
              <T k="about.philosophy.title" />
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              <T k="about.philosophy.body" />
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading kicker={<T k="about.recognition.kicker" />} title={<T k="about.recognition.title" />} />
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              <T k="about.recognition.body" />
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 lg:col-span-7 lg:justify-end">
            <EditableImage
              imageKey="brand.bestOfMarin"
              width={574}
              height={600}
              className="h-40 w-auto"
            />
            <a
              href={site.social.ams}
              target="_blank"
              rel="noreferrer"
              aria-label="American Montessori Society (opens in new tab)"
            >
              <EditableImage
                imageKey="brand.ams"
                width={512}
                height={512}
                className="size-16"
              />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
