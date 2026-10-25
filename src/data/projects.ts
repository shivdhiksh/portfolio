export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  features: string[];
  /** Repository link. Left out when there isn't a public repo to point at. */
  github?: string;
  /** Where to try or download it, with the label for that button. */
  live?: string;
  liveLabel?: string;
}

// Résumé projects use the résumé wording. The three GitHub projects are written from their READMEs.
export const projects: Project[] = [
  {
    id: "valmentor-ai",
    title: "ValMentor AI – AI Career & Interview Mentor",
    category: "AI · Web",
    description: "An AI-powered career mentoring platform, built during a hackathon in a 2-member team.",
    tech: ["Python", "Django", "Django REST Framework", "Docker", "Celery"],
    features: [
      "Built an AI-powered career mentoring platform during a hackathon in a 2-member team.",
      "Developed modules for AI mock interviews, personalized roadmaps, resume ATS analysis, and career guidance.",
      "Containerized the application using Docker and optimized background processing with Celery.",
    ],
  },
  {
    id: "spidy-ai",
    title: "Spidy – AI Desktop Assistant",
    category: "AI · Personal project",
    description:
      "A personal AI companion that lives on the computer as an autonomous agent: it understands natural-language commands and automates desktop and browser tasks.",
    tech: ["Python", "Ollama (Llama 3.2)", "AsyncIO", "ChromaDB", "SQLite", "Git"],
    features: [
      "Designed and developed a modular AI desktop assistant capable of understanding natural language commands and automating desktop and browser tasks.",
      "Built desktop automation features to launch applications, search files, control browsers, and manage system operations through intelligent skills.",
    ],
    github: "https://github.com/shivdhiksh/spidy-ai",
  },
  {
    id: "medsafe",
    title: "MEDSAFE – Medicine Expiry Tracker for Windows",
    category: "Desktop app · Released",
    description:
      "A free, private, offline-first Windows desktop app that helps households track medicine expiry dates locally.",
    tech: ["Python", "CustomTkinter", "SQLite", "PyInstaller", "Inno Setup"],
    features: [
      "Batch-based inventory with live search, sorting by expiry or name, and status and storage-location filters.",
      "Windows toast reminders at configurable thresholds, with same-day duplicate alerts suppressed.",
      "100% offline: local SQLite storage with one-click CSV and JSON backups. No accounts, no cloud.",
      "Ships as a Windows installer (v1.1.0) with a glassmorphism UI in dark and light themes.",
    ],
    github: "https://github.com/shivdhiksh/MEDSAFE",
    live: "https://github.com/shivdhiksh/MEDSAFE/releases/tag/v1.1.0",
    liveLabel: "Download",
  },
  {
    id: "medsafe-mobile",
    title: "MEDSAFE Mobile – Medicine Expiry Tracker for Android",
    category: "Android app · In progress",
    description:
      "An independent Android take on MEDSAFE: offline-first, private by default, with every medicine tracked in batches.",
    tech: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "DataStore", "Coroutines"],
    features: [
      "Multi-batch inventory where each batch has its own expiry date, quantity, and storage location.",
      "Zero analytics, zero cloud databases, zero account registrations: all data stays on the device.",
      "Roadmap: scheduled reminders, camera photos, barcode and QR scanning, and OCR for expiry dates.",
      "Clean MVVM architecture with a repository layer and domain use cases, on a Room database.",
    ],
    github: "https://github.com/shivdhiksh/MEDSAFE-Mobile",
  },
  {
    id: "sentinel-boot-tracker",
    title: "Sentinel Boot Tracker",
    category: "Automation · Python",
    description:
      "A lightweight Windows laptop monitoring tool that sends Telegram notifications on startup, shutdown, lock, and unlock, and can be controlled remotely through a secure bot.",
    tech: ["Python", "Telegram Bot API", "psutil", "PySide6", "Windows Task Scheduler", "VBScript"],
    features: [
      "Real-time Telegram alerts with battery status and Windows geolocation for startup, shutdown, lock, and unlock events.",
      "Remote command engine built on an allowlist: no arbitrary shell execution, strict single-user authorization, and a structured audit trail.",
      "Remote telemetry for CPU, RAM, disk, battery, uptime, and network, plus confirmed lock, shutdown, and restart.",
    ],
    github: "https://github.com/shivdhiksh/sentinel-boot-tracker",
  },
  {
    id: "twitter-sentiment",
    title: "Sentiment Classification of Large-Scale Twitter Data",
    category: "NLP · Data",
    description: "Classifies public sentiment in a large-scale Twitter dataset as positive, negative, or neutral.",
    tech: ["Python", "Pandas", "NLTK"],
    features: [
      "Analyzed a large-scale dataset of Twitter data to classify public sentiment as positive, negative, or neutral.",
      "Preprocessed raw text data by tokenizing, removing stop words, and cleaning noise to optimize model performance.",
    ],
  },
];
