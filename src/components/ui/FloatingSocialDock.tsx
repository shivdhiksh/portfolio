"use client";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { motion } from "framer-motion";

const links = [
  {
    icon: GithubIcon,
    href: "https://github.com/shivdhiksh",
    label: "GitHub",
    color: "#94a3b8",
  },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/shivdhiksh",
    label: "LinkedIn",
    color: "#0077b5",
  },
  {
    icon: Mail,
    href: "mailto:koppu.shivadhikshith@gmail.com",
    label: "Email",
    color: "#ef4444",
  },
];

export default function FloatingSocialDock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      style={{
        position: "fixed",
        right: "1.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
      className="hidden md:flex"
    >
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 + i * 0.1 }}
          whileHover={{ scale: 1.2, x: -4 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
            transition: "color 0.2s, border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = link.color;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = link.color;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 15px ${link.color}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          <link.icon size={16} />
        </motion.a>
      ))}

      {/* Decorative line */}
      <div
        style={{
          width: 1,
          height: 60,
          margin: "0 auto",
          background: "linear-gradient(to bottom, var(--accent-blue), transparent)",
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}
