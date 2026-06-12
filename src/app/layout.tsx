import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Studio Figura",
    template: "%s | Studio Figura",
  },
  description:
    "Salony modelowania sylwetki dla kobiet — kosmetologia, fitness i wellness.",
  openGraph: {
    siteName: "Studio Figura",
    locale: "pl_PL",
    type: "website",
    images: [{ url: "/img/studio-figura-login.jpg", width: 1200, height: 800 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={cn("h-full antialiased", plusJakarta.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-screen">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
