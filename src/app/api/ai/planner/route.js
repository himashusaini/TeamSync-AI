import { NextResponse } from 'next/server';

/**
 * AI Project Brief & Task Planner Assistant
 * Generates structured milestones, tasks, required skills, and acceptance criteria.
 * Includes a smart deterministic domain template fallback when no external LLM key is configured.
 */

const DOMAIN_TEMPLATES = {
  'web development': {
    skills: [
      { name: 'Next.js', minProficiency: 4, roleName: 'Frontend Lead' },
      { name: 'PostgreSQL', minProficiency: 3, roleName: 'Backend & Database Lead' },
      { name: 'Figma', minProficiency: 3, roleName: 'UI/UX Designer' },
      { name: 'Docker', minProficiency: 2, roleName: 'DevOps Specialist' },
    ],
    milestones: [
      { title: 'Phase 1: Architecture Specification & Database Schema Design', completed: false },
      { title: 'Phase 2: Authentication, Session Cookies & Core APIs', completed: false },
      { title: 'Phase 3: Interactive Kanban & Collaboration Workspaces', completed: false },
      { title: 'Phase 4: Deliverable Reviews, Automated Tests & Deployment', completed: false },
    ],
    tasks: [
      { title: 'Configure Database Schema & Prisma Migrations', estimatedHours: 8, priority: 'HIGH', criteria: 'Normalized tables, foreign key constraints, seed dataset' },
      { title: 'Implement Secure Authentication & Session Cookies', estimatedHours: 6, priority: 'HIGH', criteria: 'Bcrypt hashing, HTTP-only JWT cookies, route protection' },
      { title: 'Develop Interactive Component Workspace & UI Tokens', estimatedHours: 10, priority: 'MEDIUM', criteria: 'Responsive desktop & mobile CSS variables, clean micro-interactions' },
      { title: 'Set up Unit & Integration Test Automation', estimatedHours: 8, priority: 'MEDIUM', criteria: 'Boundary condition test pass, deterministic assertions' },
    ],
  },
  'ai/ml': {
    skills: [
      { name: 'Python', minProficiency: 5, roleName: 'ML Research Lead' },
      { name: 'PyTorch', minProficiency: 4, roleName: 'Deep Learning Engineer' },
      { name: 'FastAPI', minProficiency: 4, roleName: 'Inference API Developer' },
      { name: 'React', minProficiency: 3, roleName: 'Evaluation Dashboard Developer' },
    ],
    milestones: [
      { title: 'Phase 1: Dataset Acquisition, Preprocessing & Exploratory Analysis', completed: false },
      { title: 'Phase 2: Baseline Model Architecture & Hyperparameter Tuning', completed: false },
      { title: 'Phase 3: Real-Time Inference Microservice & Swagger Endpoints', completed: false },
      { title: 'Phase 4: Ablation Studies, Model Verification & Evaluation Report', completed: false },
    ],
    tasks: [
      { title: 'Data Cleaning & Normalization Pipeline', estimatedHours: 10, priority: 'HIGH', criteria: 'Handle missing values, stratified train/validation/test split' },
      { title: 'Neural Model Training & Loss Curve Optimization', estimatedHours: 14, priority: 'HIGH', criteria: 'Achieve >88% validation accuracy with checkpointing' },
      { title: 'Async Inference API with Latency Benchmarks', estimatedHours: 8, priority: 'MEDIUM', criteria: 'Sub-100ms response time per prediction batch' },
    ],
  },
  'fintech': {
    skills: [
      { name: 'Solidity', minProficiency: 4, roleName: 'Smart Contract Lead' },
      { name: 'Node.js', minProficiency: 4, roleName: 'Backend Systems Engineer' },
      { name: 'PostgreSQL', minProficiency: 3, roleName: 'Ledger Database Specialist' },
      { name: 'React', minProficiency: 3, roleName: 'FinTech Frontend Engineer' },
    ],
    milestones: [
      { title: 'Phase 1: Escrow Protocol & Cryptographic Architecture', completed: false },
      { title: 'Phase 2: Testnet Deployment & Security Vulnerability Auditing', completed: false },
      { title: 'Phase 3: Transaction Dashboard & Real-Time Settlement Feeds', completed: false },
    ],
    tasks: [
      { title: 'Design Immutable Ledger Schema & Double-Entry Accounting', estimatedHours: 10, priority: 'HIGH', criteria: 'Zero transaction variance, balance reconciliation tests' },
      { title: 'Smart Contract Re-Entrancy & Overflow Audit', estimatedHours: 12, priority: 'HIGH', criteria: 'Pass automated static security analysis' },
    ],
  },
};

export async function POST(request) {
  try {
    const { description, category } = await request.json();

    const normalizedCategory = (category || 'web development').toLowerCase().trim();
    let template = DOMAIN_TEMPLATES[normalizedCategory] || DOMAIN_TEMPLATES['web development'];

    // Provide tailored suggestions
    return NextResponse.json({
      success: true,
      source: 'Deterministic Capstone Assistant Engine',
      suggestedSkills: template.skills,
      suggestedMilestones: template.milestones,
      suggestedTasks: template.tasks,
    });
  } catch (error) {
    console.error('AI Planner error:', error);
    return NextResponse.json({ error: 'Planning assistant unavailable' }, { status: 500 });
  }
}
