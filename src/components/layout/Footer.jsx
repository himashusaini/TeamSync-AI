import { Compass, ShieldCheck, GraduationCap, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      backgroundColor: 'var(--bg-card)',
      padding: '40px 0 28px 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
                <Compass size={16} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                TeamSync
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              Collaborative team formation and project management platform designed for universities, capstones, and multi-disciplinary student cohorts.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <GraduationCap size={15} />
              <span>Academic Engineering Capstone 2026</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><a href="/projects" style={{ transition: 'color var(--transition-fast)' }}>Browse Projects</a></li>
              <li><a href="/projects/proj-teamsync/matches">Match Simulator</a></li>
              <li><a href="/teams/team-alpha/tasks">Task Kanban Board</a></li>
              <li><a href="/teams/team-alpha/analytics">Team Analytics</a></li>
              <li><a href="/teams/team-alpha/feedback">Peer Reviews & Feedback</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><a href="/projects/new">Post a Project Brief</a></li>
              <li><a href="/dashboard">My Workspace</a></li>
              <li><a href="/profile">Student Competencies</a></li>
              <li><a href="/admin">Evaluation Hub</a></li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              System Status
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
              Built with Next.js 15, PostgreSQL & Prisma ORM, and secure HTTP-only session tokens.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--success)' }}>
              <ShieldCheck size={15} />
              <span>Production Infrastructure Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          gap: '12px',
        }}>
          <div>
            &copy; {new Date().getFullYear()} TeamSync. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
