'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Clock,
  SlidersHorizontal,
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
    <div style={{ padding: '36px 0 80px 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Workspace</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Student Dashboard</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              Welcome back, {user ? user.name.split(' ')[0] : 'Student'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Here is your project roadmap, sprint deliverables, and team collaboration status.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/projects/new" className="btn btn-secondary">
              <FolderKanban size={15} />
              <span>New Project</span>
            </a>
            <a href="/projects/proj-teamsync/matches" className="btn btn-primary">
              <SlidersHorizontal size={15} />
              <span>Team Matcher</span>
            </a>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '30px',
        }}>
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Team</span>
              <Users size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>1 Team</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Alpha Core Innovators</div>
          </div>

          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assigned Tasks</span>
              <CheckSquare size={16} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>3 Active</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>1 Deliverable pending review</div>
          </div>

          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Weekly Availability</span>
              <Clock size={16} color="var(--success)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>18 hrs/wk</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Optimal sprint allocation</div>
          </div>

          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified Reviews</span>
              <Award size={16} color="var(--warning)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>4.9 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Peer evaluated deliverables</div>
          </div>
        </div>

        {/* 2 Column Section: Active Team & Upcoming Milestones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '30px',
        }}>
          {/* Active Team Card */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-primary">Active Capstone</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '6px' }}>Alpha Core Innovators</h3>
              </div>
              <span className="badge badge-success">Match 94%</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Project: <strong>TeamSync Platform</strong>. Four team members collaborating on Sprint 4 architecture and final review sign-offs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sprint Completion:</span>
                <span style={{ fontWeight: '600' }}>75% (3/4 Milestones)</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <a href="/teams/team-alpha" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Open Workspace
                </a>
                <a href="/teams/team-alpha/tasks" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <CheckSquare size={13} />
                  <span>Tasks Kanban</span>
                </a>
                <a href="/teams/team-alpha/analytics" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <TrendingUp size={13} />
                  <span>Analytics</span>
                </a>
              </div>
            </div>
          </div>

          {/* Upcoming Capstone Milestones & Deadlines */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Upcoming Deadlines</h3>
              <Calendar size={16} color="var(--primary)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>PR #32 Peer Review Sign-Off</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deliverables API verification</div>
                </div>
                <span className="badge badge-warning">Due in 2 days</span>
              </div>

              <div style={{ padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Production Container Deployment</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health check probes & compose</div>
                </div>
                <span className="badge badge-primary">Due in 6 days</span>
              </div>

              <div style={{ padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>College Capstone Final Submission</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System evaluation & demo report</div>
                </div>
                <span className="badge badge-danger">Final Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Capstone Projects */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recommended Projects for Your Competencies</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Matching your skills in React, Next.js, PostgreSQL, and Node.js
              </p>
            </div>
            <a href="/projects" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.825rem' }}>
              View All ({projects.length})
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {projects.slice(0, 3).map(p => (
              <div key={p.id} style={{ padding: '14px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>{p.category}</span>
                <h4 style={{ fontSize: '0.925rem', fontWeight: '700', marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                  {p.description?.slice(0, 85)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '9px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Team: {p.expectedTeamSize} members</span>
                  <a href={`/projects/${p.id}/matches`} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    View Matches
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
