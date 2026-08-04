export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  year: string;
  category: "hackathon" | "coding" | "certificate" | "open-source" | "award";
}

export const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Hackathon Excellence Award",
    description: "Recognized for building an innovative AI solution at a national-level hackathon within 24 hours.",
    icon: "Trophy",
    color: "from-yellow-400 to-orange-500",
    year: "2024",
    category: "hackathon",
  },
  {
    id: "ach-2",
    title: "Top Coder – Competitive Programming",
    description: "Ranked in the top percentile in competitive programming contests on platforms like LeetCode and HackerRank.",
    icon: "Code2",
    color: "from-blue-400 to-cyan-500",
    year: "2023",
    category: "coding",
  },
  {
    id: "ach-3",
    title: "AI/ML Certification",
    description: "Completed advanced AI/ML certification demonstrating expertise in machine learning and deep learning frameworks.",
    icon: "Award",
    color: "from-purple-400 to-pink-500",
    year: "2023",
    category: "certificate",
  },
  {
    id: "ach-4",
    title: "Open Source Contributor",
    description: "Active contributor to open-source AI/ML projects with multiple accepted pull requests in community repositories.",
    icon: "GitBranch",
    color: "from-green-400 to-emerald-500",
    year: "2023 – Present",
    category: "open-source",
  },
  {
    id: "ach-5",
    title: "Best Innovation Award",
    description: "Won Best Innovation Award for an AI-based solution that addressed a real-world challenge at a startup competition.",
    icon: "Star",
    color: "from-red-400 to-rose-500",
    year: "2024",
    category: "award",
  },
  {
    id: "ach-6",
    title: "GitHub 100+ Stars",
    description: "Maintained open-source repositories that collectively earned 100+ stars from the developer community.",
    icon: "Github",
    color: "from-slate-400 to-gray-500",
    year: "2024",
    category: "open-source",
  },
];
