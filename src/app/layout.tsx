import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/caveat";
import "@fontsource-variable/inter";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Yash Gawade — Frontend Developer",
    template: "%s — Yash Gawade",
  },
  description:
    "I design and build thoughtful digital experiences. Frontend and full-stack developer based in Pune, India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
