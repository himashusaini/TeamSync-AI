# TeamSync AI: Student Project Team Formation & Contribution Intelligence Platform
## Comprehensive College Capstone Project Report Outline
**Submission Target:** 8 November 2026  
**Product Category:** Intelligent Team Formation, Student Collaboration, and Contribution Analytics  
**Tagline:** *Build Better Teams. Create Better Projects.*

---

### Table of Contents
1. **Abstract**
2. **Introduction & Motivation**
3. **Problem Statement & Background Analysis**
   - 3.1 Friendship and Convenience Biases in Team Formation
   - 3.2 Capability Mismatches and Missing Critical Skills
   - 3.3 Availability Conflicts and Asynchronous Communication Breakdown
   - 3.4 Workload Asymmetry and The "Free-Rider" Phenomenon
   - 3.5 Subjective Grading and Inadequate Contribution Evidence
4. **Existing Systems & Literature Review**
   - 4.1 Traditional Learning Management Systems (Canvas, Blackboard, Moodle)
   - 4.2 Generic Kanban & Task Trackers (Trello, Jira, Asana)
   - 4.3 Git-Centric Metrics (Lines of Code, Commit Counts) and Their Flaws
   - 4.4 Algorithmic Team Formation Research (Belbin Team Roles, Linear Programming)
5. **Proposed Solution: TeamSync AI**
   - 5.1 System Objectives
   - 5.2 Key Differentiators: Explainable Matching vs Black-Box Models
   - 5.3 Evidence-Based Contribution Tracking
6. **Requirements Specification**
   - 6.1 Functional Requirements (FR-1 through FR-12)
   - 6.2 Non-Functional Requirements (Performance, Security, Reliability, Usability)
   - 6.3 User Personas (Student, Project Owner, Reviewer, Faculty Evaluator)
7. **System Architecture & Design**
   - 7.1 Multi-Tier Architecture Overview
   - 7.2 Next.js App Router Architecture & Route Handlers
   - 7.3 Data Access Layer & Zero-Friction Storage Engine
   - 7.4 Client-Side Design System & Responsive Tokens
8. **Database & Entity Relationship Design**
   - 8.1 PostgreSQL Relational Schema
   - 8.2 Entity Definitions (User, Profile, Skill, Project, Team, Task, Deliverable, Review, ContributionEvent, Dispute, AuditLog)
   - 8.3 Prisma ORM Mapping & Migration Strategy
9. **Algorithmic Design: Explainable Matching Engine**
   - 9.1 Multi-Factor Scoring Equation:  
     $$M = 0.40S + 0.25A + 0.15I + 0.10R + 0.10W$$
   - 9.2 Skill Coverage Score ($S$) Calculation & Proficiency Normalization
   - 9.3 Weekly Schedule Matrix & Availability Overlap ($A$)
   - 9.4 Project Domain Interest Alignment ($I$)
   - 9.5 Role Distribution & Redundancy Detection ($R$)
   - 9.6 Workload Capacity & Overload Warning Index ($W$)
   - 9.7 Bounded Greedy Search & Combinatorial Team Selection
   - 9.8 Interactive What-If Simulator Architecture
10. **Implementation Details**
    - 10.1 Authentication & Session Management (HTTP-only JWT Cookies, Bcrypt)
    - 10.2 Kanban Task Workspace & State Lifecycle
    - 10.3 Deliverable Submission & Independent Peer Review Guardrails
    - 10.4 Contribution Dispute Workflow & Resolution Audit Trail
    - 10.5 Data Visualizations via Recharts
11. **Testing, Verification & Quality Assurance**
    - 11.1 Test Strategy & Test Harness Setup
    - 11.2 Unit Tests: Matching Engine Boundary Conditions & Normalization (7 Tests)
    - 11.3 Integration Tests: Auth, Team Limits, Self-Approval Guardrail, Disputes (6 Tests)
    - 11.4 Production Build Verification & Compilation Results
12. **Experimental Results & Evaluation Benchmark**
    - 12.1 Synthetic Benchmark Dataset (20 Student Personas, 5 Capstones)
    - 12.2 Algorithm Performance Comparison: Greedy vs Random vs Friendship Formation
    - 12.3 Workload Fairness Index Pre- and Post-Simulation
13. **Limitations & Future Scope**
    - 13.1 Automatic Git Webhook Telemetry Integration
    - 13.2 Real-Time WebSocket Push Notifications
    - 13.3 Multi-Institution Federation
14. **Conclusion & Project Impact**
15. **References & Appendices**
    - Appendix A: API Route Specifications
    - Appendix B: Database Migration Schema
    - Appendix C: Demonstration Script
