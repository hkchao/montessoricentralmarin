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
        image={{
          key: "home.hero.desktop",
          mobileKey: "home.hero.mobile",
          src: "/images/hero-children-wide.png",
          // Tighter crop around the three kids for tall phone frames.
          srcMobile: "/images/hero-children-mobile.png",
          alt: "Three smiling preschoolers leaning on a wooden railing outdoors",
          // Desktop: group in the open right half beside the type lockup.
          focal: "72% 40%",
          // Portrait mobile asset already frames the trio — keep centered, faces high.
          focalMobile: "50% 28%",
        }}
        below={
          <ul className="grid gap-6 sm:grid-cols-3 sm:gap-4">
            <li className="flex items-center gap-4">
              <EditableImage
                imageKey="brand.bestOfMarin.onDark"
                width={574}
                height={600}
                className="h-16 w-auto shrink-0 sm:h-14 lg:h-16"
              />
              <div>
                <p className="font-semibold text-white"><T k="home.badge.best.title" /></p>
                <p className="mt-1 text-sm text-white/70"><T k="home.badge.best.body" /></p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <EditableImage
                imageKey="brand.ams"
                width={512}
                height={512}
                className="size-14 shrink-0 sm:size-12 lg:size-14"
              />
              <div>
                <p className="font-semibold text-white"><T k="home.badge.ams.title" /></p>
                <p className="mt-1 text-sm text-white/70">
                  <T k="home.badge.ams.prefix" />{" "}
                  <a
                    href={site.social.ams}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-sun"
                  >
                    <T k="home.badge.ams.link" />
                  </a>
                  .
                </p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <p className="font-display shrink-0 text-[3.5rem] font-semibold leading-none text-white sm:text-[3.25rem] lg:text-[3.5rem]">
                {new Date().getFullYear() - site.founded}
                <span className="text-sun">+</span>
              </p>
              <div>
                <p className="font-semibold text-white"><T k="home.badge.years.title" /></p>
                <p className="mt-1 text-sm text-white/70"><T k="home.badge.years.bodyPrefix" /> {site.founded}.</p>
              </div>
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
