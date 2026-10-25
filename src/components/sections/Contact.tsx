"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

type Toast = { type: "success" | "error"; message: string } | null;

export default function Contact() {
  const [toast, setToast] = useState<Toast>(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call (replace with EmailJS in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      reset();
      showToast("success", "Message sent successfully! I'll get back to you soon. 🚀");
    } catch {
      showToast("error", "Failed to send message. Please try again or email me directly.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    borderRadius: 12,
    background: "var(--bg-tertiary)",
    border: "1px solid var(--glass-border)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  };

  return (
    <section id="contact" style={{ background: "var(--section-scrim)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <Mail size={12} />
            Get In Touch
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Whether it&apos;s a job opportunity, a collaboration, or just a chat about AI — I&apos;m always open to connecting.
          </p>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem", alignItems: "start" }}
          className="contact-grid"
        >
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Open to Opportunities
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>
                I&apos;m actively looking for AI/ML and Full Stack roles. If you think I could be a good fit for your team, let&apos;s talk!
              </p>
            </div>

            {/* Contact info cards */}
            {[
              { icon: Mail, label: "Email", value: "koppu.shivadhikshith@gmail.com", href: "mailto:koppu.shivadhikshith@gmail.com", color: "#ef4444" },
              { icon: GithubIcon, label: "GitHub", value: "github.com/shivdhiksh", href: "https://github.com/shivdhiksh", color: "#94a3b8" },
              { icon: LinkedinIcon, label: "LinkedIn", value: "linkedin.com/in/shivdhiksh", href: "https://linkedin.com/in/shivdhiksh", color: "#0077b5" },
              { icon: MapPin, label: "Location", value: "India", href: "#", color: "#22c55e" },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: 14,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${item.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--glass-border)")}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <item.icon size={16} color={item.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>{item.value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              style={{
                padding: "2rem",
                borderRadius: 24,
                background: "var(--glass-bg)",
                backdropFilter: "blur(30px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.2)",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Name *
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Your name"
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--accent-blue)"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--glass-border)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
                    />
                    {errors.name && <p style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: "0.25rem" }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--accent-blue)"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--glass-border)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
                    />
                    {errors.email && <p style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: "0.25rem" }}>{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Subject *
                  </label>
                  <input
                    {...register("subject")}
                    placeholder="What's it about?"
                    style={inputStyle}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--accent-blue)"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--glass-border)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
                  />
                  {errors.subject && <p style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: "0.25rem" }}>{errors.subject.message}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Message *
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                    onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent-blue)"; (e.target as HTMLTextAreaElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                    onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--glass-border)"; (e.target as HTMLTextAreaElement).style.boxShadow = "none"; }}
                  />
                  {errors.message && <p style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: "0.25rem" }}>{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ justifyContent: "center", opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              padding: "1rem 1.5rem",
              borderRadius: 14,
              background: toast.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 600,
              maxWidth: "90vw",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} color="#22c55e" />
            ) : (
              <XCircle size={18} color="#ef4444" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .contact-grid {
          grid-template-columns: 1fr 1.2fr;
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
