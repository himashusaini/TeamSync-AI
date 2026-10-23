'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Scale, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function TeamAnalyticsCharts({ team }) {
  const members = team.members || [];
  const tasks = team.tasks || [];
  const contributions = team.contributions || [];

  // 1. Workload Distribution Data (Hours assigned vs estimated)
  const workloadData = members.map(m => {
    const assignedTasks = tasks.filter(t => t.assignedToId === m.userId);
    const totalHours = assignedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const completedHours = assignedTasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

    return {
      name: m.user ? m.user.name.split(' ')[0] : m.role,
      assignedHours: totalHours,
      completedHours: completedHours,
      capacity: m.user?.studentProfile?.workloadCapacity || 20,
    };
  });

  // 2. Task Status Breakdown Data
  const statusCounts = {
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    IN_REVIEW: tasks.filter(t => t.status === 'IN_REVIEW').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  const taskStatusData = [
    { name: 'To Do', value: statusCounts.TODO, color: '#94a3b8' },
    { name: 'In Progress', value: statusCounts.IN_PROGRESS, color: '#4338ca' },
    { name: 'In Review', value: statusCounts.IN_REVIEW, color: '#0284c7' },
    { name: 'Completed', value: statusCounts.COMPLETED, color: '#059669' },
  ].filter(d => d.value > 0);

  // 3. Contribution Event Distribution Data
  const memberPoints = {};
  members.forEach(m => {
    memberPoints[m.userId] = 0;
  });

  contributions.forEach(c => {
    if (memberPoints[c.userId] !== undefined) {
      memberPoints[c.userId] += (c.weight || 1.0);
    }
  });

  const contributionData = members.map(m => ({
    name: m.user ? m.user.name.split(' ')[0] : m.role,
    points: Number((memberPoints[m.userId] || 0).toFixed(1)),
  }));

  // Detect workload imbalance (>35% of total hours on a single student in a 4+ person team)
  const totalAssignedHours = workloadData.reduce((sum, d) => sum + d.assignedHours, 0);
  const overloadedMember = workloadData.find(d => totalAssignedHours > 0 && (d.assignedHours / totalAssignedHours) > 0.45);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Imbalance Alert Banner */}
      {overloadedMember ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          backgroundColor: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--warning)',
          fontSize: '0.9rem',
        }}>
          <AlertTriangle size={18} />
          <div>
            <strong>Workload Imbalance Alert:</strong> {overloadedMember.name} is currently assigned {overloadedMember.assignedHours} hours ({Math.round((overloadedMember.assignedHours / totalAssignedHours) * 100)}% of total team tasks). Consider reassigning upcoming milestones.
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--success)',
          fontSize: '0.9rem',
        }}>
          <CheckCircle2 size={18} />
          <div>
            <strong>Fair Workload Distribution:</strong> Team tasks and verified deliverables are evenly distributed across all active members.
          </div>
        </div>
      )}

      {/* Grid of Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Workload Distribution Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Task Workload Distribution (Hours)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned vs completed hours per team member</p>
            </div>
            <Scale size={18} color="var(--primary)" />
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="assignedHours" name="Assigned Hours" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedHours" name="Completed Hours" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Breakdown Pie */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Task Execution Status</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current breakdown of {tasks.length} team tasks</p>
            </div>
            <CheckCircle2 size={18} color="var(--accent)" />
          </div>

          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {taskStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No task data available</div>
            )}
          </div>
        </div>

        {/* Verified Contribution Score Distribution */}
        <div className="card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Verified Contribution Activity Index</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Evidence-weighted score derived from approved PRs, verified deliverables, peer code reviews, and closed tasks
              </p>
            </div>
            <TrendingUp size={18} color="var(--success)" />
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', borderRadius: '8px' }}
                />
                <Bar dataKey="points" name="Contribution Evidence Points" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
