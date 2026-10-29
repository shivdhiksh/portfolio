"use client";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import ProgressRail from "@/components/layout/ProgressRail";
import Footer from "@/components/layout/Footer";
import HeroChapter from "@/components/chapters/HeroChapter";
import IdentityChapter from "@/components/chapters/IdentityChapter";
import CapabilitiesChapter from "@/components/chapters/CapabilitiesChapter";
import MissionsChapter from "@/components/chapters/MissionsChapter";
import JourneyChapter from "@/components/chapters/JourneyChapter";
import SignalChapter from "@/components/chapters/SignalChapter";
import ContactChapter from "@/components/chapters/ContactChapter";
import EndChapter from "@/components/chapters/EndChapter";

// Both read window/scroll geometry on mount, so they only render on the client.
const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), { ssr: false });
const SpidyAssistant = dynamic(() => import("@/components/ui/SpidyAssistant"), { ssr: false });
const SpidyHUD = dynamic(() => import("@/components/ui/SpidyHUD"), { ssr: false });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <WorldCanvas />
      <ScrollProgress />
      <Navbar />
      <ProgressRail />
      <SpidyHUD />
      <SpidyAssistant />
      <main className="site-main">
        <HeroChapter />
        <IdentityChapter />
        <CapabilitiesChapter />
        <MissionsChapter />
        <JourneyChapter />
        <SignalChapter />
        <ContactChapter />
        <EndChapter />
      </main>
      <Footer />
    </>
  );
}
