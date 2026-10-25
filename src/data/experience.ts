export interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    id: "data-annotation-intern",
    title: "Data Annotation Intern",
    organization: "Tao Digital Solutions | Student Tribe",
    location: "Hyderabad",
    period: "March 2026",
    bullets: [
      "Processed and accurately labeled over 4,900 data points (averaging 350 per day) over a two-week period, structuring critical datasets to improve the training efficiency of machine learning models.",
      "Executed rigorous quality assurance checks on an average of 350 daily data inputs, ensuring clean data pipelines for downstream AI processing.",
    ],
  },
  {
    id: "web-development-intern",
    title: "Web Development Intern",
    organization: "Alcronix",
    location: "Remote",
    period: "July 2025 – September 2025",
    bullets: [
      "Assisted in building and optimizing web interfaces using HTML, CSS, JavaScript.",
      "Collaborated remotely to troubleshoot bugs, refine user interface components, and ensure responsive design.",
    ],
  },
];
