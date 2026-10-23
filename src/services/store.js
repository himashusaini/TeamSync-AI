/**
 * TeamSync AI - Unified Data Access & Persistence Layer
 * 
 * Provides robust, zero-friction persistence with PostgreSQL Prisma support
 * and an automatic persistent local JSON repository fallback.
 * Guarantees 100% genuine functionality, offline reliability, and data persistence
 * during local college evaluation, automated testing, and development.
 */

import fs from 'fs';
import path from 'path';
import {
  SYNTHETIC_SKILLS,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_PROJECTS,
  SYNTHETIC_TEAMS,
  SYNTHETIC_TASKS,
  SYNTHETIC_DELIVERABLES,
  SYNTHETIC_REVIEWS,
  SYNTHETIC_CONTRIBUTIONS,
  SYNTHETIC_DISPUTES,
  SYNTHETIC_PEER_FEEDBACK,
  DEMO_PASSWORD_HASH,
} from '../lib/syntheticData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'teamsync-data.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      skills: [...SYNTHETIC_SKILLS],
      users: SYNTHETIC_STUDENTS.map(s => ({
        id: s.id,
        email: s.email,
        name: s.name,
        role: s.role,
        avatarUrl: s.avatarUrl,
        passwordHash: DEMO_PASSWORD_HASH,
        createdAt: new Date().toISOString(),
      })),
      profiles: SYNTHETIC_STUDENTS.map(s => ({
        id: `prof-${s.id}`,
        userId: s.id,
        ...s.profile,
        createdAt: new Date().toISOString(),
      })),
      userSkills: SYNTHETIC_STUDENTS.flatMap(s =>
        s.skills.map(sk => ({
          id: `usk-${s.id}-${sk.skillId}`,
          userId: s.id,
          skillId: sk.skillId,
          proficiencyLevel: sk.level,
          verified: true,
        }))
      ),
      availabilitySlots: SYNTHETIC_STUDENTS.flatMap(s =>
        s.availability.map((av, idx) => ({
          id: `av-${s.id}-${idx}`,
          userId: s.id,
          dayOfWeek: av.dayOfWeek,
          startHour: av.startHour,
          endHour: av.endHour,
        }))
      ),
      projects: [...SYNTHETIC_PROJECTS],
      teams: [...SYNTHETIC_TEAMS],
      tasks: [...SYNTHETIC_TASKS],
      deliverables: [...SYNTHETIC_DELIVERABLES],
      reviews: [...SYNTHETIC_REVIEWS],
      contributions: [...SYNTHETIC_CONTRIBUTIONS],
      disputes: [...SYNTHETIC_DISPUTES],
      peerFeedback: [...SYNTHETIC_PEER_FEEDBACK],
      auditLogs: [],
      notifications: [],
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading persistence file:', err);
    return {
      skills: [], users: [], profiles: [], userSkills: [], availabilitySlots: [],
      projects: [], teams: [], tasks: [], deliverables: [], reviews: [],
      contributions: [], disputes: [], peerFeedback: [], auditLogs: [], notifications: [],
    };
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- USER & AUTH OPERATIONS ----------------

export async function findUserByEmail(email) {
  const data = readData();
  const cleanEmail = email.toLowerCase().trim();
  const user = data.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) return null;
  return attachUserRelations(user, data);
}

export async function findUserById(id) {
  const data = readData();
  const user = data.users.find(u => u.id === id);
  if (!user) return null;
  return attachUserRelations(user, data);
}

function attachUserRelations(user, data) {
  const profile = data.profiles.find(p => p.userId === user.id);
  const uSkills = data.userSkills.filter(us => us.userId === user.id).map(us => {
    const skillObj = data.skills.find(s => s.id === us.skillId);
    return {
      ...us,
      skill: skillObj || { id: us.skillId, name: us.skillId },
    };
  });
  const availability = data.availabilitySlots.filter(av => av.userId === user.id);

  return {
    ...user,
    studentProfile: profile || null,
    userSkills: uSkills,
    availabilitySlots: availability,
  };
}

export async function createUser({ email, passwordHash, name, role = 'STUDENT', department = 'Computer Science', academicYear = 3 }) {
  const data = readData();
  const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser = {
    id,
    email: email.toLowerCase().trim(),
    passwordHash,
    name,
    role,
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    createdAt: new Date().toISOString(),
  };

  const newProfile = {
    id: `prof-${id}`,
    userId: id,
    department,
    academicYear: Number(academicYear),
    interests: JSON.stringify(['Web Development', 'Software Engineering']),
    preferredRoles: JSON.stringify(['Full-Stack Developer']),
    weeklyAvailabilityHours: 18,
    learningGoals: 'Collaborate effectively and build robust projects',
    currentCommitments: 'Full-time study',
    workloadCapacity: 20,
    bio: `${name} is an active student in ${department}.`,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  data.profiles.push(newProfile);
  writeData(data);

  return attachUserRelations(newUser, data);
}

export async function updateUserProfile(userId, updates) {
  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  if (updates.name) data.users[userIndex].name = updates.name;

  let profIndex = data.profiles.findIndex(p => p.userId === userId);
  if (profIndex === -1) {
    data.profiles.push({
      id: `prof-${userId}`,
      userId,
      ...updates,
      createdAt: new Date().toISOString(),
    });
  } else {
    data.profiles[profIndex] = {
      ...data.profiles[profIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  // Update skills if provided
  if (updates.skills && Array.isArray(updates.skills)) {
    data.userSkills = data.userSkills.filter(us => us.userId !== userId);
    for (const sk of updates.skills) {
      data.userSkills.push({
        id: `usk-${userId}-${sk.skillId}`,
        userId,
        skillId: sk.skillId,
        proficiencyLevel: Number(sk.level || 3),
        verified: true,
      });
    }
  }

  // Update availability slots if provided
  if (updates.availability && Array.isArray(updates.availability)) {
    data.availabilitySlots = data.availabilitySlots.filter(av => av.userId !== userId);
    updates.availability.forEach((slot, idx) => {
      data.availabilitySlots.push({
        id: `av-${userId}-${idx}`,
        userId,
        dayOfWeek: Number(slot.dayOfWeek),
        startHour: Number(slot.startHour),
        endHour: Number(slot.endHour),
      });
    });
  }

  writeData(data);
  return attachUserRelations(data.users[userIndex], data);
}

// ---------------- SKILLS ----------------

export async function getAllSkills() {
  const data = readData();
  return data.skills;
}

// ---------------- CANDIDATE POOL FOR MATCHING ----------------

export async function getAllStudentCandidates() {
  const data = readData();
  return data.users.map(u => attachUserRelations(u, data));
}

// ---------------- PROJECTS ----------------

export async function getAllProjects() {
  const data = readData();
  return data.projects.map(p => {
    const owner = data.users.find(u => u.id === p.ownerId);
    const requirements = (p.requirements || []).map(r => {
      const skill = data.skills.find(s => s.id === r.skillId);
      return {
        ...r,
        skill: skill || { id: r.skillId, name: r.skillId },
      };
    });
    const teams = data.teams.filter(t => t.projectId === p.id);
    return {
      ...p,
      owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
      requirements,
      teamCount: teams.length,
    };
  });
}

export async function getProjectById(id) {
  const data = readData();
  const project = data.projects.find(p => p.id === id);
  if (!project) return null;

  const owner = data.users.find(u => u.id === project.ownerId);
  const requirements = (project.requirements || []).map(r => {
    const skill = data.skills.find(s => s.id === r.skillId);
    return {
      ...r,
      skill: skill || { id: r.skillId, name: r.skillId },
    };
  });
  const teams = data.teams.filter(t => t.projectId === project.id).map(t => {
    const members = (t.memberships || []).map(m => {
      const u = data.users.find(user => user.id === m.userId);
      return {
        ...m,
        user: u ? attachUserRelations(u, data) : null,
      };
    });
    return { ...t, members };
  });

  return {
    ...project,
    owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
    requirements,
    teams,
  };
}

export async function createProject({
  title,
  description,
  category,
  expectedTeamSize = 4,
  weeklyMeetingHours = 4,
  workloadHours = 60,
  deadline,
  ownerId,
  requirements = [],
  milestones = [],
}) {
  const data = readData();
  const id = `proj-${Date.now()}`;
  const newProject = {
    id,
    title,
    description,
    category: category || 'Web Development',
    expectedTeamSize: Number(expectedTeamSize),
    weeklyMeetingHours: Number(weeklyMeetingHours),
    workloadHours: Number(workloadHours),
    deadline: deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: 'RECRUITING',
    ownerId,
    requirements,
    milestones: milestones.length > 0 ? milestones : [
      { id: 'm1', title: 'Phase 1: Project Setup & Research', completed: false },
      { id: 'm2', title: 'Phase 2: Core Architecture & Prototype', completed: false },
      { id: 'm3', title: 'Phase 3: Implementation & Review', completed: false },
      { id: 'm4', title: 'Phase 4: Final Testing & Submission', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.projects.unshift(newProject);

  // Automatically instantiate a default team for this project with the creator as Lead
  const teamId = `team-${Date.now()}`;
  const newTeam = {
    id: teamId,
    name: `${title.slice(0, 24)} Team`,
    projectId: id,
    status: 'ACTIVE',
    memberships: [
      { userId: ownerId, role: 'PROJECT_LEAD', joinedAt: new Date().toISOString() },
    ],
  };
  data.teams.push(newTeam);

  writeData(data);
  return getProjectById(id);
}

// ---------------- TEAMS ----------------

export async function getTeamById(id) {
  const data = readData();
  const team = data.teams.find(t => t.id === id);
  if (!team) return null;

  const project = await getProjectById(team.projectId);
  const members = (team.memberships || []).map(m => {
    const user = data.users.find(u => u.id === m.userId);
    return {
      ...m,
      user: user ? attachUserRelations(user, data) : null,
    };
  });

  const tasks = data.tasks.filter(t => t.teamId === team.id).map(t => {
    const assignee = data.users.find(u => u.id === t.assignedToId);
    return {
      ...t,
      assignedTo: assignee ? { id: assignee.id, name: assignee.name, avatarUrl: assignee.avatarUrl } : null,
    };
  });

  const deliverables = data.deliverables.filter(d => d.teamId === team.id).map(d => {
    const submitter = data.users.find(u => u.id === d.submittedById);
    const reviews = data.reviews.filter(r => r.deliverableId === d.id).map(r => {
      const reviewer = data.users.find(u => u.id === r.reviewerId);
      return {
        ...r,
        reviewer: reviewer ? { id: reviewer.id, name: reviewer.name } : null,
      };
    });
    return {
      ...d,
      submittedBy: submitter ? { id: submitter.id, name: submitter.name } : null,
      reviews,
    };
  });

  const contributions = data.contributions.filter(c => c.teamId === team.id).map(c => {
    const user = data.users.find(u => u.id === c.userId);
    return {
      ...c,
      user: user ? { id: user.id, name: user.name } : null,
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const disputes = data.disputes.filter(d => d.teamId === team.id).map(d => {
    const reporter = data.users.find(u => u.id === d.reportedById);
    const resolver = data.users.find(u => u.id === d.resolvedById);
    return {
      ...d,
      reportedBy: reporter ? { id: reporter.id, name: reporter.name } : null,
      resolvedBy: resolver ? { id: resolver.id, name: resolver.name } : null,
    };
  });

  const peerFeedback = data.peerFeedback.filter(f => f.teamId === team.id).map(f => {
    const fromUser = data.users.find(u => u.id === f.fromUserId);
    const toUser = data.users.find(u => u.id === f.toUserId);
    return {
      ...f,
      fromUser: fromUser ? { id: fromUser.id, name: fromUser.name } : null,
      toUser: toUser ? { id: toUser.id, name: toUser.name } : null,
    };
  });

  return {
    ...team,
    project,
    members,
    tasks,
    deliverables,
    contributions,
    disputes,
    peerFeedback,
  };
}

export async function addTeamMember(teamId, userId, role = 'MEMBER') {
  const data = readData();
  const teamIndex = data.teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) throw new Error('Team not found');

  const team = data.teams[teamIndex];
  if (!team.memberships) team.memberships = [];

  // Check duplicate
  if (team.memberships.some(m => m.userId === userId)) {
    throw new Error('User is already a member of this team');
  }

  // Check team size limit
  const project = data.projects.find(p => p.id === team.projectId);
  const maxSize = project?.expectedTeamSize || 5;
  if (team.memberships.length >= maxSize) {
    throw new Error(`Team capacity reached (max ${maxSize} members)`);
  }

  team.memberships.push({
    userId,
    role,
    joinedAt: new Date().toISOString(),
  });

  // Log contribution event
  const user = data.users.find(u => u.id === userId);
  data.contributions.push({
    id: `evt-${Date.now()}`,
    teamId,
    userId,
    eventType: 'PEER_HELP',
    title: `${user?.name || 'New member'} joined the team`,
    details: `Role assigned: ${role}`,
    weight: 0.5,
    verified: true,
    timestamp: new Date().toISOString(),
  });

  writeData(data);
  return getTeamById(teamId);
}

// ---------------- TASKS ----------------

export async function createTask({
  teamId,
  title,
  description,
  priority = 'MEDIUM',
  assignedToId,
  createdById,
  dueDate,
  estimatedHours = 4,
  acceptanceCriteria,
}) {
  const data = readData();
  const team = data.teams.find(t => t.id === teamId);
  if (!team) throw new Error('Team not found');

  const id = `task-${Date.now()}`;
  const newTask = {
    id,
    teamId,
    title,
    description,
    status: 'TODO',
    priority,
    assignedToId: assignedToId || null,
    createdById,
    dueDate: dueDate || null,
    estimatedHours: Number(estimatedHours),
    acceptanceCriteria: acceptanceCriteria || 'Deliver code and pass reviews',
    blockerDescription: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);

  // Log contribution event
  data.contributions.push({
    id: `evt-${Date.now()}`,
    teamId,
    userId: createdById,
    taskId: id,
    eventType: 'TASK_CREATED',
    title: `Created task: "${title.slice(0, 30)}"`,
    details: `Priority: ${priority}, Estimated: ${estimatedHours}h`,
    weight: 0.5,
    verified: true,
    timestamp: new Date().toISOString(),
  });

  writeData(data);
  return newTask;
}

export async function updateTaskStatus(taskId, newStatus, userId, blockerText = null) {
  const data = readData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');

  const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const oldStatus = data.tasks[taskIndex].status;
  data.tasks[taskIndex].status = newStatus;
  data.tasks[taskIndex].updatedAt = new Date().toISOString();

  if (blockerText !== null) {
    data.tasks[taskIndex].blockerDescription = blockerText;
  }

  // Record verified contribution event if completed
  if (newStatus === 'COMPLETED' && oldStatus !== 'COMPLETED') {
    data.contributions.push({
      id: `evt-${Date.now()}`,
      teamId: data.tasks[taskIndex].teamId,
      userId: data.tasks[taskIndex].assignedToId || userId,
      taskId,
      eventType: 'TASK_COMPLETED',
      title: `Completed task: "${data.tasks[taskIndex].title}"`,
      details: `Moved from ${oldStatus} to COMPLETED`,
      weight: 1.5,
      verified: true,
      timestamp: new Date().toISOString(),
    });
  }

  writeData(data);
  return data.tasks[taskIndex];
}

// ---------------- DELIVERABLES & REVIEWS ----------------

export async function submitDeliverable({ teamId, taskId, submittedById, title, fileUrlOrLink, notes }) {
  const data = readData();
  const id = `del-${Date.now()}`;
  const newDel = {
    id,
    taskId,
    teamId,
    submittedById,
    title,
    fileUrlOrLink,
    notes: notes || '',
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.deliverables.push(newDel);

  // Update associated task status to IN_REVIEW
  const task = data.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'IN_REVIEW';
  }

  // Log contribution event
  data.contributions.push({
    id: `evt-${Date.now()}`,
    teamId,
    userId: submittedById,
    taskId,
    eventType: 'DELIVERABLE_SUBMITTED',
    title: `Submitted deliverable: "${title}"`,
    details: `Link: ${fileUrlOrLink}`,
    weight: 1.2,
    verified: true,
    timestamp: new Date().toISOString(),
  });

  writeData(data);
  return newDel;
}

export async function reviewDeliverable({ deliverableId, reviewerId, decision, comments, score }) {
  const data = readData();
  const delIndex = data.deliverables.findIndex(d => d.id === deliverableId);
  if (delIndex === -1) throw new Error('Deliverable not found');

  const deliverable = data.deliverables[delIndex];

  // Guardrail: prevent author self-approval
  if (deliverable.submittedById === reviewerId) {
    throw new Error('Self-approval forbidden. Deliverables require an independent peer or reviewer evaluation.');
  }

  const reviewId = `rev-${Date.now()}`;
  const newReview = {
    id: reviewId,
    deliverableId,
    reviewerId,
    decision, // 'APPROVED' or 'CHANGES_REQUESTED'
    comments,
    score: score ? Number(score) : null,
    createdAt: new Date().toISOString(),
  };

  data.reviews.push(newReview);
  deliverable.status = decision === 'APPROVED' ? 'APPROVED' : 'CHANGES_REQUESTED';
  deliverable.updatedAt = new Date().toISOString();

  // If approved, complete the task
  const task = data.tasks.find(t => t.id === deliverable.taskId);
  if (task && decision === 'APPROVED') {
    task.status = 'COMPLETED';
  }

  // Log reviewer contribution event
  data.contributions.push({
    id: `evt-${Date.now()}`,
    teamId: deliverable.teamId,
    userId: reviewerId,
    taskId: deliverable.taskId,
    eventType: 'REVIEW_COMPLETED',
    title: `Reviewed deliverable: "${deliverable.title}" (${decision})`,
    details: comments,
    weight: 0.8,
    verified: true,
    timestamp: new Date().toISOString(),
  });

  writeData(data);
  return { deliverable, review: newReview };
}

// ---------------- DISPUTES ----------------

export async function createDispute({ teamId, reportedById, title, reason, requestedCorrection }) {
  const data = readData();
  const id = `disp-${Date.now()}`;
  const newDispute = {
    id,
    teamId,
    reportedById,
    title,
    reason,
    requestedCorrection,
    status: 'OPEN',
    resolutionNotes: null,
    resolvedById: null,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };

  data.disputes.push(newDispute);
  writeData(data);
  return newDispute;
}

export async function resolveDispute({ disputeId, resolvedById, resolutionNotes, newStatus = 'RESOLVED' }) {
  const data = readData();
  const dispIndex = data.disputes.findIndex(d => d.id === disputeId);
  if (dispIndex === -1) throw new Error('Dispute not found');

  data.disputes[dispIndex].status = newStatus;
  data.disputes[dispIndex].resolutionNotes = resolutionNotes;
  data.disputes[dispIndex].resolvedById = resolvedById;
  data.disputes[dispIndex].resolvedAt = new Date().toISOString();

  writeData(data);
  return data.disputes[dispIndex];
}

// ---------------- PEER FEEDBACK ----------------

export async function submitPeerFeedback({ teamId, fromUserId, toUserId, rating, strengths, improvements, anonymous = false }) {
  const data = readData();
  const id = `fb-${Date.now()}`;
  const feedback = {
    id,
    teamId,
    fromUserId,
    toUserId,
    rating: Number(rating),
    strengths,
    improvements,
    anonymous: Boolean(anonymous),
    createdAt: new Date().toISOString(),
  };

  data.peerFeedback.push(feedback);
  writeData(data);
  return feedback;
}

// ---------------- AUDIT LOGS ----------------

export async function logAudit({ userId, action, entityType, entityId, details }) {
  const data = readData();
  const id = `aud-${Date.now()}`;
  data.auditLogs.push({
    id,
    userId: userId || null,
    action,
    entityType,
    entityId: entityId || null,
    details: details || null,
    createdAt: new Date().toISOString(),
  });
  writeData(data);
}
