'use client';

import { useState, useEffect } from 'react';
import {
  Sliders,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldAlert,
} from 'lucide-react';
import { DEFAULT_WEIGHTS, evaluateTeamMatch } from '@/services/matching';

export default function WhatIfSimulator({ project, initialCandidates = [] }) {
  const [weights, setWeights] = useState({
    skills: 40,
    availability: 25,
    interest: 15,
    role: 10,
    workload: 10,
  });

  const [selectedMemberIds, setSelectedMemberIds] = useState(
    initialCandidates.slice(0, project?.expectedTeamSize || 4).map(c => c.id)
  );

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weightWarning, setWeightWarning] = useState('');

  // Validate weights sum to 100
  const totalWeight = Number(weights.skills) + Number(weights.availability) + Number(weights.interest) + Number(weights.role) + Number(weights.workload);

  // Recalculate match when members or weights change
  useEffect(() => {
    if (totalWeight !== 100) {
      setWeightWarning(`Weights must sum to 100%. Current total: ${totalWeight}%`);
      return;
    }
    setWeightWarning('');

    const normalizedWeights = {
      skills: weights.skills / 100,
      availability: weights.availability / 100,
      interest: weights.interest / 100,
      role: weights.role / 100,
      workload: weights.workload / 100,
    };

    const chosenMembers = initialCandidates.filter(c => selectedMemberIds.includes(c.id));

    try {
      const res = evaluateTeamMatch(project, chosenMembers, normalizedWeights);
      setEvaluation(res);
    } catch (err) {
      console.error('Calculation error:', err);
    }
  }, [weights, selectedMemberIds, initialCandidates, project]);

  const handleSliderChange = (field, val) => {
    setWeights(prev => ({ ...prev, [field]: Number(val) }));
  };

  const toggleMember = (id) => {
    if (selectedMemberIds.includes(id)) {
      if (selectedMemberIds.length <= 1) {
        alert('A team must have at least 1 member');
        return;
      }
      setSelectedMemberIds(selectedMemberIds.filter(mId => mId !== id));
    } else {
      if (selectedMemberIds.length >= (project?.expectedTeamSize || 4) + 1) {
        alert(`Maximum simulation capacity reached (${(project?.expectedTeamSize || 4) + 1} candidates max)`);
        return;
      }
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const resetWeights = () => {
    setWeights({
      skills: 40,
      availability: 25,
      interest: 15,
      role: 10,
      workload: 10,
    });
  };

  const selectedMembers = initialCandidates.filter(c => selectedMemberIds.includes(c.id));
  const unselectedCandidates = initialCandidates.filter(c => !selectedMemberIds.includes(c.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Simulator Control Header */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sliders size={22} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Interactive What-If Team Simulator</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Dynamically adjust multi-factor component weights and swap candidates to observe algorithmic score changes in real time.
            </p>
          </div>

          <button onClick={resetWeights} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <RefreshCw size={14} />
            <span>Reset Default Formula</span>
          </button>
        </div>

        {/* Weight Warning */}
        {weightWarning && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--danger-border)',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}>
            <AlertTriangle size={16} />
            <span>{weightWarning}</span>
          </div>
        )}

        {/* Sliders Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '16px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Skill Coverage (S)</span>
              <span style={{ color: 'var(--primary)' }}>{weights.skills}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.skills}
              onChange={(e) => handleSliderChange('skills', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Availability (A)</span>
              <span style={{ color: 'var(--accent)' }}>{weights.availability}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.availability}
              onChange={(e) => handleSliderChange('availability', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Interest Alignment (I)</span>
              <span style={{ color: 'var(--success)' }}>{weights.interest}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.interest}
              onChange={(e) => handleSliderChange('interest', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--success)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Role Coverage (R)</span>
              <span style={{ color: 'var(--warning)' }}>{weights.role}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.role}
              onChange={(e) => handleSliderChange('role', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--warning)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Workload Capacity (W)</span>
              <span style={{ color: 'var(--danger)' }}>{weights.workload}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.workload}
              onChange={(e) => handleSliderChange('workload', e.target.value)}
              style={{ width: '100%', accentColor: 'var(--danger)' }}
            />
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport: Live Score + Members */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Live Algorithmic Match Score & Components */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Calculated Synergy Score
            </span>
            <span className="badge badge-primary">
              Formula: {weights.skills}S + {weights.availability}A + {weights.interest}I + {weights.role}R + {weights.workload}W
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              fontSize: '3.6rem',
              fontWeight: '900',
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {evaluation?.overallScore || 0}%
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: (evaluation?.overallScore || 0) >= 75 ? 'var(--success)' : 'var(--warning)' }}>
                {(evaluation?.overallScore || 0) >= 85 ? 'Outstanding Team Synergy' : (evaluation?.overallScore || 0) >= 70 ? 'Viable Balanced Composition' : 'Potential Capability Gaps'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Team Size: {selectedMembers.length} of {project?.expectedTeamSize || 4} recommended
              </div>
            </div>
          </div>

          {/* Component Progress Meters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Skill Coverage (S)</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{evaluation?.components?.skillScore || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${evaluation?.components?.skillScore || 0}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Availability Compatibility (A)</span>
                <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{evaluation?.components?.availabilityScore || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${evaluation?.components?.availabilityScore || 0}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Interest Alignment (I)</span>
                <span style={{ color: 'var(--success)', fontWeight: '700' }}>{evaluation?.components?.interestScore || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${evaluation?.components?.interestScore || 0}%`, height: '100%', background: 'var(--success)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Role Coverage (R)</span>
                <span style={{ color: 'var(--warning)', fontWeight: '700' }}>{evaluation?.components?.roleScore || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${evaluation?.components?.roleScore || 0}%`, height: '100%', background: 'var(--warning)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Workload Capacity (W)</span>
                <span style={{ color: 'var(--danger)', fontWeight: '700' }}>{evaluation?.components?.workloadScore || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${evaluation?.components?.workloadScore || 0}%`, height: '100%', background: 'var(--danger)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          </div>

          {/* Explainable Reasons & Suggested Improvements */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Explainable Match Rationale
            </h4>

            {evaluation?.explanations?.reasons?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {evaluation.explanations.reasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {evaluation?.explanations?.improvements?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {evaluation.explanations.improvements.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.825rem', color: 'var(--danger)' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Simulated Team Members & Candidate Pool */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Simulated Members */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Active Simulated Team ({selectedMembers.length})</h3>
              </div>
              <span className="badge badge-accent">Selected for Evaluation</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedMembers.map(member => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={member.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {member.studentProfile?.department} • Yr {member.studentProfile?.academicYear} • {member.studentProfile?.weeklyAvailabilityHours || 15}h/wk
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMember(member.id)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                    title="Remove from simulated team"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Candidates Pool to Add */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Candidate Pool ({unselectedCandidates.length} available)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to swap into simulation</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
              {unselectedCandidates.slice(0, 8).map(candidate => (
                <div
                  key={candidate.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={candidate.name}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.825rem' }}>{candidate.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Skills: {(candidate.userSkills || []).slice(0, 3).map(s => s.skill?.name || s.skillName).join(', ')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMember(candidate.id)}
                    className="btn btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
