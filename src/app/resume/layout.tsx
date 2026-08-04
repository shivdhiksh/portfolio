import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — Shiva Dhikshith Koppu",
  description:
    "Resume of Shiva Dhikshith Koppu — AI Developer, Full Stack Developer, CS (Data Science) student at KPRIT.",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
