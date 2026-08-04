"use client";
import Link from "next/link";
import Image from "next/image";
import "../../app/globals.css";


export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f1f5f9;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }

        .page-wrapper {
          min-height: 100vh;
          padding: 2rem 1rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f1f5f9;
        }

        /* Top action bar */
        .action-bar {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.4rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-blue {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 15px rgba(59,130,246,0.3);
        }
        .btn-blue:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
        .btn-outline {
          background: white;
          color: #475569;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .btn-outline:hover { border-color: #3b82f6; color: #3b82f6; transform: translateY(-1px); }

        /* Resume card */
        .resume {
          width: 100%;
          max-width: 820px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          overflow: hidden;
        }

        /* Header */
        .resume-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          padding: 2.5rem 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .resume-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(59,130,246,0.15), transparent 60%),
                      radial-gradient(circle at 70% 50%, rgba(139,92,246,0.15), transparent 60%);
          pointer-events: none;
        }
        .resume-header h1 {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: white;
          margin-bottom: 0.4rem;
          position: relative;
        }
        .resume-header .role {
          font-size: 0.85rem;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          position: relative;
        }
        .contact-row {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          position: relative;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-item:hover { color: #3b82f6; }
        .contact-item svg { flex-shrink: 0; }

        /* Body */
        .resume-body {
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* Section */
        .section-title {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-title::after {
          content: '';
          flex: 1;
          height: 1.5px;
          background: linear-gradient(to right, #e2e8f0, transparent);
          border-radius: 9999px;
        }

        /* Profile */
        .profile-text {
          font-size: 0.88rem;
          line-height: 1.75;
          color: #475569;
        }

        /* Education */
        .edu-item {
          margin-bottom: 0.75rem;
        }
        .edu-item:last-child { margin-bottom: 0; }
        .edu-degree {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }
        .edu-school {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.15rem;
        }
        .edu-year {
          font-size: 0.75rem;
          color: #3b82f6;
          font-weight: 600;
          margin-top: 0.1rem;
        }

        /* Skills */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }
        .skill-row {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.82rem;
          line-height: 1.5;
        }
        .skill-label {
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .skill-value {
          color: #475569;
        }

        /* Projects */
        .project-item {
          margin-bottom: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          background: #f8fafc;
          border-left: 3px solid #3b82f6;
        }
        .project-item:last-child { margin-bottom: 0; }
        .project-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .project-tech {
          font-size: 0.72rem;
          color: #3b82f6;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .project-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .project-bullets li {
          font-size: 0.8rem;
          color: #475569;
          display: flex;
          gap: 0.4rem;
          line-height: 1.5;
        }
        .project-bullets li::before {
          content: '▸';
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }

        /* Experience */
        .exp-item {
          margin-bottom: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          background: #f8fafc;
          border-left: 3px solid #8b5cf6;
        }
        .exp-item:last-child { margin-bottom: 0; }
        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .exp-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }
        .exp-date {
          font-size: 0.72rem;
          font-weight: 600;
          color: #8b5cf6;
          white-space: nowrap;
        }
        .exp-company {
          font-size: 0.78rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        /* Certifications */
        .cert-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #475569;
          padding: 0.4rem 0;
          border-bottom: 1px solid #f1f5f9;
          line-height: 1.5;
        }
        .cert-item:last-child { border-bottom: none; }
        .cert-item::before {
          content: '✦';
          color: #06b6d4;
          flex-shrink: 0;
          font-size: 0.65rem;
          margin-top: 0.2rem;
        }
        .cert-item strong {
          color: #0f172a;
          font-weight: 600;
        }

        /* Additional */
        .add-row {
          display: flex;
          gap: 0.4rem;
          font-size: 0.82rem;
          margin-bottom: 0.3rem;
          color: #475569;
        }
        .add-row strong {
          color: #0f172a;
          font-weight: 700;
        }

        /* ── Print Styles ── */
        @media print {
          @page { margin: 0.5in; size: A4; }
          body { background: white !important; }
          .page-wrapper { padding: 0; background: white; }
          .action-bar { display: none !important; }
          .resume {
            box-shadow: none;
            border-radius: 0;
            max-width: 100%;
          }
          .resume-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .project-item, .exp-item { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a { color: inherit !important; }
        }

        @media (max-width: 640px) {
          .resume-header { padding: 1.5rem 1.25rem; }
          .resume-header h1 { font-size: 1.5rem; }
          .resume-body { padding: 1.25rem; }
          .skills-grid { grid-template-columns: 1fr; }
          .exp-header { flex-direction: column; }
        }
      `}</style>

      <div className="page-wrapper">
        {/* Action Bar */}
        <div className="action-bar">
          <Link href="/" className="btn btn-outline">
            ← Back to Portfolio
          </Link>
          <button className="btn btn-blue" onClick={() => window.print()}>
            ⬇ Download / Print PDF
          </button>
        </div>

        <div className="resume">
          {/* ── HEADER ── */}
          <div className="resume-header">
            {/* Profile photo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", position: "relative", zIndex: 1 }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(59,130,246,0.5)", boxShadow: "0 0 25px rgba(59,130,246,0.4)" }}>
                <Image src="/profile.jpg" alt="Shiva Dhikshith Koppu" width={90} height={90} style={{ objectFit: "cover", objectPosition: "top", width: "100%", height: "100%" }} priority />
              </div>
            </div>
            <h1>SHIVA DHIKSHITH KOPPU</h1>
            <p className="role">AI Developer · Full Stack Developer · CSE (Data Science)</p>
            <div className="contact-row">
              <span className="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91 7671041994
              </span>
              <a href="mailto:koppu.shivadhikshith@gmail.com" className="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                koppu.shivadhikshith@gmail.com
              </a>
              <a href="https://linkedin.com/in/shivdhiksh" target="_blank" rel="noreferrer" className="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                linkedin.com/in/shivdhiksh
              </a>
              <a href="https://github.com/shivdhiksh" target="_blank" rel="noreferrer" className="contact-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                github.com/shivdhiksh
              </a>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="resume-body">

            {/* Profile */}
            <section>
              <div className="section-title">Profile</div>
              <p className="profile-text">
                Computer Science (Data Science) student specializing in Artificial Intelligence, Machine Learning, and Full-Stack
                Development. Experienced in building intelligent applications using Python, Django, NLP, and modern web technologies.
                Strong problem-solving skills with hands-on experience delivering collaborative projects in hackathons and internships,
                and enthusiastic about creating scalable AI-powered solutions.
              </p>
            </section>

            {/* Education */}
            <section>
              <div className="section-title">Education</div>
              <div className="edu-item">
                <div className="edu-degree">Bachelor of Technology (B.Tech) in Computer Science and Engineering (Data Science)</div>
                <div className="edu-school">Kommuri Pratap Reddy Institute of Technology (KPRIT), Hyderabad</div>
                <div className="edu-year">Expected Graduation: May 2027</div>
              </div>
              <div className="edu-item">
                <div className="edu-degree">Intermediate (Class 12) in MPC</div>
                <div className="edu-school">Sri Chaitanya Junior Kalasala, Bagh Amberpet, Hyderabad</div>
                <div className="edu-year">Board of Intermediate Education Telangana | 2023</div>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <div className="section-title">Technical Skills</div>
              <div className="skills-grid">
                <div className="skill-row">
                  <span className="skill-label">Languages:</span>
                  <span className="skill-value">Python, C, JavaScript, HTML, CSS</span>
                </div>
                <div className="skill-row">
                  <span className="skill-label">Web:</span>
                  <span className="skill-value">React.js, Node.js, Express.js</span>
                </div>
                <div className="skill-row">
                  <span className="skill-label">Databases:</span>
                  <span className="skill-value">MongoDB</span>
                </div>
                <div className="skill-row">
                  <span className="skill-label">Tools:</span>
                  <span className="skill-value">DSA, Git, VS Code, Docker</span>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section>
              <div className="section-title">Projects</div>

              <div className="project-item">
                <div className="project-title">ValMentor AI – AI Career &amp; Interview Mentor</div>
                <div className="project-tech">Python · Django · Django REST Framework · Docker · Celery</div>
                <ul className="project-bullets">
                  <li>Built an AI-powered career mentoring platform during a hackathon in a 2-member team.</li>
                  <li>Developed modules for AI mock interviews, personalized roadmaps, resume ATS analysis, and career guidance.</li>
                  <li>Containerized the application using Docker and optimized background processing with Celery.</li>
                </ul>
              </div>

              <div className="project-item">
                <div className="project-title">Spidy – AI Desktop Assistant (Personal Project)</div>
                <div className="project-tech">Python · Ollama (Llama 3.2) · AsyncIO · ChromaDB · SQLite · Git</div>
                <ul className="project-bullets">
                  <li>Designed and developed a modular AI desktop assistant capable of understanding natural language commands and automating desktop and browser tasks.</li>
                  <li>Built desktop automation features to launch applications, search files, control browsers, and manage system operations through intelligent skills.</li>
                </ul>
              </div>

              <div className="project-item">
                <div className="project-title">Sentiment Classification of Large-Scale Twitter Data</div>
                <div className="project-tech">Python · Pandas · NLTK</div>
                <ul className="project-bullets">
                  <li>Analyzed a large-scale dataset of Twitter data to classify public sentiment as positive, negative, or neutral.</li>
                  <li>Preprocessed raw text data by tokenizing, removing stop words, and cleaning noise to optimize model performance.</li>
                </ul>
              </div>
            </section>

            {/* Work Experience */}
            <section>
              <div className="section-title">Work Experience</div>

              <div className="exp-item">
                <div className="exp-header">
                  <span className="exp-title">Data Annotation Intern</span>
                  <span className="exp-date">March 2026</span>
                </div>
                <div className="exp-company">Tao Digital Solutions · Student Tribe, Hyderabad</div>
                <ul className="project-bullets">
                  <li>Processed, labeled, and organized datasets to support the training and accuracy of machine learning models.</li>
                  <li>Maintained strict quality assurance standards while reviewing data inputs to ensure clean data pipelines.</li>
                </ul>
              </div>

              <div className="exp-item">
                <div className="exp-header">
                  <span className="exp-title">Web Development Intern</span>
                  <span className="exp-date">Jul 2025 – Sep 2025</span>
                </div>
                <div className="exp-company">Alcronix · Remote</div>
                <ul className="project-bullets">
                  <li>Assisted in building and optimizing web interfaces using HTML, CSS, JavaScript.</li>
                  <li>Collaborated remotely to troubleshoot bugs, refine UI components, and ensure responsive design.</li>
                </ul>
              </div>
            </section>

            {/* Certifications */}
            <section>
              <div className="section-title">Certifications</div>
              <div className="cert-item">
                <span><strong>Certificate of Completion in Data Annotation</strong>, Student Tribe – March 2026</span>
              </div>
              <div className="cert-item">
                <span><strong>Programming Fundamentals using Python (Part 1 &amp; 2)</strong>, Infosys Springboard – April 2026</span>
              </div>
              <div className="cert-item">
                <span><strong>Introduction to Data Science</strong>, Infosys Springboard – April 2026</span>
              </div>
              <div className="cert-item">
                <span><strong>Certificate of Internship Completion (Web Development)</strong>, Alcronix – September 2025</span>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <div className="section-title">Additional Information</div>
              <div className="add-row"><strong>Languages:</strong> English (Fluent), Telugu (Native), Hindi (Fluent)</div>
              <div className="add-row"><strong>Interests:</strong> PC Gaming, 2D/3D Game Development</div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
