'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [expectedTeamSize, setExpectedTeamSize] = useState(4);
  const [weeklyMeetingHours, setWeeklyMeetingHours] = useState(4);
  const [workloadHours, setWorkloadHours] = useState(60);
  const [deadline, setDeadline] = useState('2026-11-08');

  const [availableSkills, setAvailableSkills] = useState([]);
  const [requirements, setRequirements] = useState([
    { skillId: 'sk-nextjs', minProficiency: 3, roleName: 'Frontend Lead', isRequired: true },
    { skillId: 'sk-postgres', minProficiency: 3, roleName: 'Backend & DB Lead', isRequired: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (data.skills) setAvailableSkills(data.skills);
      })
      .catch(console.error);
  }, []);

  const addRequirement = () => {
    const defaultSkill = availableSkills[0]?.id || 'sk-react';
    setRequirements([
      ...requirements,
      { skillId: defaultSkill, minProficiency: 3, roleName: 'Engineer', isRequired: true },
    ]);
  };

  const removeRequirement = (idx) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const updateRequirement = (idx, field, val) => {
    const updated = [...requirements];
    updated[idx][field] = val;
    setRequirements(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          expectedTeamSize: Number(expectedTeamSize),
          weeklyMeetingHours: Number(weeklyMeetingHours),
          workloadHours: Number(workloadHours),
          deadline: new Date(deadline).toISOString(),
          requirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setLoading(false);
        return;
      }

      // Route immediately to algorithmic matches
      router.push(`/projects/${data.project.id}/matches`);
    } catch (err) {
      setError(err.message || 'Submission failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <a href="/projects">Projects</a>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>New Project</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Define Capstone Project
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Set team requirements, skill criteria, and workload expectations for algorithmic candidate matching.
          </p>
        </div>

        {error && (
          <div style={{ padding: '14px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)', marginBottom: '24px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. HealthPulse: Predictive Patient Health Monitor"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Project Description *</label>
            <textarea
              required
              rows="4"
              placeholder="Detail the technical objectives, intended architecture, and key problem statement..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Domain Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
              >
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="FinTech">FinTech & Web3</option>
                <option value="IoT">IoT & Embedded Systems</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Expected Team Size</label>
              <input
                type="number"
                min="2"
                max="8"
                value={expectedTeamSize}
                onChange={e => setExpectedTeamSize(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Weekly Sync (hrs)</label>
              <input
                type="number"
                min="1"
                max="15"
                value={weeklyMeetingHours}
                onChange={e => setWeeklyMeetingHours(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Total Workload (hrs)</label>
              <input
                type="number"
                min="20"
                max="200"
                value={workloadHours}
                onChange={e => setWorkloadHours(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Project Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
              />
            </div>
          </div>

          {/* Required Skills & Competencies List */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Required Competencies & Roles</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>The matching engine uses these to calculate Skill Coverage (S) and Role Coverage (R)</p>
              </div>

              <button
                type="button"
                onClick={addRequirement}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr auto',
                    gap: '10px',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <select
                    value={req.skillId}
                    onChange={e => updateRequirement(idx, 'skillId', e.target.value)}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    {availableSkills.map(sk => (
                      <option key={sk.id} value={sk.id}>{sk.name} ({sk.category})</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Role (e.g. Lead, Designer)"
                    value={req.roleName}
                    onChange={e => updateRequirement(idx, 'roleName', e.target.value)}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  />

                  <select
                    value={req.minProficiency}
                    onChange={e => updateRequirement(idx, 'minProficiency', Number(e.target.value))}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="1">Lvl 1 (Beginner)</option>
                    <option value="2">Lvl 2 (Novice)</option>
                    <option value="3">Lvl 3 (Competent)</option>
                    <option value="4">Lvl 4 (Proficient)</option>
                    <option value="5">Lvl 5 (Expert)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    style={{ color: 'var(--danger)', padding: '6px', cursor: 'pointer' }}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <a href="/projects" className="btn btn-secondary">Cancel</a>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Creating & Matching...' : 'Publish & Compute Team Matches'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
