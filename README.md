 🚀 Next-Gen AI Resume Builder & Career Engine

An enterprise-grade, interactive **AI Resume Builder and Career Strategist** featuring **Sarah Vance** (AI Executive Recruiter). Powered by **Multi-Model Generative AI** (OpenAI GPT-4o, GPT-4-turbo, GPT-4o-mini & Google Gemini 2.0 Flash) with an instant **Smart Local Engine** fallback.

![AI Resume Builder](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss)
![AI-Powered](https://img.shields.io/badge/AI_Engine-OpenAI_GPT_%7C_Gemini_%7C_Local-10B981)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

 ✨ Key Features

 🤖 1. Sarah Vance — AI Recruiter & Career Strategist
* **General Q&A + Live Resume Mutations**: Ask Sarah any question on coding, general knowledge, career strategy, or interview prep.
* **Full Resume Updates via Prompts**: Instruct Sarah to update **Personal Info**, **Summary**, **Work Experience**, **Education**, **Technical & Soft Skills**, **Projects**, or **Certifications**.
* **Build New Resumes from Scratch**: Prompt Sarah (e.g., *"Build a new resume for a Senior DevOps Engineer with 6 years experience in AWS and Terraform"*), and a complete 100% tailored resume will populate on your canvas!
* **Multi-Model Provider Support**: Switch effortlessly between:
  * 🟢 **OpenAI GPT-4o / GPT-4o-mini / GPT-4-turbo**
  * 🔵 **Google Gemini 2.0 Flash**
  * ⚡ **Smart Local Offline Engine** (zero latency fallback)

### 📄 2. Real-Time Interactive Resume Canvas
* **Live Multi-Template Rendering**: Modern, Executive, Minimalist, and Creative resume layouts.
* **Custom Theme & Typography**: Switch accent colors (Cyan, Indigo, Emerald, Amber, Crimson) and typography dynamically.
* **Inline Bullet Editing**: Click on any bullet point directly on the resume canvas to edit and refine in real time.
* **Pixel-Perfect PDF Export**: Export crisp, single-page vector PDFs using integrated `html2pdf.js`.

### 📊 3. ATS Analytics & Heatmap Analyzer
* **Instant ATS Compatibility Score**: Real-time evaluation against top recruiter parsing algorithms.
* **Missing Keywords & Action Verbs**: Automated detection of missing technical terms and quantifiable metrics (% and $).
* **Impact Heatmap Mode**: Visual toggle that highlights high-impact metric zones across your resume.

---

## 🛠️ Technology Stack

* **Frontend Core**: React 18, Vite 5, JavaScript (ESNext)
* **Styling**: Vanilla CSS3 + Tailwind CSS (Custom Dark Mode & Glassmorphism design tokens)
* **Icons**: Lucide React
* **PDF Engine**: html2pdf.js / html2canvas / jsPDF
* **AI Router**: Native Fetch REST Client supporting OpenAI API (`/v1/chat/completions`) & Google Gemini API

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm** or **yarn**

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/ai-resume-builder.git
cd ai-resume-builder
npm install
