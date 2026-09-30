import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
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
        title="About Montessori of Central Marin"
        lede="English and Spanish. Ages 2–6. Serving Marin families since 1974."
        image={{
          src: "/images/hero-garden.png",
          alt: "A sunny preschool garden with a lemon tree and raised beds",
          focal: "72% 45%",
        }}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title="What we&rsquo;re about" />
            <div className="prose-school mt-6 max-w-2xl text-[1.0625rem] text-ink/85">
              <p>
                Montessori School of Central Marin is a bilingual learning community where
                children learn and explore in English and Spanish. Our Montessori curriculum
                combines hands-on discovery with art, music, movement, and gardening. Shared
                cultural traditions and experiences in the wider community help children
                connect with the world around them.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] self-start overflow-hidden rounded-2xl lg:col-span-5">
            <Image
              src="/images/gallery-garden-friends.jpg"
              alt="Children and a teacher gathered around a rabbit in the garden"
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
              Our Mission
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              Our mission is to nurture each child&rsquo;s natural curiosity and help them
              grow into a confident, independent learner.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-medium leading-[1.1] text-navy">
              Our Philosophy
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              Children have a natural desire to explore and understand their world. We
              support that desire with a welcoming environment, meaningful activities, and
              guidance that responds to each child&rsquo;s development. Teachers and
              families work together to give children the care, encouragement, and room they
              need to grow.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Recognition" title="Awards and affiliations" />
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              Best of Marin 2026, voted by Pacific Sun readers. Affiliate of the American
              Montessori Society.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 lg:col-span-7 lg:justify-end">
            <Image
              src="/brand/best-of-marin-2026.png"
              alt="Pacific Sun Best of Marin 2026"
              width={624}
              height={784}
              className="h-40 w-auto"
            />
            <a
              href={site.social.ams}
              target="_blank"
              rel="noreferrer"
              aria-label="American Montessori Society (opens in new tab)"
            >
              <Image
                src="/brand/ams-logo.jpg"
                alt="American Montessori Society — education that transforms lives"
                width={1517}
                height={308}
                className="h-14 w-auto"
              />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
