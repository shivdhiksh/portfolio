"use client";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Each line slides up out of its own mask, like the reference's headline reveals.
 * Visibility is observed on the heading, not the lines: the lines start clipped
 * inside their masks, so an observer on them would never see them intersect.
 */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
  as = "h2",
  when,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
  /** When given, the reveal follows this flag instead of scroll position. */
  when?: boolean;
}) {
  const Tag = motion[as];
  const trigger = when === undefined ? { whileInView: "shown", viewport: VIEW } : { animate: when ? "shown" : "hidden" };
  return (
    <Tag
      className={`display ${className}`}
      initial="hidden"
      {...trigger}
      transition={{ delayChildren: delay, staggerChildren: 0.12 }}
    >
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            variants={{ hidden: { y: "112%" }, shown: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade and rise when scrolled into view. */
export function Rv({
  children,
  delay = 0,
  y = 28,
  className,
  style,
  when,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  /** When given, the reveal follows this flag instead of scroll position. */
  when?: boolean;
}) {
  const trigger =
    when === undefined
      ? { whileInView: { opacity: 1, y: 0 }, viewport: VIEW }
      : { animate: when ? { opacity: 1, y: 0 } : { opacity: 0, y } };
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      {...trigger}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SecHead({ num, label, right }: { num: string; label: string; right?: string }) {
  return (
    <Rv className="sec-head" y={10}>
      <span>
        <b>{num}</b> — {label}
      </span>
      <span className="rule" />
      {right && <span className="tail">{right}</span>}
    </Rv>
  );
}
