import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/caveat";
import "@fontsource-variable/inter";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { RevealController } from "@/components/reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeScript } from "@/lib/theme";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <MotionProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <RevealController />
        </MotionProvider>
      </body>
    </html>
  );
}
