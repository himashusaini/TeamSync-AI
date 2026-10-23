'use client';

import { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Sliders,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const CATEGORIES = ['ALL', 'Web Development', 'AI/ML', 'FinTech', 'IoT'];

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const url = `/api/projects?category=${selectedCategory}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [selectedCategory, search]);

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FolderKanban size={26} color="var(--primary)" />
              <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Capstone & Student Projects
              </h1>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Discover active college projects, browse required competencies, or launch algorithmic matching.
            </p>
          </div>

          <a href="/projects/new" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <Plus size={16} />
            <span>Create New Project</span>
          </a>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          backgroundColor: 'var(--bg-card)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                {cat === 'ALL' ? 'All Domains' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading student capstone projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FolderKanban size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No projects found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {projects.map(project => (
              <div
                key={project.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                }}
              >
                {/* Project Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{project.category}</span>
                  <span className={`badge ${project.status === 'RECRUITING' ? 'badge-accent' : 'badge-success'}`}>
                    {project.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: 1.3, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  <a href={`/projects/${project.id}`} style={{ hover: { color: 'var(--primary)' } }}>
                    {project.title}
                  </a>
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {project.description}
                </p>

                {/* Requirements Badges */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>REQUIRED COMPETENCIES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(project.requirements || []).slice(0, 4).map((r, i) => (
                      <span key={i} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {r.skill?.name || r.skillName} (Lvl {r.minProficiency}+)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '14px',
                  marginTop: 'auto',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} />
                    <span>Target Size: {project.expectedTeamSize}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{project.weeklyMeetingHours}h/wk sync</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  <a href={`/projects/${project.id}`} className="btn btn-secondary" style={{ fontSize: '0.825rem', padding: '8px' }}>
                    Details
                  </a>
                  <a href={`/projects/${project.id}/matches`} className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '8px' }}>
                    <Sparkles size={14} />
                    <span>Find Teams</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
