import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shiva Dhikshith Koppu | AI Developer & Full Stack Engineer",
  description:
    "Portfolio of Shiva Dhikshith Koppu — AI Developer, Full Stack Engineer, and Machine Learning Enthusiast. Building intelligent systems and scalable web applications.",
  keywords: [
    "Shiva Dhikshith Koppu",
    "AI Developer",
    "Full Stack Developer",
    "Machine Learning",
    "React",
    "Python",
    "Portfolio",
    "Software Engineer",
    "NLP",
  ],
  authors: [{ name: "Shiva Dhikshith Koppu" }],
  creator: "Shiva Dhikshith Koppu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-fawn-six-24.vercel.app",
    siteName: "Shiva Dhikshith Koppu",
    title: "Shiva Dhikshith Koppu | AI Developer & Full Stack Engineer",
    description:
      "Portfolio of Shiva Dhikshith Koppu — AI Developer, Full Stack Engineer, and Machine Learning Enthusiast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiva Dhikshith Koppu | AI Developer & Full Stack Engineer",
    description: "AI Developer, Full Stack Engineer, Machine Learning Enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02040a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
