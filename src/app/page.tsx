import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { DocButton } from "@/components/admin/DocButton";
import { EditableImage } from "@/components/admin/EditableImage";
import { T } from "@/components/T";
import { programs, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <PageHero
        size="home"
        title={<T k="home.hero.title" />}
        lede={
          <T k="home.hero.lede" multiline />
        }
        images={[
          {
            key: "home.hero.slide1.vivid",
            mobileKey: "home.hero.slide1.mobile.vivid",
            src: "/images/hero-children-wide-vivid.jpg",
            srcMobile: "/images/hero-children-mobile-vivid.jpg",
            alt: "Three smiling preschoolers leaning on a wooden railing outdoors",
            // Focal: trio of faces in the open right half.
            focal: "72% 40%",
            focalMobile: "50% 28%",
          },
          {
            key: "home.hero.slide.paint",
            mobileKey: "home.hero.slide.paint.mobile",
            src: "/images/hero-carousel-paint-ext.jpg",
            srcMobile: "/images/hero-carousel-paint-mobile-v4.jpg",
            alt: "A preschooler in a star shirt paints at an outdoor easel",
            // Focal: painting girl's face; mobile portrait pins her head in the clear top band.
            focal: "72% 42%",
            focalMobile: "50% 0%",
          },
          {
            key: "home.hero.slide.sandbox.desktop.smile",
            mobileKey: "home.hero.slide.sandbox.mobile.smile",
            src: "/images/hero-carousel-sandbox-desktop-smile.jpg",
            srcMobile: "/images/hero-carousel-sandbox-mobile-smile-v4.jpg",
            alt: "A smiling toddler plays with toy trucks in an outdoor sandbox",
            // Desktop: boy in open right half; mobile portrait pins his head in the clear top band.
            focal: "67% 48%",
            focalMobile: "50% 0%",
          },
          {
            key: "home.hero.slide.classroom.seamless",
            mobileKey: "home.hero.slide.classroom.mobile",
            src: "/images/hero-carousel-classroom-seamless.jpg",
            srcMobile: "/images/hero-carousel-classroom-mobile-v3.jpg",
            alt: "A preschooler looks toward the camera while classmates work at wooden tables",
            // Focal: curly-haired girl's eyes; mobile portrait pins her head in the clear top band.
            focal: "74% 42%",
            focalMobile: "50% 12%",
          },
        ]}
        below={
          <ul className="flex flex-row items-start gap-[41px] sm:gap-[57px] lg:gap-[75px]">
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <EditableImage
                imageKey="brand.bestOfMarin.onDark"
                width={574}
                height={600}
                className="h-14 w-auto [filter:drop-shadow(0_2px_8px_rgb(2_10_38/1))] sm:h-12 lg:h-14"
              />
              <p className="text-sm font-medium text-balance text-white/65">
                <span className="sm:hidden"><T k="home.badge.best.short" /></span>
                <span className="hidden sm:inline"><T k="home.badge.best.title" /></span>
              </p>
            </li>
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <EditableImage
                imageKey="brand.ams.bright"
                width={512}
                height={512}
                className="size-14 [filter:drop-shadow(0_2px_8px_rgb(2_10_38/1))] sm:size-12 lg:size-14"
              />
              <p className="text-sm font-medium text-balance text-white/65">
                <span className="sm:hidden"><T k="home.badge.ams.short" /></span>
                <span className="hidden sm:inline"><T k="home.badge.ams.title" /></span>
              </p>
            </li>
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <p className="font-display text-[3.5rem] font-semibold leading-none text-white [text-shadow:0_2px_10px_rgb(2_10_38/0.55)] sm:text-[3.25rem] lg:text-[3.5rem]">
                {new Date().getFullYear() - site.founded}
                <span className="text-sun">+</span>
              </p>
              <p className="text-sm font-medium text-balance text-white/65">
                <span className="sm:hidden"><T k="home.badge.years.short" /></span>
                <span className="hidden sm:inline"><T k="home.badge.years.title" /></span>
              </p>
            </li>
          </ul>
        }
      />

      <Section tone="white">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="max-w-2xl lg:col-span-6">
            <SectionHeading title={<T k="home.welcome.title" />} className="[&>h2]:mt-0" />
            <div className="prose-school mt-6 text-[1.0625rem] text-ink/85">
              <p>
                <T k="home.welcome.body" />
              </p>
            </div>
            <ButtonLink href="/about" variant="link" className="mt-6 font-semibold">
              <T k="home.welcome.cta" /> <ArrowIcon />
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6">
            <EditableImage
              imageKey="home.welcome"
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
            title={<T k="home.programs.title" />}
            lede={<T k="home.programs.lede" />}
          />
          <ButtonLink href="/programs" variant="ghost" className="shrink-0">
            <T k="home.programs.cta" /> <ArrowIcon />
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <li key={p.id}>
              <Link
                href={`/programs#${p.id}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <p className="kicker text-sun-deep"><T k={`program.${p.id}.hours`} fallback={p.hours} /></p>
                <h3 className="font-display mt-3 text-2xl font-medium text-navy"><T k={`program.${p.id}.name`} fallback={p.name} /></h3>
                <p className="mt-3 hidden flex-1 text-[0.95rem] leading-relaxed text-muted sm:block">
                  <T k={`program.${p.id}.summary`} fallback={p.summary} />
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy sm:mt-5">
                  <T k="home.programs.detail" fallback="Details" />{" "}
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
            <EditableImage
              imageKey="home.curriculum"
              fill
              quality={90}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <SectionHeading
              title={<T k="home.curriculum.title" />}
              lede={<T k="home.curriculum.lede" />}
            />
            <ButtonLink href="/programs#curriculum" variant="ghost" className="mt-8">
              <T k="home.curriculum.cta" /> <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section className="!py-10 md:!py-12">
        <aside className="mx-auto grid max-w-4xl items-center justify-items-center gap-5 text-center sm:grid-cols-[auto_1fr_auto] sm:justify-items-start sm:gap-6 sm:text-left">
          <div
            aria-hidden="true"
            className="flex size-20 shrink-0 items-center justify-center text-navy"
          >
            {/* Adapted from Lucide's ISC-licensed Calendar Days icon. */}
            <svg
              viewBox="0 0 24 24"
              className="size-[4.5rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4Z" fill="var(--color-sun)" stroke="none" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 2v3M16 2v3M3 9h18" />
              <g fill="currentColor" stroke="none">
                <circle cx="8" cy="13" r="0.7" />
                <circle cx="12" cy="13" r="0.7" />
                <circle cx="16" cy="13" r="0.7" />
                <circle cx="8" cy="17" r="0.7" />
                <circle cx="12" cy="17" r="0.7" />
                <circle cx="16" cy="17" r="0.7" />
              </g>
            </svg>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-muted">
            <span className="block font-display text-xl font-medium text-navy"><T k="home.calendar.title" /></span>
            <span className="mt-1 block"><T k="home.calendar.body" /></span>
          </p>
          <DocButton docKey="calendar" variant="primary" size="lg" className="shrink-0 whitespace-nowrap">
            <T k="home.calendar.cta" />
          </DocButton>
        </aside>
      </Section>
    </>
  );
}
