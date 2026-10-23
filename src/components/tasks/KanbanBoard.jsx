'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  FileCheck,
  ExternalLink,
  User,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function KanbanBoard({ team, currentUser, onRefresh }) {
  const [tasks, setTasks] = useState(team.tasks || []);
  const [deliverables, setDeliverables] = useState(team.deliverables || []);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [selectedTaskForDel, setSelectedTaskForDel] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDeliverableForReview, setSelectedDeliverableForReview] = useState(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState(team.members?.[0]?.userId || '');
  const [newTaskHours, setNewTaskHours] = useState(6);
  const [newTaskCriteria, setNewTaskCriteria] = useState('');

  // Deliverable form state
  const [delTitle, setDelTitle] = useState('');
  const [delUrl, setDelUrl] = useState('');
  const [delNotes, setDelNotes] = useState('');

  // Review form state
  const [reviewDecision, setReviewDecision] = useState('APPROVED');
  const [reviewComments, setReviewComments] = useState('');
  const [reviewScore, setReviewScore] = useState(10);
  const [reviewError, setReviewError] = useState('');

  const COLUMNS = [
    { key: 'TODO', title: 'To Do', color: 'var(--text-muted)' },
    { key: 'IN_PROGRESS', title: 'In Progress', color: 'var(--primary)' },
    { key: 'IN_REVIEW', title: 'In Review', color: 'var(--warning)' },
    { key: 'COMPLETED', title: 'Completed', color: 'var(--success)' },
  ];

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      const res = await fetch(`/api/teams/${team.id}/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Status transition failed:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      const res = await fetch(`/api/teams/${team.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          assignedToId: newTaskAssignee,
          estimatedHours: newTaskHours,
          acceptanceCriteria: newTaskCriteria,
        }),
      });

      if (res.ok) {
        setShowNewTaskModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        onRefresh();
      }
    } catch (err) {
      console.error('Create task error:', err);
    }
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!delTitle || !delUrl || !selectedTaskForDel) return;

    try {
      const res = await fetch(`/api/teams/${team.id}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTaskForDel.id,
          title: delTitle,
          fileUrlOrLink: delUrl,
          notes: delNotes,
        }),
      });

      if (res.ok) {
        setShowDeliverableModal(false);
        setDelTitle('');
        setDelUrl('');
        setDelNotes('');
        setSelectedTaskForDel(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Deliverable submit failed:', err);
    }
  };

  const handleReviewDeliverable = async (e) => {
    e.preventDefault();
    setReviewError('');

    try {
      const res = await fetch(`/api/teams/${team.id}/deliverables`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableId: selectedDeliverableForReview.id,
          decision: reviewDecision,
          comments: reviewComments,
          score: reviewScore,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || 'Review failed');
        return;
      }

      setShowReviewModal(false);
      setReviewComments('');
      setSelectedDeliverableForReview(null);
      onRefresh();
    } catch (err) {
      setReviewError(err.message || 'Review failed');
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Kanban Task & Milestone Execution</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Track assigned work, attach deliverable proof, and complete independent peer reviews.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="btn btn-primary"
          style={{ padding: '10px 18px' }}
        >
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </div>

      {/* 4-Column Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        alignItems: 'start',
      }}>
        {COLUMNS.map(col => {
          const colTasks = (team.tasks || []).filter(t => t.status === col.key);

          return (
            <div
              key={col.key}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-light)',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }}></div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{col.title}</h3>
                </div>
                <span className="badge badge-secondary" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {colTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map(task => {
                    const assignee = (team.members || []).find(m => m.userId === task.assignedToId)?.user;
                    const taskDeliverable = (team.deliverables || []).find(d => d.taskId === task.id);

                    return (
                      <div
                        key={task.id}
                        className="card"
                        style={{
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {/* Task Priority & Title */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span className={`badge ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                              {task.priority}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.estimatedHours}h est.</span>
                          </div>
                          <h4 style={{ fontSize: '0.925rem', fontWeight: '600', lineHeight: 1.35 }}>{task.title}</h4>
                        </div>

                        {task.description && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {task.description}
                          </p>
                        )}

                        {/* Acceptance Criteria */}
                        {task.acceptanceCriteria && (
                          <div style={{ padding: '6px 10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: '600' }}>Acceptance:</span> {task.acceptanceCriteria}
                          </div>
                        )}

                        {/* Assignee & Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <User size={13} color="var(--primary)" />
                            <span>{assignee ? assignee.name.split(' ')[0] : 'Unassigned'}</span>
                          </div>

                          {/* Quick Status Transition Buttons */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {task.status === 'TODO' && (
                              <button
                                onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                title="Start task"
                              >
                                <span>Start</span>
                              </button>
                            )}

                            {task.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => {
                                  setSelectedTaskForDel(task);
                                  setShowDeliverableModal(true);
                                }}
                                className="btn btn-primary"
                                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                title="Submit deliverable"
                              >
                                <Send size={12} />
                                <span>Submit</span>
                              </button>
                            )}

                            {task.status === 'IN_REVIEW' && taskDeliverable && (
                              <button
                                onClick={() => {
                                  setSelectedDeliverableForReview(taskDeliverable);
                                  setShowReviewModal(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--warning)' }}
                                title="Review deliverable"
                              >
                                <FileCheck size={12} />
                                <span>Review</span>
                              </button>
                            )}

                            {task.status === 'COMPLETED' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--success)', fontSize: '0.75rem', fontWeight: '600' }}>
                                <CheckCircle2 size={13} />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Create Task */}
      {showNewTaskModal && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Create Project Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dockerfile and compose network"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Explain requirements and technical approach"
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Estimated Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Assignee</label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                >
                  <option value="">Unassigned</option>
                  {(team.members || []).map(m => (
                    <option key={m.userId} value={m.userId}>{m.user?.name || m.userId} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Acceptance Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. Unit tests pass with 90%+ coverage, PR approved"
                  value={newTaskCriteria}
                  onChange={e => setNewTaskCriteria(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowNewTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Submit Deliverable */}
      {showDeliverableModal && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>Submit Work Deliverable</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Submitting for: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{selectedTaskForDel?.title}</span>
            </p>

            <form onSubmit={handleSubmitDeliverable} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Deliverable Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PR #25: Docker compose and container optimization"
                  value={delTitle}
                  onChange={e => setDelTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Evidence URL / PR Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo/pull/25"
                  value={delUrl}
                  onChange={e => setDelUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Submission Notes & Proof</label>
                <textarea
                  rows="3"
                  placeholder="Summarize changes and tests performed"
                  value={delNotes}
                  onChange={e => setDelNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowDeliverableModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit for Peer Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Independent Peer Review */}
      {showReviewModal && (
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Independent Peer Review</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Deliverable: <span style={{ fontWeight: '600' }}>{selectedDeliverableForReview?.title}</span>
            </p>

            {reviewError && (
              <div style={{ padding: '10px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '14px' }}>
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewDeliverable} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Evaluation Decision</label>
                <select
                  value={reviewDecision}
                  onChange={e => setReviewDecision(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                >
                  <option value="APPROVED">Approve & Verify Deliverable</option>
                  <option value="CHANGES_REQUESTED">Request Revisions & Corrections</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Review Feedback & Comments *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe your assessment against acceptance criteria"
                  value={reviewComments}
                  onChange={e => setReviewComments(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Quality Rating (1 - 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reviewScore}
                  onChange={e => setReviewScore(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Sign & Record Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
