# TeamSync AI — Student Project Team Formation & Contribution Intelligence Platform

> **Tagline:** Build Better Teams. Create Better Projects.  
> **College Submission Deadline:** 8 November 2026  
> **Category:** Intelligent Team Formation, Student Collaboration, Project Management, and Contribution Analytics

---

## 1. Executive Summary & Problem Statement

College project teams are overwhelmingly formed through friendship or immediate convenience rather than objective consideration of skills, availability, workload commitments, and aligned interests. This leads to common pitfalls:
1. **Critical Skill Deficits:** Missing key technical competencies (e.g. databases, DevOps, UI/UX).
2. **Scheduling Collisions:** Divergent class timetables and incompatible working hours.
3. **Unequal Workloads & The "Free-Rider" Phenomenon:** Uneven distribution of tasks without transparent accountability.
4. **Subjective Grading:** Faculty evaluators lacking granular, evidence-based records of individual contributions.

**TeamSync AI** solves this with:
- An **explainable, multi-factor algorithmic recommendation engine** that matches student cohorts using a transparent 5-factor scoring model.
- An **interactive What-If Team Simulator** allowing users to adjust component weights and swap candidates in real-time.
- A **Kanban Task Workspace** with deliverable submission and independent peer review guardrails (preventing author self-approval).
- A **Contribution Intelligence System** that translates verified deliverables, reviews, and completed tasks into an audited activity index, backed by a formal **Dispute Mediation Workflow**.

---

## 2. Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components & Route Handlers)
- **Frontend:** React 19, JavaScript & JSX (Clean ES modules, no TypeScript overhead)
- **Styling:** CSS Modules & Global CSS Design System (`--primary: deep indigo`, `--accent: electric blue`)
- **Persistence & ORM:** PostgreSQL with Prisma ORM; automatic zero-friction persistent local fallback for instant local evaluation
- **Analytics & Visualizations:** Recharts (Workload distribution bar charts, task execution pie charts, contribution activity trends)
- **Icons:** Lucide React
- **Validation:** Zod
- **Security & Auth:** Bcrypt password hashing, HTTP-only JWT cookies via Jose, server-side authorization guardrails

---

## 3. Algorithmic Matching Formula

TeamSync AI evaluates team synergy using a normalized 5-factor model:

$$M = 0.40S + 0.25A + 0.15I + 0.10R + 0.10W$$

Where each component is normalized between $0$ and $100$:
- **$S$ — Skill Coverage Score (40%):** Evaluates required skills and minimum proficiencies against candidate capabilities. Identifies fully covered skills, missing critical skills, skill redundancy, and peer mentoring pairs.
- **$A$ — Availability Compatibility Score (25%):** Analyzes 7×24 weekly schedule matrices to determine shared overlapping hours compared against the project's meeting requirements. Explicitly penalizes unknown or missing schedules.
- **$I$ — Interest Alignment Score (15%):** Maps student technical passions (AI/ML, Web, FinTech, IoT, Cloud) to the project category.
- **$R$ — Role Coverage Score (10%):** Ensures core project roles (Project Lead, Frontend, Backend, UI/UX, DevOps/QA) are satisfied without excessive duplication.
- **$W$ — Workload Compatibility Score (10%):** Compares project demand with student weekly commitments to flag burnout risks.

---

## 4. Key Application Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page with hero, dynamic preview, formula breakdown, and fairness workflow |
| `/projects` | Capstone project listing with domain filtering and search |
| `/projects/new` | Create project with competency criteria, expected team size, and deadlines |
| `/projects/[id]` | Project specifications, required proficiency levels, and milestones |
| `/projects/[id]/matches` | Algorithmic team recommendations & interactive What-If Team Simulator |
| `/teams/[id]` | Team hub overview, roster, and verified contribution activity stream |
| `/teams/[id]/tasks` | 4-Column Kanban board (To Do, In Progress, In Review, Completed) |
| `/teams/[id]/analytics` | Contribution intelligence and workload distribution charts |
| `/teams/[id]/feedback` | Peer feedback and formal contribution dispute mediation channel |
| `/dashboard` | Personalized student dashboard with enrolled teams, metrics, and deadlines |
| `/profile` | Student competency profile, 7-day schedule grid, and skill proficiencies |
| `/login` & `/register` | Authentication with quick pre-configured demo personas |
| `/admin` | Faculty and evaluation panel cohort monitoring hub |
| `/settings` | Account notifications and team communication preferences |

---

## 5. Quick Start Instructions

### Prerequisites
- Node.js v18+ (tested on Node v26)
- npm v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/teamsync-ai.git
cd teamsync-ai
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, TeamSync AI includes an embedded persistent local repository pre-populated with 20 student profiles, 5 projects, and active teams, allowing immediate zero-friction evaluation without configuring PostgreSQL).*

### 3. Run Automated Tests
```bash
npm test
```
All 13 unit and integration tests will execute:
- 7 Matching Engine mathematical tests
- 6 Security and business rules integration tests

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. PostgreSQL Database Setup (Optional Production Mode)

To connect TeamSync AI to an external PostgreSQL instance:
1. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/teamsync_ai?schema=public"
   ```
2. Generate Prisma Client & push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. Seed synthetic benchmark data:
   ```bash
   npm run seed
   ```

---

## 7. Demo Accounts for Evaluation

You can log in instantly using the demo buttons on `/login` or with these credentials:

| Persona | Email | Password | Role |
|---|---|---|---|
| **Alex Chen** | `alex.chen@university.edu` | `TeamSync2026!` | Student & Project Lead |
| **Sarah Miller** | `sarah.miller@university.edu` | `TeamSync2026!` | Student (AI/ML Engineer) |
| **Priya Sharma** | `priya.sharma@university.edu` | `TeamSync2026!` | Student (DevOps & Systems) |
| **David Kim** | `david.kim@university.edu` | `TeamSync2026!` | Student (Backend & QA) |

---

## 8. College Submission Verification Checklist

- [x] Application compiles cleanly via Next.js App Router
- [x] 13 automated test suites pass with 0 failures
- [x] Explainable 5-factor algorithmic matching engine fully functional
- [x] Interactive What-If Team Simulator with dynamic weight sliders
- [x] Kanban task management with deliverable proof and independent review guardrails
- [x] Author self-approval prevention enforced on server
- [x] Contribution disputes workflow and recorded mediation notes
- [x] Recharts analytics for workload distribution, task execution, and contribution trends
- [x] Rich synthetic demo dataset with 20 student profiles across 5 domains
- [x] Responsive SaaS design system compliant with Deep Indigo and Electric Blue identity
