import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminBar } from "@/components/admin/AdminBar";
import { ContentProvider } from "@/components/admin/ContentProvider";
import { site } from "@/lib/site";
import { getContent } from "@/lib/content";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Bilingual Montessori Preschool in San Rafael, CA`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Bilingual Montessori Preschool in San Rafael`,
    description: site.description,
    images: [{ url: "/images/hero-children-wide.png", width: 1280, height: 720 }],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { content, published, editing } = await getContent();
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col pb-[4.25rem] md:pb-0">
        <ContentProvider content={content} published={published} editing={editing}>
          <AdminBar />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileCtaBar />
          <RevealOnScroll />
          <ScrollToTop />
        </ContentProvider>
      </body>
    </html>
  );
}
