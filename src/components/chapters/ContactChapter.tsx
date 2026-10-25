"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";

const EMAIL = "koppu.shivadhikshith@gmail.com";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

const LINKS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail },
  { label: "GitHub", value: "github.com/shivdhiksh", href: "https://github.com/shivdhiksh", icon: GithubIcon },
  { label: "LinkedIn", value: "linkedin.com/in/shivdhiksh", href: "https://linkedin.com/in/shivdhiksh", icon: LinkedinIcon },
];

export default function ContactChapter() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // There is no mail backend, so hand the message to the visitor's own email app.
  const onSubmit = (d: FormData) => {
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    window.open(`mailto:${EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`, "_self");
    setSent(true);
    reset();
  };

  return (
    <section className="chapter" id="contact">
      <div className="ghost-num" aria-hidden>06</div>
      <div className="chapter-inner">
        <SecHead num="06" label="Contact" right="Open to work" />
        <MaskLines className="h-sec" lines={["Let's build something", <>that <em>thinks.</em></>]} />
        <Rv delay={0.2} className="text-card" style={{ maxWidth: "36rem", marginTop: "1.6rem" }}>
          <p className="lead">
            Open to AI/ML and full-stack roles, collaborations, or just a conversation about what&apos;s next.
          </p>
        </Rv>

        <div className="contact-grid">
          <Rv>
            {LINKS.map((l) => (
              <a
                key={l.label}
                className="contact-link"
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <l.icon size={18} />
                  <span>
                    <small>{l.label}</small>
                    {l.value}
                  </span>
                </span>
                <ArrowUpRight size={16} />
              </a>
            ))}
            <div className="contact-link" style={{ cursor: "default" }}>
              <span>
                <small>Location</small>India
              </span>
            </div>
          </Rv>

          <Rv delay={0.1}>
            <form className="panel" style={{ padding: "clamp(1.2rem,3vw,2.2rem)" }} onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="field">
                <span>Name</span>
                <input {...register("name")} autoComplete="name" />
                {errors.name && <em>{errors.name.message}</em>}
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" {...register("email")} autoComplete="email" />
                {errors.email && <em>{errors.email.message}</em>}
              </label>
              <label className="field">
                <span>Subject</span>
                <input {...register("subject")} />
                {errors.subject && <em>{errors.subject.message}</em>}
              </label>
              <label className="field">
                <span>Message</span>
                <textarea rows={4} {...register("message")} />
                {errors.message && <em>{errors.message.message}</em>}
              </label>
              <button className="btn-line solid" type="submit">
                Send via email <ArrowUpRight size={14} />
              </button>
              {sent && (
                <p className="mono" style={{ marginTop: "1rem", fontSize: "0.74rem", color: "var(--cyan)" }}>
                  Opening your email app with the message ready to send…
                </p>
              )}
            </form>
          </Rv>
        </div>
      </div>
    </section>
  );
}
