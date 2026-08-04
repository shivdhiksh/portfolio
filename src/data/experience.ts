export interface Experience {
  id: string;
  type: "internship" | "freelance" | "hackathon" | "training" | "certification";
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  icon: string;
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    type: "internship",
    title: "AI/ML Developer Intern",
    organization: "Tech Startup",
    period: "2024 – Present",
    description:
      "Developing and deploying machine learning models for real-world business problems. Working on NLP pipelines, model optimization, and full-stack AI product development.",
    skills: ["Python", "TensorFlow", "FastAPI", "React", "Docker"],
    icon: "Briefcase",
  },
  {
    id: "exp-2",
    type: "freelance",
    title: "Freelance Full Stack Developer",
    organization: "Independent",
    period: "2023 – Present",
    description:
      "Building custom web applications and AI-powered tools for clients. Delivered multiple production-grade projects with modern tech stacks.",
    skills: ["React", "Node.js", "MongoDB", "Python", "AWS"],
    icon: "Laptop",
  },
  {
    id: "exp-3",
    type: "hackathon",
    title: "National Hackathon Participant",
    organization: "Multiple Events",
    period: "2023 – 2024",
    description:
      "Participated in multiple national-level hackathons, building innovative solutions under time pressure. Achieved recognition for technical excellence and creative problem-solving.",
    skills: ["Rapid Prototyping", "Team Collaboration", "Problem Solving"],
    icon: "Zap",
  },
  {
    id: "exp-4",
    type: "training",
    title: "AI/ML Specialization Training",
    organization: "Online Learning Platform",
    period: "2023",
    description:
      "Completed comprehensive training in machine learning, deep learning, and AI application development. Built end-to-end ML pipelines and deployed production models.",
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow", "PyTorch"],
    icon: "BookOpen",
  },
  {
    id: "exp-5",
    type: "certification",
    title: "Full Stack Web Development Certification",
    organization: "Certification Authority",
    period: "2022",
    description:
      "Earned certification in modern full-stack development covering React, Node.js, databases, and cloud deployment. Built multiple production projects as part of the curriculum.",
    skills: ["React", "Node.js", "MongoDB", "REST APIs", "JWT"],
    icon: "Award",
  },
];
