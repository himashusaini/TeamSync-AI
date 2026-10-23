'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, projRes] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()),
          fetch('/api/projects').then(r => r.json()),
        ]);

        if (meRes.authenticated) {
          setUser(meRes.user);
        } else {
          // If not logged in, fetch demo default user
          const demoRes = await fetch('/api/projects/proj-teamsync').then(r => r.json());
        }

        if (projRes.projects) {
          setProjects(projRes.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Workspace</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Student Dashboard</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Welcome back, {user ? user.name.split(' ')[0] : 'Student'}! 👋
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your capstone project hub, active milestones, and team synergy health.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/projects/new" className="btn btn-secondary">
              <FolderKanban size={16} />
              <span>New Project</span>
            </a>
            <a href="/projects/proj-teamsync/matches" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Match Engine</span>
            </a>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Active Teams</span>
              <Users size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>1 Enrolled</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Alpha Core Innovators</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Assigned Tasks</span>
              <CheckSquare size={18} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>3 Tasks</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>1 Deliverable awaiting review</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Workload Capacity</span>
              <Clock size={18} color="var(--success)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>18 hrs/wk</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Optimal distribution (balanced)</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Verified Points</span>
              <Award size={18} color="#d97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706' }}>4.9 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across approved deliverables</div>
          </div>
        </div>

        {/* 2-Column: Active Teams & Upcoming Capstone Deadlines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '36px' }}>
          {/* Active Teams Workspace Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>My Collaboration Teams</h3>
              <a href="/teams/team-alpha" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Open Workspace
              </a>
            </div>

            <div style={{
              padding: '18px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Alpha Core Innovators</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project: TeamSync AI</div>
                </div>
                <span className="badge badge-success">Match 94%</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Explainable AI student team formation platform. 4 team members actively collaborating on Sprint 4 deliverables.
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href="/teams/team-alpha/tasks" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  <CheckSquare size={14} />
                  <span>Tasks Kanban</span>
                </a>
                <a href="/teams/team-alpha/analytics" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  <TrendingUp size={14} />
                  <span>Contribution Analytics</span>
                </a>
              </div>
            </div>
          </div>

          {/* Upcoming Capstone Milestones & Deadlines */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Upcoming Deadlines</h3>
              <Calendar size={18} color="var(--primary)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>PR #32 Peer Review Sign-Off</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deliverables API verification</div>
                </div>
                <span className="badge badge-warning">Due in 2 days</span>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Production Docker Deployment</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health check probes & compose</div>
                </div>
                <span className="badge badge-primary">Due in 6 days</span>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>College Capstone Final Submission</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System evaluation & demo report</div>
                </div>
                <span className="badge badge-danger">8 Nov 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Capstone Projects */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recommended Projects for Your Competencies</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on your skills in React, Next.js, PostgreSQL, and Node.js
              </p>
            </div>
            <a href="/projects" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              View All ({projects.length})
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {projects.slice(0, 3).map(p => (
              <div key={p.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>{p.category}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>{p.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px', flex: 1 }}>
                  {p.description?.slice(0, 90)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {p.expectedTeamSize}</span>
                  <a href={`/projects/${p.id}/matches`} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Match
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
