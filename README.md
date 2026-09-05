# GREVIA — Interactive Climate Education Platform

> **"Learn Climate. Take Action. Make an Impact."**

Grevia is a production-grade, portfolio-ready web platform that teaches climate science, powers an interactive AI "Eco-Coach", runs an adaptive quiz engine, tracks sustainable eco-actions via a points ledger, and ingests live NASA environmental data.

---

## 🌟 Key Features

- **Adaptive Quiz Engine**: Dynamically shifts quiz difficulty (Beginner, Intermediate, Advanced) based on user accuracy (≥80% increases, ≤50% decreases) and response speed. Correct answers are hidden prior to submission.
- **AI Eco-Coach Microservice**: Isolated Node.js/TS AI service providing interactive climate Q&A, detailed quiz explanations, and daily habit recommendations. Supports OpenAI-compatible LLM APIs with a deterministic offline mock fallback.
- **Points Ledger & Gamification**: Immutable points ledger tracking all eco-actions, quiz completions, and mission rewards. Automatic badge triggers (Green Starter, Climate Learner, Quiz Explorer, Climate Master, Eco Champion).
- **NASA Data Pipeline & Worker**: Periodic ingestion worker consuming NASA EONET active natural events (wildfires, storms, floods) and NASA POWER meteorology data (temperature, precipitation, solar radiation) stored in MongoDB snapshots.
- **Role-Based Security**: JWT authentication with HTTP-only refresh cookies, bcrypt password hashing, and role authorization (`student`, `teacher`, `admin`).
- **Modern Responsive UI**: Custom React + Vite + Tailwind CSS design system with Recharts analytics visualizations, interactive cards, and Zustand state stores.

---

## 🏗 Monorepo Architecture

```
grevia/
├── frontend/
│   └── web/                   # React + TypeScript + Vite + Tailwind CSS + Zustand + Recharts
├── backend/
│   ├── api/                   # Express + TypeScript REST API (Auth, Lessons, Quiz, Gamification, Analytics)
│   ├── ai/                    # Independent AI Microservice (LLM client + prompt builders + mock fallback)
│   └── workers/               # Ingestion worker for NASA EONET, POWER, and CO2 data
├── infra/
│   ├── docker/                # Dockerfile.api, Dockerfile.ai, docker-compose.yml
│   └── scripts/               # Seed scripts and setup utilities
├── docs/
│   ├── api-specs/             # OpenAPI / REST specifications
│   └── architecture/          # Architecture design & data flow diagrams
├── package.json               # Root npm workspace configuration
├── README.md                  # Complete documentation
└── .env.example               # Centralized environment variable template
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)
- (Optional) MongoDB & Redis locally, or Docker

### 1. Install Workspace Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Database
Populate demo users, lessons, quiz questions, badges, and missions:
```bash
npm run seed
```

*Default Demo Credentials:*
- **Admin**: `admin@grevia.edu` / `GreviaPass123!`
- **Teacher**: `teacher@grevia.edu` / `GreviaPass123!`
- **Student**: `student@grevia.edu` / `GreviaPass123!`

### 4. Run Development Servers
Launch Backend API, AI Microservice, and Frontend Web concurrently:
```bash
npm run dev
```

The services will start at:
- **Frontend Web**: http://localhost:5173
- **Backend REST API**: http://localhost:3001
- **AI Microservice**: http://localhost:3002

### 5. Run NASA Climate Ingestion Worker
```bash
npm run worker
```

---

## 🧪 Testing & Verification

Run Vitest unit and integration test suites:
```bash
npm run test
```

Build all monorepo packages for production verification:
```bash
npm run build
```

---

## 🐳 Docker Deployment

Run all services including MongoDB and Redis locally using Docker Compose:
```bash
docker-compose -f infra/docker/docker-compose.yml up --build
```
