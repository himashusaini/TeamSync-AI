'use client';

import {
  Users,
  Compass,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  Award,
  Layers,
  Scale,
  Calendar,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        padding: '72px 0 54px 0',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '20px',
            border: '1px solid var(--primary-border)',
          }}>
            <Compass size={14} />
            <span>Academic Team Formation & Project Collaboration</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: 1.16,
            letterSpacing: '-0.03em',
            marginBottom: '18px',
            color: 'var(--text-primary)',
          }}>
            Build Balanced Student Teams. <br />
            <span style={{ color: 'var(--primary)' }}>
              Ship Better Capstone Projects.
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            Eliminate random team assignments and uneven workloads.
            TeamSync pairs student skills, schedule availability, and project roles—with verified milestone reviews and transparent contributions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '44px' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <span>Get Started</span>
              <ArrowRight size={16} />
            </a>
            <a href="/projects/proj-teamsync/matches" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <SlidersHorizontal size={16} />
              <span>Explore Match Simulator</span>
            </a>
          </div>

          {/* 3 Core Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            textAlign: 'left',
          }}>
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Matching Criteria</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', marginTop: '3px' }}>Multi-Skill Alignment</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Skills, availability, roles & load</div>
            </div>
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fair Evaluation</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '3px' }}>Verified Peer Reviews</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Deliverables sign-off & feedback</div>
            </div>
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interactive Modeling</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--success)', marginTop: '3px' }}>What-If Simulator</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Custom weights & roster tuning</div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              A Unified Workspace for Capstone Teams
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              From formation to final faculty presentation, keep every deliverable organized and verifiable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '14px',
              }}>
                <SlidersHorizontal size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Transparent Match Engine</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Evaluates skill coverage, calendar overlaps, role preferences, and weekly workload capacity without opaque black-box recommendations.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                backgroundColor: 'var(--success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                marginBottom: '14px',
              }}>
                <CheckSquare size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Task & Deliverable Kanban</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Track tasks from Todo to Done. Members submit pull request links and artifacts with independent peer review approvals.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                backgroundColor: 'var(--warning-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning)',
                marginBottom: '14px',
              }}>
                <TrendingUp size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Contribution Transparency</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Evidence-based charts show genuine sprint contributions and peer review sign-offs to prevent credit discrepancies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{
        padding: '60px 0',
        backgroundColor: 'var(--accent)',
        color: '#ffffff',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.025em' }}>
            Ready to organize your team?
          </h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6, marginBottom: '28px' }}>
            Join existing student cohorts, explore project briefs, and test team formation immediately.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </a>
            <a href="/projects" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.9rem', backgroundColor: 'transparent', color: '#fff', borderColor: '#475569' }}>
              <span>Browse Projects</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
