'use client';

import { useState, useEffect, use } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  Sliders,
  ArrowRight,
  TrendingUp,
  Brain,
  Calendar,
  Layers,
} from 'lucide-react';
import WhatIfSimulator from '@/components/matching/WhatIfSimulator';

export default function ProjectMatchesPage({ params }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;

  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' or 'simulator'

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [projRes, matchRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`).then(r => r.json()),
          fetch(`/api/projects/${projectId}/matches`).then(r => r.json()),
        ]);

        if (projRes.project) {
          setProject(projRes.project);
        }

        if (matchRes.recommendations) {
          setRecommendations(matchRes.recommendations);
        }

        // Fetch candidates for simulator
        const meRes = await fetch('/api/skills'); // warm up
        const allCandidates = matchRes.recommendations?.flatMap(r => r.members) || [];
        // Unique candidates
        const candidateMap = new Map();
        allCandidates.forEach(c => candidateMap.set(c.id, c));
        setCandidates(Array.from(candidateMap.values()));
      } catch (err) {
        console.error('Error loading matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontWeight: '600', color: 'var(--primary)' }}>Computing explainable multi-factor matches...</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Evaluating skill coverage, availability overlap, and workload balance</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <a href="/projects" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Projects</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header Breadcrumbs & Title */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <a href="/projects">Projects</a>
            <span>/</span>
            <a href={`/projects/${projectId}`}>{project.title}</a>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Algorithmic Team Recommendations</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Intelligent Team Match Analysis
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Multi-factor recommendation engine matching candidates against project requirements, schedule overlap, and capacity.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`btn ${activeTab === 'recommendations' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '10px 18px' }}
              >
                <Brain size={16} />
                <span>Candidate Teams ({recommendations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`btn ${activeTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '10px 18px' }}
              >
                <Sliders size={16} />
                <span>What-If Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Algorithmic Recommendations */}
        {activeTab === 'recommendations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {recommendations.map((team, idx) => (
                <div key={team.id || idx} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  {/* Team Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{team.name}</h3>
                        {team.tag && <span className="badge badge-primary">{team.tag}</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Cohort of {team.members?.length || 0} students
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: team.overallScore >= 80 ? 'var(--success)' : 'var(--primary)' }}>
                        {team.overallScore}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>COMPATIBILITY</div>
                    </div>
                  </div>

                  {/* Component Sub-scores */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '6px',
                    padding: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Skills (40%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>{team.components?.skillScore}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Avail (25%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent)' }}>{team.components?.availabilityScore}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Interest (15%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>{team.components?.interestScore}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Role (10%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--warning)' }}>{team.components?.roleScore}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Load (10%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--danger)' }}>{team.components?.workloadScore}%</div>
                    </div>
                  </div>

                  {/* Member Badges */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>PROPOSED MEMBERS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {team.members?.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={m.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={m.name}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: '600' }}>{m.name}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {m.studentProfile?.department}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explainable Strengths & Warnings */}
                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '14px', fontSize: '0.8rem' }}>
                    {team.explanations?.reasons?.slice(0, 2).map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{r}</span>
                      </div>
                    ))}
                    {team.explanations?.improvements?.slice(0, 1).map((imp, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', color: 'var(--danger)', marginTop: '4px' }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Accept Recommendation Action */}
                  <div style={{ marginTop: '16px' }}>
                    <a
                      href={`/teams/team-alpha`}
                      className="btn btn-secondary"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    >
                      <span>Select Team Composition</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: What-If Team Simulator */}
        {activeTab === 'simulator' && (
          <WhatIfSimulator project={project} initialCandidates={candidates} />
        )}
      </div>
    </div>
  );
}
