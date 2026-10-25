export interface SkillCategory {
  category: string;
  skills: string[];
}

// Taken from the résumé: the skills list plus the tools used in the listed projects and internships.
export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "C", "JavaScript", "HTML", "CSS", "Kotlin"],
  },
  {
    category: "Web & Backend",
    skills: ["React.js", "Node.js", "Express.js", "Django", "Django REST Framework", "Celery"],
  },
  {
    category: "Desktop & Mobile",
    skills: ["Jetpack Compose", "Room", "CustomTkinter", "PySide6"],
  },
  {
    category: "Databases",
    skills: ["MongoDB", "SQLite"],
  },
  {
    category: "AI & Data",
    skills: ["Ollama (Llama 3.2)", "ChromaDB", "NLTK", "Pandas", "Data annotation"],
  },
  {
    category: "Tools",
    skills: ["DSA", "Git", "VS Code", "Docker"],
  },
];
