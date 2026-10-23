'use client';

import { useState, useEffect, use } from 'react';
import {
  FolderKanban,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function ProjectDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) setProject(data.project);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <a href="/projects" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Projects</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <a href="/projects">Projects</a>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{project.title}</span>
        </div>

        {/* Project Header Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-primary">{project.category}</span>
                <span className="badge badge-success">{project.status}</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
                {project.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '850px' }}>
                {project.description}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href={`/projects/${project.id}/matches`} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <Sparkles size={18} />
                <span>Find Matched Teams</span>
              </a>
              {project.teams?.length > 0 && (
                <a href={`/teams/${project.teams[0].id}`} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  <Users size={18} />
                  <span>Open Active Workspace</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Target Team Size</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '2px' }}>{project.expectedTeamSize} Students</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Weekly Sync Schedule</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '2px' }}>{project.weeklyMeetingHours} Hours / Week</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Estimated Workload</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '2px' }}>{project.workloadHours} Total Hours</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Submission Deadline</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '2px' }}>{new Date(project.deadline).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Requirements & Milestones 2-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Required Skills & Proficiency Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px' }}>Required Competencies & Roles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(project.requirements || []).map((req, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{req.skill?.name || req.skillName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {req.roleName || 'Engineer'}</div>
                  </div>
                  <span className="badge badge-primary">
                    Min Proficiency: Lvl {req.minProficiency}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Milestones Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px' }}>Project Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(() => {
                let ms = [];
                if (typeof project.milestones === 'string') {
                  try { ms = JSON.parse(project.milestones); } catch { ms = []; }
                } else if (Array.isArray(project.milestones)) {
                  ms = project.milestones;
                }
                return ms.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: m.completed ? 'var(--success)' : 'var(--text-muted)' }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{m.title}</div>
                      {m.dueDate && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {m.dueDate}</div>}
                    </div>
                    <span className={`badge ${m.completed ? 'badge-success' : 'badge-secondary'}`}>
                      {m.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
