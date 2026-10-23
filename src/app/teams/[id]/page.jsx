'use client';

import { useState, useEffect, use } from 'react';
import {
  Users,
  CheckSquare,
  BarChart3,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function TeamOverviewPage({ params }) {
  const unwrappedParams = use(params);
  const teamId = unwrappedParams.id;

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teams/${teamId}`)
      .then(res => res.json())
      .then(data => {
        if (data.team) setTeam(data.team);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading team collaboration workspace...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Team not found</h2>
        <a href="/projects" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Projects</a>
      </div>
    );
  }

  const tasks = team.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inReviewTasks = tasks.filter(t => t.status === 'IN_REVIEW').length;
  const deliverables = team.deliverables || [];
  const members = team.members || [];
  const disputes = team.disputes || [];
  const openDisputes = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length;

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Workspace Breadcrumbs & Title */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <a href="/projects">Projects</a>
            <span>/</span>
            <a href={`/projects/${team.projectId}`}>{team.project?.title || 'Project'}</a>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Team Workspace</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={26} color="var(--primary)" />
                <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  {team.name}
                </h1>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Active collaboration workspace for {team.project?.title}.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a href={`/teams/${team.id}/tasks`} className="btn btn-primary" style={{ padding: '10px 18px' }}>
                <CheckSquare size={16} />
                <span>Kanban Tasks ({tasks.length})</span>
              </a>
              <a href={`/teams/${team.id}/analytics`} className="btn btn-secondary" style={{ padding: '10px 18px' }}>
                <BarChart3 size={16} />
                <span>Contribution Analytics</span>
              </a>
              <a href={`/teams/${team.id}/feedback`} className="btn btn-secondary" style={{ padding: '10px 18px' }}>
                <Scale size={16} />
                <span>Fairness & Disputes {openDisputes > 0 && `(${openDisputes})`}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Active Members</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{members.length} Students</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Capacity: {team.project?.expectedTeamSize || 4} Max</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Task Completion</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{completedTasks} of {tasks.length} tasks closed</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Deliverables in Review</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)', marginTop: '4px' }}>{inReviewTasks}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Requires peer review sign-off</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Dispute Status</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: openDisputes > 0 ? 'var(--warning)' : 'var(--success)', marginTop: '4px' }}>
              {openDisputes} Active
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Evidence mediation channel</div>
          </div>
        </div>

        {/* 2-Column: Team Roster & Recent Contribution Events */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {/* Team Member Roster Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Team Member Roster</h3>
              <span className="badge badge-primary">{members.length} Enrolled</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {members.map(m => (
                <div
                  key={m.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={m.user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={m.user?.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.925rem' }}>{m.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.user?.studentProfile?.department} • {m.user?.studentProfile?.weeklyAvailabilityHours || 15} hrs/wk
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-accent">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution Activity Stream */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Verified Contribution Stream</h3>
              <Award size={18} color="var(--success)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(team.contributions || []).slice(0, 5).map(evt => (
                <div
                  key={evt.id}
                  style={{
                    padding: '12px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{evt.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {evt.user?.name} • {evt.details}
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    +{evt.weight} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
