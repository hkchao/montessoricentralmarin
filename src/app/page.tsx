import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { curriculum, primaryCta, programs, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <PageHero
        size="home"
        kicker="San Rafael, CA"
        title="Montessori for ages 2–6"
        lede="Bilingual English and Spanish. School day, full day, and summer. AMS affiliate since 1974."
        actions={
          <>
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label} <ArrowIcon />
            </ButtonLink>
            <span className="hidden sm:contents">
              <ButtonLink href="/programs" variant="ghost-light" size="lg">
                View programs
              </ButtonLink>
            </span>
          </>
        }
        image={{
          src: "/images/hero-children-wide.png",
          alt: "Three smiling preschoolers leaning on a wooden railing outdoors",
          focal: "66% 42%",
        }}
      />

      <Section tone="white">
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="flex items-center gap-4 rounded-2xl border border-line bg-cream p-5">
            <Image
              src="/brand/best-of-marin-2026.png"
              alt=""
              width={624}
              height={784}
              className="h-16 w-auto shrink-0 sm:h-14 lg:h-16"
            />
            <div>
              <p className="font-semibold text-navy">Best of Marin 2026</p>
              <p className="mt-1 text-sm text-muted">Voted by Pacific Sun readers.</p>
            </div>
          </li>
          <li className="flex items-center gap-4 rounded-2xl border border-line bg-cream p-5">
            <Image
              src="/brand/ams-logo.jpg"
              alt=""
              width={1517}
              height={308}
              className="h-8 w-auto shrink-0 lg:h-9"
            />
            <div>
              <p className="font-semibold text-navy">AMS affiliate</p>
              <p className="mt-1 text-sm text-muted">
                Member of the{" "}
                <a
                  href={site.social.ams}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-navy"
                >
                  American Montessori Society
                </a>
                .
              </p>
            </div>
          </li>
          <li className="flex items-center gap-4 rounded-2xl border border-line bg-cream p-5">
            <p className="font-display shrink-0 text-4xl font-semibold leading-none text-navy">
              {new Date().getFullYear() - site.founded}
              <span className="text-sun">+</span>
            </p>
            <div>
              <p className="font-semibold text-navy">Years in San Rafael</p>
              <p className="mt-1 text-sm text-muted">Since {site.founded}.</p>
            </div>
          </li>
        </ul>

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="max-w-2xl lg:col-span-6">
            <SectionHeading kicker="Welcome" title="Who we are" />
            <div className="prose-school mt-6 text-[1.0625rem] text-ink/85">
              <p>
                We follow Dr. Maria Montessori and are an affiliate of the American
                Montessori Society. Children learn in English and Spanish every day. The
                full Montessori curriculum is paired with music, yoga, cooking, gardening,
                dance, art, monthly field trips, and families from many cultures.
              </p>
            </div>
            <ButtonLink href="/about" variant="link" className="mt-6 font-semibold">
              About our school <ArrowIcon />
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6">
            <Image
              src="/images/gallery-guide-and-child.jpg"
              alt="A teacher guides a child through a tray activity"
              fill
              quality={90}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section id="programs">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="Programs"
            title="Hours and days"
            lede="School day, full day, partial week, or summer. Same curriculum in every schedule."
          />
          <ButtonLink href="/programs" variant="ghost" className="shrink-0">
            All programs <ArrowIcon />
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <li key={p.id}>
              <Link
                href={`/programs#${p.id}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <p className="kicker text-sun-deep">{p.hours}</p>
                <h3 className="font-display mt-3 text-2xl font-medium text-navy">{p.name}</h3>
                <p className="mt-3 hidden flex-1 text-[0.95rem] leading-relaxed text-muted sm:block">
                  {p.summary}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy sm:mt-5">
                  Details{" "}
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="curriculum">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6 lg:aspect-[5/4]">
            <Image
              src="/images/gallery-child-writing.jpg"
              alt="A child writes carefully with a red pencil"
              fill
              quality={90}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <SectionHeading
              kicker="Curriculum"
              title="What children learn"
              lede="Practical Life, Sensorial, Math, Language, Spanish, and Cultural Studies."
            />
            <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-5">
              {curriculum.map((c) => (
                <li key={c.id}>
                  <Link href={`/curriculum#${c.id}`} className="group block">
                    <p className="font-semibold text-navy underline-offset-4 group-hover:underline">
                      {c.name}
                    </p>
                    <p className="mt-1 hidden text-sm leading-relaxed text-muted sm:block">
                      {c.short}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/programs#day" variant="ghost" className="mt-8">
              See how the day works <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
