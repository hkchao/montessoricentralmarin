import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { primaryCta, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-deep text-white">
      <div className="site-wrap py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo tone="light" compact />
          </div>

          <div className="lg:col-span-4">
            <p className="kicker text-sun">Tour</p>
            <h2 className="font-display mt-3 text-2xl font-medium leading-[1.1] text-balance sm:text-[1.75rem]">
              Schedule a tour
            </h2>
            <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-white/70">
              By appointment — send a request and we&rsquo;ll confirm a time.
            </p>
            <ButtonLink href={primaryCta.href} size="lg" className="mt-5">
              {primaryCta.label} <ArrowIcon />
            </ButtonLink>
          </div>

          <div className="lg:col-span-4">
            <h2 className="kicker text-sun">Contact</h2>
            <address className="mt-4 space-y-2.5 text-[0.95rem] not-italic leading-relaxed text-white/80">
              <p>
                <a
                  href={site.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </a>
              </p>
              <p>
                <a href={site.phoneHref} className="transition-colors hover:text-white">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </p>
              <p className="text-white/55">{site.hours}</p>
            </address>
            <SocialLinks className="mt-5 flex items-center gap-1" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-wrap flex flex-col gap-1 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            AMS affiliate · Est. {site.founded} · Bilingual Montessori
          </p>
        </div>
      </div>
    </footer>
  );
}
