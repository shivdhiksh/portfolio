import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    "Computer Vision",
  ],
  authors: [{ name: "Shiva Dhikshith Koppu" }],
  creator: "Shiva Dhikshith Koppu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shivadhikshith.dev",
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  var theme = stored || preferred;
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
