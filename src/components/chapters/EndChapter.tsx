"use client";
import { Rv } from "@/components/ui/Reveal";

/**
 * A mostly empty closing screen. The 3D background turns into a humanoid hologram here,
 * so this section keeps the middle clear and only carries a short sign-off at the bottom.
 */
export default function EndChapter() {
  return (
    <section className="end-chapter" id="end" aria-label="Thanks for visiting">
      <Rv>
        <p className="end-note">Thanks for stopping by.</p>
        <p className="end-sub">Shiva Dhikshith Koppu · AI Developer &amp; Full Stack Engineer</p>
      </Rv>
    </section>
  );
}
