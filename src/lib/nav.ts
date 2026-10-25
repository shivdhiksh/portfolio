/** Smooth-scrolls to a chapter by id, landing exactly on its top edge. */
export function goToChapter(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? "auto" : "smooth" });
}
