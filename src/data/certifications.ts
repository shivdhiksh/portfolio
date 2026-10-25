export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export const certifications: Certification[] = [
  {
    id: "data-annotation",
    title: "Certificate of Completion in Data Annotation",
    issuer: "Student Tribe",
    date: "March 2026",
  },
  {
    id: "python-fundamentals",
    title: "Programming Fundamentals using Python (Part 1 & 2)",
    issuer: "Infosys Springboard",
    date: "April 2026",
  },
  {
    id: "intro-data-science",
    title: "Introduction to Data Science",
    issuer: "Infosys Springboard",
    date: "April 2026",
  },
  {
    id: "web-dev-internship",
    title: "Certificate of Internship Completion (Web Development)",
    issuer: "Alcronix",
    date: "September 2025",
  },
];
