'use client';

import { useState, useEffect, use } from 'react';
import {
  Users,
  CheckSquare,
  BarChart3,
  Scale,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Send,
  MessageSquare,
  User,
  Star,
} from 'lucide-react';

export default function TeamFeedbackPage({ params }) {
  const unwrappedParams = use(params);
  const teamId = unwrappedParams.id;

  const [team, setTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dispute form state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [dispTitle, setDispTitle] = useState('');
  const [dispReason, setDispReason] = useState('');
  const [dispCorrection, setDispCorrection] = useState('');

  // Resolution modal state
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Peer feedback form state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackToUserId, setFeedbackToUserId] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackStrengths, setFeedbackStrengths] = useState('');
  const [feedbackImprovements, setFeedbackImprovements] = useState('');

  const loadData = async () => {
    try {
      const [teamRes, meRes] = await Promise.all([
        fetch(`/api/teams/${teamId}`).then(r => r.json()),
        fetch('/api/auth/me').then(r => r.json()),
      ]);

      if (teamRes.team) setTeam(teamRes.team);
      if (meRes.user) setCurrentUser(meRes.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teamId]);

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    if (!dispTitle || !dispReason || !dispCorrection) return;

    try {
      const res = await fetch(`/api/teams/${teamId}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dispTitle,
          reason: dispReason,
          requestedCorrection: dispCorrection,
        }),
      });

      if (res.ok) {
        setShowDisputeModal(false);
        setDispTitle('');
        setDispReason('');
        setDispCorrection('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute || !resolutionNotes) return;

    try {
      const res = await fetch(`/api/teams/${teamId}/disputes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeId: selectedDispute.id,
          resolutionNotes,
          status: 'RESOLVED',
        }),
      });

      if (res.ok) {
        setSelectedDispute(null);
        setResolutionNotes('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackToUserId || !feedbackStrengths) return;

    try {
      const res = await fetch(`/api/teams/${teamId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: feedbackToUserId,
          rating: feedbackRating,
          strengths: feedbackStrengths,
          improvements: feedbackImprovements,
        }),
      });

      if (res.ok) {
        setShowFeedbackModal(false);
        setFeedbackStrengths('');
        setFeedbackImprovements('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading contribution disputes & peer feedback records...
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

  const disputes = team.disputes || [];
  const peerFeedback = team.peerFeedback || [];

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <a href="/projects">Projects</a>
          <span>/</span>
          <a href={`/teams/${team.id}`}>{team.name}</a>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Fairness & Disputes</span>
        </div>

        {/* Workspace Subnav Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {team.name} — Fairness & Dispute Resolution
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Transparent appeals channel for missing evidence, workload arbitration, and structured peer reviews.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={`/teams/${team.id}`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <Users size={16} />
              <span>Overview</span>
            </a>
            <a href={`/teams/${team.id}/tasks`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <CheckSquare size={16} />
              <span>Tasks</span>
            </a>
            <a href={`/teams/${team.id}/analytics`} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
              <BarChart3 size={16} />
              <span>Analytics</span>
            </a>
            <a href={`/teams/${team.id}/feedback`} className="btn btn-primary" style={{ padding: '9px 16px' }}>
              <Scale size={16} />
              <span>Disputes & Feedback</span>
            </a>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="btn btn-secondary"
            style={{ padding: '10px 18px' }}
          >
            <Star size={16} />
            <span>Submit Peer Review</span>
          </button>
          <button
            onClick={() => setShowDisputeModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <ShieldAlert size={16} />
            <span>File Contribution Dispute</span>
          </button>
        </div>

        {/* 2-Column: Disputes List & Peer Feedback Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          {/* Contribution Disputes Section */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Reported Disputes ({disputes.length})</h3>
              </div>
              <span className="badge badge-primary">Audited Workflow</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {disputes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No disputes filed for this team.
                </div>
              ) : (
                disputes.map(disp => (
                  <div
                    key={disp.id}
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{disp.title}</h4>
                      <span className={`badge ${disp.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                        {disp.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                      <strong>Reason:</strong> {disp.reason}
                    </p>

                    <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600' }}>Requested Correction:</span> {disp.requestedCorrection}
                    </div>

                    {disp.resolutionNotes ? (
                      <div style={{ padding: '8px 12px', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--success)' }}>
                        <span style={{ fontWeight: '700' }}>Resolution:</span> {disp.resolutionNotes}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedDispute(disp)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%', marginTop: '6px' }}
                      >
                        Mediate & Record Resolution
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Peer Feedback Section */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} color="var(--warning)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Peer Feedback ({peerFeedback.length})</h3>
              </div>
              <span className="badge badge-accent">360° Review</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {peerFeedback.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No peer feedback submitted yet.
                </div>
              ) : (
                peerFeedback.map(fb => (
                  <div
                    key={fb.id}
                    style={{
                      padding: '16px',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                        To: {fb.toUser?.name || 'Teammate'}
                      </div>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        {Array.from({ length: fb.rating || 5 }).map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--success)' }}>Strengths:</strong> {fb.strengths}
                    </div>

                    {fb.improvements && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <strong>Suggestions:</strong> {fb.improvements}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MODAL: File Dispute */}
        {showDisputeModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldAlert size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>File Contribution Dispute</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Appeal missing work records, overdue deliverable reviews, or workload distribution inequities.
              </p>

              <form onSubmit={handleCreateDispute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Subject / Dispute Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uncredited architecture design session"
                    value={dispTitle}
                    onChange={e => setDispTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Detailed Explanation & Evidence *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe dates, deliverables, or missing peer reviews..."
                    value={dispReason}
                    onChange={e => setDispReason(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Requested Resolution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Credit 2 hours verified contribution event"
                    value={dispCorrection}
                    onChange={e => setDispCorrection(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                  <button type="button" onClick={() => setShowDisputeModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">File Dispute</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Mediate Dispute */}
        {selectedDispute && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Record Dispute Mediation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Dispute: <strong>{selectedDispute.title}</strong>
              </p>

              <form onSubmit={handleResolveDispute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Mediation Decision & Notes *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Document resolution reasoning and any adjustments applied to team metrics..."
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                  <button type="button" onClick={() => setSelectedDispute(null)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Resolve & Close Dispute</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Submit Peer Review */}
        {showFeedbackModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Submit Teammate Peer Review</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Constructive peer assessments are factored into collaboration analytics and team health.
              </p>

              <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Teammate</label>
                  <select
                    value={feedbackToUserId}
                    onChange={e => setFeedbackToUserId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="">Select team member...</option>
                    {(team.members || []).map(m => (
                      <option key={m.userId} value={m.userId}>{m.user?.name || m.userId} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Rating (1 - 5 Stars)</label>
                  <select
                    value={feedbackRating}
                    onChange={e => setFeedbackRating(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Exceptional (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ Strong Contributor (4/5)</option>
                    <option value="3">⭐⭐⭐ Meets Expectations (3/5)</option>
                    <option value="2">⭐⭐ Needs Improvement (2/5)</option>
                    <option value="1">⭐ Unsatisfactory (1/5)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Key Strengths *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Highlight technical contributions, communication, or problem solving..."
                    value={feedbackStrengths}
                    onChange={e => setFeedbackStrengths(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Suggested Growth Areas</label>
                  <textarea
                    rows="2"
                    placeholder="Constructive ideas for sprint improvements..."
                    value={feedbackImprovements}
                    onChange={e => setFeedbackImprovements(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                  <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Peer Review</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
