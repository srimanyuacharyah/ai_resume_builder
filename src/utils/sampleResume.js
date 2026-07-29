export const SAMPLE_RESUME = {
  personalInfo: {
    fullName: "Alex Rivers",
    jobTitle: "Senior AI & Full Stack Engineer",
    email: "alex.rivers@techlabs.io",
    phone: "+1 (415) 890-2341",
    location: "San Francisco, CA",
    website: "https://alexrivers.dev",
    linkedin: "linkedin.com/in/alexrivers-ai",
  },
  summary: "Innovative Senior Software & AI Engineer with 6+ years of experience architecting scalable full-stack applications and deploying high-throughput LLM agents. Proven track record of spearheading cloud microservices that cut infrastructure costs by 34% and reduced inference latencies by 42%. Passionate about modern UI/UX design, real-time analytics pipelines, and multi-agent systems.",
  workExperience: [
    {
      id: "exp_1",
      company: "Cognitive Scale AI",
      position: "Lead AI Systems Engineer",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected an autonomous multi-agent orchestration framework using React, Node.js, and Google Gemini API, increasing user workflows completion rate by 58%.",
        "Optimized vector search indexing across 40M+ documents using Qdrant and Redis, decreasing P99 search latency from 1.2s to 85ms.",
        "Engineered real-time streaming WebSocket infrastructure handling 12,000+ concurrent user sessions with 99.99% uptime SLA.",
        "Mentored a team of 5 frontend and machine learning engineers, establishing strict TypeScript guidelines and CI/CD automated testing suites."
      ]
    },
    {
      id: "exp_2",
      company: "Apex Cloud Solutions",
      position: "Senior Full Stack Engineer",
      location: "Oakland, CA",
      startDate: "2021-03",
      endDate: "2022-12",
      current: false,
      bullets: [
        "Led migration of legacy monolithic Rails application to Next.js and Go microservices, accelerating page load speeds by 65%.",
        "Designed interactive dashboard analytics platform utilizing React, D3.js, and Tailwind CSS consumed by 120k+ daily active business users.",
        "Implemented secure JWT authentication and RBAC permissions across multi-tenant enterprise APIs, preventing unauthorized data access incidents."
      ]
    },
    {
      id: "exp_3",
      company: "Vanguard Tech Inc.",
      position: "Software Engineer",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2021-02",
      current: false,
      bullets: [
        "Built responsive web UI components using React, Redux, and modern CSS grid system for core SaaS product.",
        "Integrated GraphQL query endpoint layer that reduced database bandwidth overhead by 28%.",
        "Collaborated closely with product management and UI designers to ship 14 major feature sprints on schedule."
      ]
    }
  ],
  education: [
    {
      id: "edu_1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Data Science",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.88 / 4.0"
    }
  ],
  skills: {
    technical: [
      "TypeScript / JavaScript", "React / Next.js", "Python (PyTorch / FastAPI)", 
      "Google Gemini API", "Node.js / Express", "Tailwind CSS / Glassmorphism", 
      "GraphQL / REST APIs", "PostgreSQL / Redis", "Docker / Kubernetes", "Vector DBs (Qdrant/Pinecone)"
    ],
    soft: [
      "Cross-functional Leadership", "Technical Architecture", "Product Strategy", 
      "Agile/Scrum Leadership", "Mentorship & Code Reviews"
    ],
    tools: [
      "Vite / Webpack", "Git / GitHub Actions", "Google Cloud Platform", "AWS (Lambda, S3)", "Figma", "Postman"
    ]
  },
  projects: [
    {
      id: "proj_1",
      name: "AgileMind AI - Autonomous Task Assistant",
      description: "Generative AI workspace tool that converts natural language prompts into automated project epics, GitHub issues, and code scaffolding.",
      technologies: ["React", "Tailwind CSS", "Gemini 1.5 Pro", "FastAPI"],
      link: "github.com/alexrivers/agilemind-ai",
      bullets: [
        "Engineered real-time streaming UI with custom Markdown rendering and state management.",
        "Accumulated 2,400+ GitHub stars and 15,000 active monthly users within 3 months of launch."
      ]
    },
    {
      id: "proj_2",
      name: "PulseDash - Real-Time Microservice Monitor",
      description: "Lightweight monitoring dashboard tracking latency distribution, memory leaks, and HTTP status codes across distributed services.",
      technologies: ["TypeScript", "React", "Go", "WebSockets"],
      link: "github.com/alexrivers/pulsedash",
      bullets: [
        "Achieved sub-16ms chart re-renders under continuous 60fps data stream."
      ]
    }
  ],
  certifications: [
    {
      id: "cert_1",
      name: "Google Cloud Certified Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "2023"
    },
    {
      id: "cert_2",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2022"
    }
  ]
};
