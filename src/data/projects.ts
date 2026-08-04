export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  github: string;
  live?: string;
  image: string;
  featured: boolean;
  category: string;
}

export const projects: Project[] = [
  {
    id: "spidy-ai",
    title: "Spidy — AI Desktop Companion",
    description: "A production-quality, always-on AI desktop companion for Windows with wake-word detection, local AI reasoning, and system-level automation.",
    longDescription:
      "Spidy is a personal AI that lives inside Windows. Say 'Hey Spidy' and a beautiful floating interface appears above every application — ready to help with anything. Features always-on wake word detection, 100% offline-capable local AI reasoning, file search and management, browser automation, coding assistance, and screen understanding via OCR. Built with Python 3.11+ and designed for safety with permission-gated actions.",
    tech: ["Python", "AI/ML", "OCR", "Wake Word Detection", "Windows API", "Browser Automation"],
    features: [
      "Always-on 'Hey Spidy' wake word detection",
      "Local AI reasoning — 100% offline capable",
      "File search, open, and management",
      "Browser automation & web assistance",
      "Screen understanding & OCR",
      "Permission-gated safety system",
    ],
    github: "https://github.com/shivdhiksh/spidy-ai",
    live: "",
    image: "/projects/spidy.png",
    featured: true,
    category: "AI / ML",
  },
  {

    id: "valmentor-ai",
    title: "ValMentor AI",
    description: "AI-powered mentorship platform that personalizes career guidance using NLP and ML models.",
    longDescription:
      "ValMentor AI is an intelligent mentorship platform that leverages state-of-the-art NLP models to analyze a user's skills, goals, and career trajectory. It provides personalized roadmaps, suggests learning resources, and connects users with the right mentor profiles. Built with a microservices architecture for scalability.",
    tech: ["Python", "FastAPI", "React", "TensorFlow", "MongoDB", "Docker"],
    features: [
      "Personalized career roadmaps powered by AI",
      "NLP-based skill gap analysis",
      "Real-time mentor matching algorithm",
      "Progress tracking dashboard",
      "Integration with LinkedIn and GitHub APIs",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/valmentor.png",
    featured: true,
    category: "AI / ML",
  },
  {
    id: "ai-hr-cost-engine",
    title: "AI HR Cost Engine",
    description: "Intelligent HR analytics engine that forecasts workforce costs and optimizes hiring decisions using predictive ML models.",
    longDescription:
      "A sophisticated ML-powered engine that helps HR teams forecast workforce costs with high accuracy. Uses regression models, time-series forecasting, and scenario simulation to give data-driven insights on hiring, attrition, and compensation planning.",
    tech: ["Python", "Scikit-learn", "Pandas", "React", "Node.js", "MySQL"],
    features: [
      "Cost forecasting with 95%+ accuracy",
      "Scenario-based hiring simulations",
      "Attrition risk prediction",
      "Interactive analytics dashboard",
      "Automated report generation",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/hr-engine.png",
    featured: true,
    category: "AI / ML",
  },
  {
    id: "twitter-sentiment",
    title: "Twitter Sentiment Analysis",
    description: "Real-time social media sentiment analysis pipeline using NLP and deep learning to track brand perception.",
    longDescription:
      "A full-stack sentiment analysis platform that streams live Twitter data, processes it through a fine-tuned BERT model, and visualizes real-time sentiment trends. Features entity extraction, emotion classification, and topic clustering.",
    tech: ["Python", "BERT", "Tweepy", "FastAPI", "React", "Redis", "PostgreSQL"],
    features: [
      "Real-time Twitter stream processing",
      "BERT-based sentiment classification",
      "Entity and topic extraction",
      "Live trend visualization",
      "Historical data analysis",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/sentiment.png",
    featured: true,
    category: "NLP",
  },
  {
    id: "ai-proctoring",
    title: "AI Examination Proctoring System",
    description: "Computer vision-based proctoring system that detects malpractice in online exams using real-time face and gaze analysis.",
    longDescription:
      "An intelligent proctoring system that uses computer vision algorithms to monitor exam integrity. Detects multiple faces, gaze deviation, tab switching, and unusual movements. Generates automated violation reports with timestamped evidence.",
    tech: ["Python", "OpenCV", "TensorFlow", "Flask", "React", "WebRTC", "MongoDB"],
    features: [
      "Real-time face detection & recognition",
      "Gaze tracking and head pose estimation",
      "Tab/window switch detection",
      "Automated violation reporting",
      "WebRTC live stream processing",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/proctoring.png",
    featured: true,
    category: "Computer Vision",
  },
  {
    id: "hackathon-project",
    title: "Hackathon Innovation Project",
    description: "Award-winning hackathon project solving real-world problems with cutting-edge AI and rapid prototyping.",
    longDescription:
      "A rapid-prototyped solution built under 24-hour hackathon conditions. Demonstrates the ability to ideate, architect, and deploy a working product under extreme time pressure. Won recognition for innovation and technical execution.",
    tech: ["React", "Node.js", "Python", "AWS", "MongoDB"],
    features: [
      "Built under 24-hour constraint",
      "Scalable microservices architecture",
      "Real-world problem solving",
      "Live product demo",
      "Award-winning innovation",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/hackathon.png",
    featured: false,
    category: "Full Stack",
  },
  {
    id: "strands-agent",
    title: "Strands Agent Project",
    description: "Autonomous AI agent built with LLM orchestration that can plan, reason, and execute multi-step tasks.",
    longDescription:
      "An autonomous AI agent framework leveraging large language models with tool-use capabilities. The agent can decompose complex goals, plan multi-step strategies, use external tools (web search, code execution, APIs), and self-correct based on feedback.",
    tech: ["Python", "LangChain", "OpenAI API", "FastAPI", "React", "Docker"],
    features: [
      "LLM-powered autonomous planning",
      "Tool-use and function calling",
      "Multi-step task decomposition",
      "Self-reflection and correction",
      "Extensible tool plugin system",
    ],
    github: "https://github.com/shivdhiksh",
    live: "",
    image: "/projects/strands.png",
    featured: false,
    category: "AI / ML",
  },
];
