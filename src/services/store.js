/**
 * TeamSync AI - Unified Data Access & Dual Persistence Layer
 * 
 * Supports both PostgreSQL via Prisma and a resilient JSON fallback storage.
 * - When DATABASE_URL is provided, seamlessly reads and writes through PostgreSQL with Prisma ORM.
 * - In serverless environments (like Vercel read-only filesystem) without DATABASE_URL,
 *   safely reads bundled seed data and writes mutations to /tmp with non-blocking memory fallback,
 *   ensuring zero EROFS Internal Server Errors.
 * - Audit logging failures are non-blocking and never break authentication or mutations.
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';
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

// Determine writable data locations
const BUNDLED_DATA_DIR = path.join(process.cwd(), 'data');
const BUNDLED_DATA_FILE = path.join(BUNDLED_DATA_DIR, 'teamsync-data.json');

// In serverless / read-only filesystems (like Vercel), /tmp is the writable storage
const TMP_DATA_DIR = '/tmp';
const TMP_DATA_FILE = path.join(TMP_DATA_DIR, 'teamsync-data.json');

// In-memory runtime cache ensuring state persistence in runtime memory even if all file writes fail
let memoryStore = null;

export function isPrismaAvailable() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');
}

/**
 * Builds the canonical initial dataset from synthetic records
 */
function createInitialDataset() {
  return {
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
}

/**
 * Reads data with fallback hierarchy:
 * 1. Runtime memoryStore if already populated
 * 2. /tmp/teamsync-data.json (if previously written in serverless invocation)
 * 3. ./data/teamsync-data.json (bundled repo snapshot)
 * 4. Fresh initial dataset generated in-memory
 */
function readData() {
  if (memoryStore) {
    return memoryStore;
  }

  // Try reading from /tmp first (persisted during container lifetime)
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const raw = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      memoryStore = JSON.parse(raw);
      return memoryStore;
    } catch {
      // Fall through if corrupted
    }
  }

  // Try reading from bundled project file
  if (fs.existsSync(BUNDLED_DATA_FILE)) {
    try {
      const raw = fs.readFileSync(BUNDLED_DATA_FILE, 'utf-8');
      memoryStore = JSON.parse(raw);
      return memoryStore;
    } catch (err) {
      console.warn('Failed to parse bundled data file, falling back to synthetic dataset:', err.message);
    }
  }

  // Fallback to fresh initial dataset
  memoryStore = createInitialDataset();
  return memoryStore;
}

/**
 * Writes data with resilient fallback:
 * 1. Always updates memoryStore first
 * 2. Tries writing to ./data/teamsync-data.json
 * 3. If that fails (e.g. EROFS on Vercel), writes to /tmp/teamsync-data.json
 * 4. Silently handles any unexpected filesystem write errors without throwing
 */
function writeData(data) {
  memoryStore = data;

  // Try writing to primary project data dir
  try {
    if (!fs.existsSync(BUNDLED_DATA_DIR)) {
      fs.mkdirSync(BUNDLED_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BUNDLED_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return;
  } catch (primaryErr) {
    // Expected on read-only environments like Vercel (EROFS)
  }

  // Fallback to writing in /tmp
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (tmpErr) {
    // In-memory store remains updated, log non-fatal warning
    console.warn('Filesystem write unavailable. Mutation preserved in-memory:', tmpErr.message);
  }
}

// ---------------- USER & AUTH OPERATIONS ----------------

export async function findUserByEmail(email) {
  const cleanEmail = email.toLowerCase().trim();

  if (isPrismaAvailable()) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          studentProfile: true,
          userSkills: {
            include: { skill: true },
          },
          availabilitySlots: true,
        },
      });
      if (user) return formatPrismaUser(user);
    } catch (dbErr) {
      console.warn('Prisma findUserByEmail query failed, falling back to store:', dbErr.message);
    }
  }

  const data = readData();
  const user = data.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) return null;
  return attachUserRelations(user, data);
}

export async function findUserById(id) {
  if (isPrismaAvailable()) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          studentProfile: true,
          userSkills: {
            include: { skill: true },
          },
          availabilitySlots: true,
        },
      });
      if (user) return formatPrismaUser(user);
    } catch (dbErr) {
      console.warn('Prisma findUserById query failed, falling back to store:', dbErr.message);
    }
  }

  const data = readData();
  const user = data.users.find(u => u.id === id);
  if (!user) return null;
  return attachUserRelations(user, data);
}

function formatPrismaUser(user) {
  let profile = user.studentProfile;
  if (profile) {
    try {
      if (typeof profile.interests === 'string') {
        profile = { ...profile, interests: JSON.parse(profile.interests) };
      }
      if (typeof profile.preferredRoles === 'string') {
        profile = { ...profile, preferredRoles: JSON.parse(profile.preferredRoles) };
      }
    } catch {}
  }

  return {
    ...user,
    studentProfile: profile,
    userSkills: (user.userSkills || []).map(us => ({
      ...us,
      skill: us.skill || { id: us.skillId, name: us.skillId },
    })),
    availabilitySlots: user.availabilitySlots || [],
  };
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
  const cleanEmail = email.toLowerCase().trim();

  if (isPrismaAvailable()) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newUser = await prisma.user.create({
        data: {
          id,
          email: cleanEmail,
          passwordHash,
          name,
          role,
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
          studentProfile: {
            create: {
              department,
              academicYear: Number(academicYear),
              interests: JSON.stringify(['Web Development', 'Software Engineering']),
              preferredRoles: JSON.stringify(['Full-Stack Developer']),
              weeklyAvailabilityHours: 18,
              learningGoals: 'Collaborate effectively and build robust projects',
              currentCommitments: 'Full-time study',
              workloadCapacity: 20,
              bio: `${name} is an active student in ${department}.`,
            },
          },
        },
        include: {
          studentProfile: true,
          userSkills: { include: { skill: true } },
          availabilitySlots: true,
        },
      });

      return formatPrismaUser(newUser);
    } catch (dbErr) {
      if (dbErr.message.includes('already exists')) throw dbErr;
      console.warn('Prisma createUser failed, falling back to local store:', dbErr.message);
    }
  }

  const data = readData();
  const existing = data.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser = {
    id,
    email: cleanEmail,
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
  if (isPrismaAvailable()) {
    try {
      if (updates.name) {
        await prisma.user.update({
          where: { id: userId },
          data: { name: updates.name },
        });
      }

      const profileData = {};
      if (updates.department) profileData.department = updates.department;
      if (updates.academicYear) profileData.academicYear = Number(updates.academicYear);
      if (updates.weeklyAvailabilityHours) profileData.weeklyAvailabilityHours = Number(updates.weeklyAvailabilityHours);
      if (updates.learningGoals) profileData.learningGoals = updates.learningGoals;
      if (updates.currentCommitments) profileData.currentCommitments = updates.currentCommitments;
      if (updates.workloadCapacity) profileData.workloadCapacity = Number(updates.workloadCapacity);
      if (updates.bio) profileData.bio = updates.bio;
      if (updates.interests) {
        profileData.interests = Array.isArray(updates.interests) ? JSON.stringify(updates.interests) : updates.interests;
      }
      if (updates.preferredRoles) {
        profileData.preferredRoles = Array.isArray(updates.preferredRoles) ? JSON.stringify(updates.preferredRoles) : updates.preferredRoles;
      }

      if (Object.keys(profileData).length > 0) {
        await prisma.studentProfile.upsert({
          where: { userId },
          update: profileData,
          create: {
            userId,
            department: updates.department || 'Computer Science',
            academicYear: Number(updates.academicYear || 3),
            interests: JSON.stringify(['Web Development']),
            preferredRoles: JSON.stringify(['Full-Stack Developer']),
            ...profileData,
          },
        });
      }

      if (updates.skills && Array.isArray(updates.skills)) {
        await prisma.userSkill.deleteMany({ where: { userId } });
        for (const sk of updates.skills) {
          await prisma.userSkill.create({
            data: {
              userId,
              skillId: sk.skillId,
              proficiencyLevel: Number(sk.level || 3),
              verified: true,
            },
          });
        }
      }

      if (updates.availability && Array.isArray(updates.availability)) {
        await prisma.availabilitySlot.deleteMany({ where: { userId } });
        for (const slot of updates.availability) {
          await prisma.availabilitySlot.create({
            data: {
              userId,
              dayOfWeek: Number(slot.dayOfWeek),
              startHour: Number(slot.startHour),
              endHour: Number(slot.endHour),
            },
          });
        }
      }

      const updated = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: true,
          userSkills: { include: { skill: true } },
          availabilitySlots: true,
        },
      });

      if (updated) return formatPrismaUser(updated);
    } catch (dbErr) {
      console.warn('Prisma updateUserProfile failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const skills = await prisma.skill.findMany();
      if (skills && skills.length > 0) return skills;
    } catch (dbErr) {
      console.warn('Prisma getAllSkills failed, falling back to local store:', dbErr.message);
    }
  }

  const data = readData();
  return data.skills;
}

// ---------------- CANDIDATE POOL FOR MATCHING ----------------

export async function getAllStudentCandidates() {
  if (isPrismaAvailable()) {
    try {
      const users = await prisma.user.findMany({
        include: {
          studentProfile: true,
          userSkills: { include: { skill: true } },
          availabilitySlots: true,
        },
      });
      if (users && users.length > 0) {
        return users.map(formatPrismaUser);
      }
    } catch (dbErr) {
      console.warn('Prisma getAllStudentCandidates failed, falling back to local store:', dbErr.message);
    }
  }

  const data = readData();
  return data.users.map(u => attachUserRelations(u, data));
}

// ---------------- PROJECTS ----------------

export async function getAllProjects() {
  if (isPrismaAvailable()) {
    try {
      const projects = await prisma.project.findMany({
        include: {
          owner: { select: { id: true, name: true, email: true } },
          requirements: { include: { skill: true } },
          teams: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      if (projects && projects.length > 0) {
        return projects.map(p => ({
          ...p,
          milestones: typeof p.milestones === 'string' ? JSON.parse(p.milestones || '[]') : p.milestones,
          teamCount: p.teams ? p.teams.length : 0,
        }));
      }
    } catch (dbErr) {
      console.warn('Prisma getAllProjects failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          requirements: { include: { skill: true } },
          teams: {
            include: {
              memberships: {
                include: {
                  user: {
                    include: {
                      studentProfile: true,
                      userSkills: { include: { skill: true } },
                      availabilitySlots: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (project) {
        return {
          ...project,
          milestones: typeof project.milestones === 'string' ? JSON.parse(project.milestones || '[]') : project.milestones,
          teams: (project.teams || []).map(t => ({
            ...t,
            members: (t.memberships || []).map(m => ({
              userId: m.userId,
              role: m.role,
              joinedAt: m.joinedAt,
              user: m.user ? formatPrismaUser(m.user) : null,
            })),
          })),
        };
      }
    } catch (dbErr) {
      console.warn('Prisma getProjectById failed, falling back to local store:', dbErr.message);
    }
  }

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
  const defaultMilestones = milestones.length > 0 ? milestones : [
    { id: 'm1', title: 'Phase 1: Project Setup & Research', completed: false },
    { id: 'm2', title: 'Phase 2: Core Architecture & Prototype', completed: false },
    { id: 'm3', title: 'Phase 3: Implementation & Review', completed: false },
    { id: 'm4', title: 'Phase 4: Final Testing & Submission', completed: false },
  ];

  if (isPrismaAvailable()) {
    try {
      const id = `proj-${Date.now()}`;
      const project = await prisma.project.create({
        data: {
          id,
          title,
          description,
          category: category || 'Web Development',
          expectedTeamSize: Number(expectedTeamSize),
          weeklyMeetingHours: Number(weeklyMeetingHours),
          workloadHours: Number(workloadHours),
          deadline: deadline ? new Date(deadline) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          status: 'RECRUITING',
          ownerId,
          milestones: JSON.stringify(defaultMilestones),
          requirements: {
            create: requirements.map(r => ({
              skillId: r.skillId,
              minProficiency: Number(r.minProficiency || 2),
              isRequired: r.isRequired !== undefined ? Boolean(r.isRequired) : true,
              roleName: r.roleName || null,
            })),
          },
          teams: {
            create: {
              id: `team-${Date.now()}`,
              name: `${title.slice(0, 24)} Team`,
              status: 'ACTIVE',
              memberships: {
                create: {
                  userId: ownerId,
                  role: 'PROJECT_LEAD',
                },
              },
            },
          },
        },
      });

      const fetched = await getProjectById(project.id);
      if (fetched) return fetched;
    } catch (dbErr) {
      console.warn('Prisma createProject failed, falling back to local store:', dbErr.message);
    }
  }

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
    milestones: defaultMilestones,
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
  if (isPrismaAvailable()) {
    try {
      const team = await prisma.team.findUnique({
        where: { id },
        include: {
          project: {
            include: {
              owner: { select: { id: true, name: true, email: true } },
              requirements: { include: { skill: true } },
            },
          },
          memberships: {
            include: {
              user: {
                include: {
                  studentProfile: true,
                  userSkills: { include: { skill: true } },
                  availabilitySlots: true,
                },
              },
            },
          },
          tasks: {
            include: {
              assignedTo: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
          deliverables: {
            include: {
              submittedBy: { select: { id: true, name: true } },
              reviews: {
                include: {
                  reviewer: { select: { id: true, name: true } },
                },
              },
            },
          },
          events: {
            include: {
              user: { select: { id: true, name: true } },
            },
            orderBy: { timestamp: 'desc' },
          },
          disputes: {
            include: {
              reportedBy: { select: { id: true, name: true } },
              resolvedBy: { select: { id: true, name: true } },
            },
          },
          peerReviews: {
            include: {
              fromUser: { select: { id: true, name: true } },
              toUser: { select: { id: true, name: true } },
            },
          },
        },
      });

      if (team) {
        return {
          ...team,
          members: (team.memberships || []).map(m => ({
            userId: m.userId,
            role: m.role,
            joinedAt: m.joinedAt,
            user: m.user ? formatPrismaUser(m.user) : null,
          })),
          contributions: team.events || [],
          peerFeedback: team.peerReviews || [],
        };
      }
    } catch (dbErr) {
      console.warn('Prisma getTeamById failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          project: true,
          memberships: true,
        },
      });

      if (!team) throw new Error('Team not found');

      if (team.memberships.some(m => m.userId === userId)) {
        throw new Error('User is already a member of this team');
      }

      const maxSize = team.project?.expectedTeamSize || 5;
      if (team.memberships.length >= maxSize) {
        throw new Error(`Team capacity reached (max ${maxSize} members)`);
      }

      await prisma.teamMembership.create({
        data: {
          teamId,
          userId,
          role,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.contributionEvent.create({
        data: {
          teamId,
          userId,
          eventType: 'PEER_HELP',
          title: `${user?.name || 'New member'} joined the team`,
          details: `Role assigned: ${role}`,
          weight: 0.5,
          verified: true,
        },
      });

      return getTeamById(teamId);
    } catch (dbErr) {
      if (dbErr.message.includes('already a member') || dbErr.message.includes('capacity reached')) {
        throw dbErr;
      }
      console.warn('Prisma addTeamMember failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const task = await prisma.task.create({
        data: {
          id: `task-${Date.now()}`,
          teamId,
          title,
          description: description || '',
          priority,
          assignedToId: assignedToId || null,
          createdById,
          dueDate: dueDate ? new Date(dueDate) : null,
          estimatedHours: Number(estimatedHours),
          acceptanceCriteria: acceptanceCriteria || 'Deliver code and pass reviews',
          status: 'TODO',
        },
      });

      await prisma.contributionEvent.create({
        data: {
          teamId,
          userId: createdById,
          taskId: task.id,
          eventType: 'TASK_CREATED',
          title: `Created task: "${title.slice(0, 30)}"`,
          details: `Priority: ${priority}, Estimated: ${estimatedHours}h`,
          weight: 0.5,
          verified: true,
        },
      });

      return task;
    } catch (dbErr) {
      console.warn('Prisma createTask failed, falling back to local store:', dbErr.message);
    }
  }

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
  const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  if (isPrismaAvailable()) {
    try {
      const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
      if (!existingTask) throw new Error('Task not found');

      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          status: newStatus,
          blockerDescription: blockerText !== null ? blockerText : existingTask.blockerDescription,
        },
      });

      if (newStatus === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
        await prisma.contributionEvent.create({
          data: {
            teamId: existingTask.teamId,
            userId: existingTask.assignedToId || userId,
            taskId,
            eventType: 'TASK_COMPLETED',
            title: `Completed task: "${existingTask.title}"`,
            details: `Moved from ${existingTask.status} to COMPLETED`,
            weight: 1.5,
            verified: true,
          },
        });
      }

      return updated;
    } catch (dbErr) {
      if (dbErr.message.includes('Task not found')) throw dbErr;
      console.warn('Prisma updateTaskStatus failed, falling back to local store:', dbErr.message);
    }
  }

  const data = readData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');

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
  if (isPrismaAvailable()) {
    try {
      const deliverable = await prisma.deliverable.create({
        data: {
          id: `del-${Date.now()}`,
          taskId,
          teamId,
          submittedById,
          title,
          fileUrlOrLink,
          notes: notes || '',
          status: 'SUBMITTED',
        },
      });

      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'IN_REVIEW' },
      });

      await prisma.contributionEvent.create({
        data: {
          teamId,
          userId: submittedById,
          taskId,
          eventType: 'DELIVERABLE_SUBMITTED',
          title: `Submitted deliverable: "${title}"`,
          details: `Link: ${fileUrlOrLink}`,
          weight: 1.2,
          verified: true,
        },
      });

      return deliverable;
    } catch (dbErr) {
      console.warn('Prisma submitDeliverable failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const deliverable = await prisma.deliverable.findUnique({
        where: { id: deliverableId },
      });

      if (!deliverable) throw new Error('Deliverable not found');

      // Guardrail: prevent author self-approval
      if (deliverable.submittedById === reviewerId) {
        throw new Error('Self-approval forbidden. Deliverables require an independent peer or reviewer evaluation.');
      }

      const review = await prisma.review.create({
        data: {
          id: `rev-${Date.now()}`,
          deliverableId,
          reviewerId,
          decision,
          comments,
          score: score ? Number(score) : null,
        },
      });

      const updatedDeliverable = await prisma.deliverable.update({
        where: { id: deliverableId },
        data: {
          status: decision === 'APPROVED' ? 'APPROVED' : 'CHANGES_REQUESTED',
        },
      });

      if (decision === 'APPROVED' && deliverable.taskId) {
        await prisma.task.update({
          where: { id: deliverable.taskId },
          data: { status: 'COMPLETED' },
        });
      }

      await prisma.contributionEvent.create({
        data: {
          teamId: deliverable.teamId,
          userId: reviewerId,
          taskId: deliverable.taskId,
          eventType: 'REVIEW_COMPLETED',
          title: `Reviewed deliverable: "${deliverable.title}" (${decision})`,
          details: comments,
          weight: 0.8,
          verified: true,
        },
      });

      return { deliverable: updatedDeliverable, review };
    } catch (dbErr) {
      if (dbErr.message.includes('Self-approval forbidden') || dbErr.message.includes('Deliverable not found')) {
        throw dbErr;
      }
      console.warn('Prisma reviewDeliverable failed, falling back to local store:', dbErr.message);
    }
  }

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
    decision,
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
  if (isPrismaAvailable()) {
    try {
      const dispute = await prisma.contributionDispute.create({
        data: {
          id: `disp-${Date.now()}`,
          teamId,
          reportedById,
          title,
          reason,
          requestedCorrection,
          status: 'OPEN',
        },
      });
      return dispute;
    } catch (dbErr) {
      console.warn('Prisma createDispute failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const updated = await prisma.contributionDispute.update({
        where: { id: disputeId },
        data: {
          status: newStatus,
          resolutionNotes,
          resolvedById,
          resolvedAt: new Date(),
        },
      });
      return updated;
    } catch (dbErr) {
      console.warn('Prisma resolveDispute failed, falling back to local store:', dbErr.message);
    }
  }

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
  if (isPrismaAvailable()) {
    try {
      const feedback = await prisma.peerFeedback.create({
        data: {
          id: `fb-${Date.now()}`,
          teamId,
          fromUserId,
          toUserId,
          rating: Number(rating),
          strengths,
          improvements: improvements || '',
          anonymous: Boolean(anonymous),
        },
      });
      return feedback;
    } catch (dbErr) {
      console.warn('Prisma submitPeerFeedback failed, falling back to local store:', dbErr.message);
    }
  }

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

/**
 * Audit log function is completely safe and non-blocking:
 * Never throws, ensuring an audit log failure never breaks auth or mutations.
 */
export async function logAudit({ userId, action, entityType, entityId, details }) {
  try {
    if (isPrismaAvailable()) {
      try {
        await prisma.auditLog.create({
          data: {
            id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            userId: userId || null,
            action,
            entityType,
            entityId: entityId || null,
            details: details || null,
          },
        });
        return;
      } catch (dbErr) {
        // Fall through to memory/file log
      }
    }

    const data = readData();
    const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
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
  } catch (err) {
    // Non-blocking: audit failure must never break execution
    console.warn('Non-blocking audit log record failed:', err.message);
  }
}
