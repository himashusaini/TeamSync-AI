import { Sparkles, ShieldCheck, Github, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      backgroundColor: 'var(--bg-card)',
      padding: '48px 0 32px 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '36px',
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontWeight: '700', fontSize: '1.15rem' }}>TeamSync AI</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Student Project Team Formation & Contribution Intelligence Platform.
              Explainable matching algorithms and evidence-based workload transparency.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <GraduationCap size={16} />
              <span>College Capstone Project Submission</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Platform Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><a href="/projects/proj-teamsync/matches" style={{ hover: { color: 'var(--primary)' } }}>Intelligent Matching Engine</a></li>
              <li><a href="/projects/proj-teamsync/matches">What-If Team Simulator</a></li>
              <li><a href="/teams/team-alpha/tasks">Kanban Collaboration Board</a></li>
              <li><a href="/teams/team-alpha/analytics">Contribution Intelligence</a></li>
              <li><a href="/teams/team-alpha/feedback">Fairness & Dispute Resolution</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><a href="/projects">Browse Student Projects</a></li>
              <li><a href="/projects/new">Create Capstone Project</a></li>
              <li><a href="/dashboard">Personalized Dashboard</a></li>
              <li><a href="/profile">Student Competency Profile</a></li>
              <li><a href="/admin">Administrative Overview</a></li>
            </ul>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Architecture
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
              Built with Next.js 15 (App Router), PostgreSQL, Prisma ORM, Recharts, and Lucide React.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--success)' }}>
              <ShieldCheck size={16} />
              <span>Secure Session & Authorization Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          gap: '12px',
        }}>
          <div>
            &copy; 2026 TeamSync AI. All Rights Reserved. Tagline: &ldquo;Build Better Teams. Create Better Projects.&rdquo;
          </div>
          <div>
            College Submission Target: 8 November 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
