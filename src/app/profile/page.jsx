'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState(3);
  const [weeklyAvailabilityHours, setWeeklyAvailabilityHours] = useState(18);
  const [workloadCapacity, setWorkloadCapacity] = useState(20);
  const [bio, setBio] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [currentCommitments, setCurrentCommitments] = useState('');
  const [interestsText, setInterestsText] = useState('Web Development, AI/ML, Cloud');
  const [preferredRolesText, setPreferredRolesText] = useState('Full-Stack Developer, Project Lead');

  // User skills
  const [skills, setSkills] = useState([]);

  // Weekly availability slots: [{ dayOfWeek: 1, startHour: 14, endHour: 18 }]
  const [availability, setAvailability] = useState([]);

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, skillsRes] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()),
          fetch('/api/skills').then(r => r.json()),
        ]);

        if (skillsRes.skills) setAllSkills(skillsRes.skills);

        if (meRes.authenticated && meRes.user) {
          const u = meRes.user;
          setUser(u);
          setName(u.name || '');

          const p = u.studentProfile || {};
          setDepartment(p.department || 'Computer Science');
          setAcademicYear(p.academicYear || 3);
          setWeeklyAvailabilityHours(p.weeklyAvailabilityHours || 18);
          setWorkloadCapacity(p.workloadCapacity || 20);
          setBio(p.bio || '');
          setLearningGoals(p.learningGoals || '');
          setCurrentCommitments(p.currentCommitments || '');

          if (p.interests) {
            try {
              const parsed = JSON.parse(p.interests);
              setInterestsText(Array.isArray(parsed) ? parsed.join(', ') : p.interests);
            } catch {
              setInterestsText(p.interests);
            }
          }

          if (p.preferredRoles) {
            try {
              const parsed = JSON.parse(p.preferredRoles);
              setPreferredRolesText(Array.isArray(parsed) ? parsed.join(', ') : p.preferredRoles);
            } catch {
              setPreferredRolesText(p.preferredRoles);
            }
          }

          if (u.userSkills) {
            setSkills(u.userSkills.map(us => ({
              skillId: us.skillId,
              level: us.proficiencyLevel || 3,
            })));
          }

          if (u.availabilitySlots) {
            setAvailability(u.availabilitySlots.map(a => ({
              dayOfWeek: a.dayOfWeek,
              startHour: a.startHour,
              endHour: a.endHour,
            })));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddSkill = () => {
    const available = allSkills.find(s => !skills.some(sk => sk.skillId === s.id));
    if (available) {
      setSkills([...skills, { skillId: available.id, level: 3 }]);
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSkills(skills.filter(s => s.skillId !== skillId));
  };

  const handleSkillLevelChange = (skillId, level) => {
    setSkills(skills.map(s => s.skillId === skillId ? { ...s, level: Number(level) } : s));
  };

  const handleAddSlot = () => {
    setAvailability([...availability, { dayOfWeek: 1, startHour: 14, endHour: 18 }]);
  };

  const handleRemoveSlot = (idx) => {
    setAvailability(availability.filter((_, i) => i !== idx));
  };

  const handleSlotChange = (idx, field, val) => {
    const updated = [...availability];
    updated[idx][field] = Number(val);
    setAvailability(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      const interestsArray = interestsText.split(',').map(s => s.trim()).filter(Boolean);
      const rolesArray = preferredRolesText.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          department,
          academicYear: Number(academicYear),
          weeklyAvailabilityHours: Number(weeklyAvailabilityHours),
          workloadCapacity: Number(workloadCapacity),
          bio,
          learningGoals,
          currentCommitments,
          interests: JSON.stringify(interestsArray),
          preferredRoles: JSON.stringify(rolesArray),
          skills,
          availability,
        }),
      });

      if (res.ok) {
        setSuccessMessage('Profile and competency credentials successfully updated!');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading student competency profile...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Account</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Student Competency Profile</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Competency & Availability Profile
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              These attributes are evaluated directly by TeamSync AI to match you with compatible capstone cohorts.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '10px 20px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}>
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* General Information Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '18px' }}>Academic & Personal Background</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Academic Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={e => setAcademicYear(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="1">Year 1 (Freshman)</option>
                    <option value="2">Year 2 (Sophomore)</option>
                    <option value="3">Year 3 (Junior)</option>
                    <option value="4">Year 4 (Senior / Final)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Short Introduction & Bio</label>
                <textarea
                  rows="3"
                  placeholder="Summarize your background, interests, and collaborative strengths..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>
            </div>
          </div>

          {/* Technical Skills & Proficiencies */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Skills & Proficiencies (Factor S: 40%)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assessed for Skill Coverage (S) and peer mentoring optimization</p>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {skills.map(sk => {
                const skillObj = allSkills.find(s => s.id === sk.skillId);
                return (
                  <div
                    key={sk.skillId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{skillObj?.name || sk.skillId}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skillObj?.category}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={sk.level}
                        onChange={e => handleSkillLevelChange(sk.skillId, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.8rem' }}
                      >
                        <option value="1">Lvl 1 (Beginner)</option>
                        <option value="2">Lvl 2 (Novice)</option>
                        <option value="3">Lvl 3 (Competent)</option>
                        <option value="4">Lvl 4 (Proficient)</option>
                        <option value="5">Lvl 5 (Expert)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.skillId)}
                        style={{ color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Availability Schedule Grid */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Weekly Availability Schedule (Factor A: 25%)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluated to determine shared overlap sync hours with teammates</p>
              </div>

              <button
                type="button"
                onClick={handleAddSlot}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availability.map((slot, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1.5fr auto',
                    gap: '10px',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <select
                    value={slot.dayOfWeek}
                    onChange={e => handleSlotChange(idx, 'dayOfWeek', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    {DAYS.map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={slot.startHour}
                    onChange={e => handleSlotChange(idx, 'startHour', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>

                  <select
                    value={slot.endHour}
                    onChange={e => handleSlotChange(idx, 'endHour', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h + 1} value={h + 1}>{h + 1}:00</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    style={{ color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                    title="Remove slot"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interests, Roles & Workload Capacity */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '18px' }}>Project Preferences & Capacity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                  Project Domain Interests (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Web Development, AI/ML, FinTech, Robotics"
                  value={interestsText}
                  onChange={e => setInterestsText(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                  Preferred Roles (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Lead, Frontend Lead, Backend Developer, UI/UX Designer"
                  value={preferredRolesText}
                  onChange={e => setPreferredRolesText(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Weekly Availability (hrs/wk)</label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={weeklyAvailabilityHours}
                    onChange={e => setWeeklyAvailabilityHours(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Max Workload Capacity (hrs/wk)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={workloadCapacity}
                    onChange={e => setWorkloadCapacity(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Current External Commitments</label>
                <input
                  type="text"
                  placeholder="e.g. 2 courses, part-time TA (prevents overload warnings in matching)"
                  value={currentCommitments}
                  onChange={e => setCurrentCommitments(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
