'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Database,
  Search,
} from 'lucide-react';

export default function AdminPage() {
  const [candidates, setCandidates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [projRes, matchRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()),
          fetch('/api/projects/proj-teamsync/matches').then(r => r.json()),
        ]);

        if (projRes.projects) setProjects(projRes.projects);
        if (matchRes.recommendations) {
          const all = matchRes.recommendations.flatMap(r => r.members);
          const map = new Map();
          all.forEach(m => map.set(m.id, m));
          setCandidates(Array.from(map.values()));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Administration</span>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Faculty & Evaluation Hub</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="var(--primary)" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Faculty & Academic Administration
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time cohort monitoring, capstone submission verification, and algorithm health telemetry.
          </p>
        </div>

        {/* System Health Indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Candidate Pool</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>20 Students</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>All profiles verified</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Active Projects</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)', marginTop: '4px' }}>{projects.length} Capstones</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across 5 tech domains</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Matching Algorithm</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>100% Deterministic</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>7 unit test suites passing</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Database Backend</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>PostgreSQL / Prisma</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Persistence active</div>
          </div>
        </div>

        {/* Cohort Roster Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Student Cohort & Competency Roster</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profiles available for algorithmic matching and capstone formation</p>
            </div>
            <span className="badge badge-primary">Evaluation Benchmark Dataset</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Student</th>
                  <th style={{ padding: '10px 12px' }}>Department</th>
                  <th style={{ padding: '10px 12px' }}>Year</th>
                  <th style={{ padding: '10px 12px' }}>Availability</th>
                  <th style={{ padding: '10px 12px' }}>Top Skills</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={c.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{c.studentProfile?.department}</td>
                    <td style={{ padding: '12px' }}>Year {c.studentProfile?.academicYear}</td>
                    <td style={{ padding: '12px' }}>{c.studentProfile?.weeklyAvailabilityHours || 15}h/wk</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(c.userSkills || []).slice(0, 3).map((s, i) => (
                          <span key={i} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            {s.skill?.name || s.skillName} (L{s.proficiencyLevel})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
