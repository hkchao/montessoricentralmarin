import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { DocButton } from "@/components/admin/DocButton";
import { EditableImage } from "@/components/admin/EditableImage";
import { T } from "@/components/T";
import { curriculum, programs, site } from "@/lib/site";

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
            key: "home.hero.slide1",
            mobileKey: "home.hero.slide1.mobile",
            src: "/images/hero-children-wide.png",
            srcMobile: "/images/hero-children-mobile.png",
            alt: "Three smiling preschoolers leaning on a wooden railing outdoors",
            // Focal: trio of faces in the open right half.
            focal: "72% 40%",
            focalMobile: "50% 28%",
          },
          {
            key: "home.hero.slide2",
            src: "/images/hero-carousel-paint.jpg",
            alt: "A preschooler in a star shirt paints at an outdoor easel",
            // Focal: painting girl's face.
            focal: "32% 38%",
            focalMobile: "35% 32%",
          },
          {
            key: "home.hero.slide3",
            src: "/images/hero-carousel-sandbox.jpg",
            alt: "A toddler plays with toy trucks in an outdoor sandbox",
            // Focal: boy's face above the red fire truck.
            focal: "52% 48%",
            focalMobile: "50% 42%",
          },
          {
            key: "home.hero.slide4",
            src: "/images/hero-carousel-classroom.jpg",
            alt: "A preschooler looks toward the camera while classmates work at wooden tables",
            // Focal: curly-haired girl's eyes.
            focal: "58% 40%",
            focalMobile: "55% 36%",
          },
        ]}
        below={
          <ul className="flex flex-row items-start gap-[41px] sm:gap-[67px] lg:gap-[75px]">
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <EditableImage
                imageKey="brand.bestOfMarin.onDark"
                width={574}
                height={600}
                className="h-16 w-auto sm:h-14 lg:h-16"
              />
              <p className="text-sm font-medium text-balance text-white/65">
                <span className="sm:hidden"><T k="home.badge.best.short" /></span>
                <span className="hidden sm:inline"><T k="home.badge.best.title" /></span>
              </p>
            </li>
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <EditableImage
                imageKey="brand.ams"
                width={512}
                height={512}
                className="size-14 sm:size-12 lg:size-14"
              />
              <p className="text-sm font-medium text-balance text-white/65">
                <span className="sm:hidden"><T k="home.badge.ams.short" /></span>
                <span className="hidden sm:inline"><T k="home.badge.ams.title" /></span>
              </p>
            </li>
            <li className="flex max-w-[7.5rem] flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              <p className="font-display text-[3.5rem] font-semibold leading-none text-white sm:text-[3.25rem] lg:text-[3.5rem]">
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
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="max-w-2xl lg:col-span-6">
            <SectionHeading title={<T k="home.welcome.title" />} />
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
            <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-5">
              {curriculum.map((c) => (
                <li key={c.id}>
                  <p className="font-semibold text-navy"><T k={`curriculum.${c.id}.name`} fallback={c.name} /></p>
                  <p className="mt-1 hidden text-sm leading-relaxed text-muted sm:block">
                    <T k={`curriculum.${c.id}.short`} fallback={c.short} />
                  </p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/programs#curriculum" variant="ghost" className="mt-8">
              <T k="home.curriculum.cta" /> <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section className="!py-10 md:!py-12">
        <aside className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-5 sm:text-left">
          <p className="text-[0.95rem] leading-relaxed text-muted">
            <span className="font-semibold text-navy"><T k="home.calendar.title" /></span>
            <span className="hidden sm:inline"> — </span>
            <span className="block sm:inline"><T k="home.calendar.body" /></span>
          </p>
          <DocButton docKey="calendar" variant="ghost" className="shrink-0 whitespace-nowrap">
            <T k="home.calendar.cta" />
          </DocButton>
        </aside>
      </Section>
    </>
  );
}
