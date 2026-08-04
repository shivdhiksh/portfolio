export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Programming",
    icon: "Code2",
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "Python", level: 92 },
      { name: "Java", level: 78 },
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 75 },
      { name: "C", level: 70 },
    ],
  },
  {
    category: "Web Development",
    icon: "Globe",
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "React", level: 88 },
      { name: "Next.js", level: 82 },
      { name: "Node.js", level: 80 },
      { name: "Express", level: 78 },
      { name: "HTML / CSS", level: 90 },
    ],
  },
  {
    category: "Database",
    icon: "Database",
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "MongoDB", level: 82 },
      { name: "MySQL", level: 78 },
      { name: "PostgreSQL", level: 70 },
      { name: "Redis", level: 65 },
    ],
  },
  {
    category: "AI / ML",
    icon: "Brain",
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "Machine Learning", level: 88 },
      { name: "Deep Learning", level: 82 },
      { name: "NLP", level: 80 },
      { name: "Computer Vision", level: 75 },
      { name: "Data Analysis", level: 85 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "Wrench",
    color: "from-yellow-500 to-orange-500",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Docker", level: 72 },
      { name: "VS Code", level: 95 },
      { name: "Postman", level: 85 },
      { name: "Linux", level: 75 },
    ],
  },
];
