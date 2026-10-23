'use client';

import { useState, useEffect, use } from 'react';
import {
  Users,
  CheckSquare,
  BarChart3,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import TeamAnalyticsCharts from '@/components/analytics/TeamAnalyticsCharts';

export default function TeamAnalyticsPage({ params }) {
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
        Computing contribution metrics and workload distribution...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Team not found</h2>
        <a href="/projects" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Projects</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <a href="/projects">Projects</a>
          <span>/</span>
          <a href={`/teams/${team.id}`}>{team.name}</a>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Contribution Intelligence</span>
        </div>

        {/* Workspace Subnav Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {team.name} — Contribution Intelligence
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Evidence-based analytics tracking verified deliverables, task completions, and workload balance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={`/teams/${team.id}`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <Users size={16} />
              <span>Overview</span>
            </a>
            <a href={`/teams/${team.id}/tasks`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <CheckSquare size={16} />
              <span>Kanban Tasks</span>
            </a>
            <a href={`/teams/${team.id}/analytics`} className="btn btn-primary" style={{ padding: '9px 16px' }}>
              <BarChart3 size={16} />
              <span>Analytics</span>
            </a>
            <a href={`/teams/${team.id}/feedback`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <Scale size={16} />
              <span>Disputes & Feedback</span>
            </a>
          </div>
        </div>

        {/* Analytics Visualizations */}
        <TeamAnalyticsCharts team={team} />
      </div>
    </div>
  );
}
