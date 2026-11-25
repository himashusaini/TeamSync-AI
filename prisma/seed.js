/**
 * TeamSync AI - PostgreSQL Database Seed Script
 * 
 * Populates PostgreSQL database with 20 synthetic student profiles,
 * skills, 5 sample projects, teams, tasks, deliverables, reviews,
 * contribution events, and disputes.
 * 
 * Execution:
 *   npx prisma db push
 *   node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding TeamSync AI database...');

  const passwordHash = await bcrypt.hash('TeamSync2026!', 10);

  // 1. Create Skills
  const skills = [
    { id: 'sk-react', name: 'React', category: 'Frontend', description: 'Modern React with hooks and state management' },
    { id: 'sk-nextjs', name: 'Next.js', category: 'Frontend', description: 'Next.js App Router, SSR, and API routes' },
    { id: 'sk-nodejs', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript and RESTful APIs' },
    { id: 'sk-python', name: 'Python', category: 'AI/ML', description: 'Python for backend, analytics, and machine learning' },
    { id: 'sk-fastapi', name: 'FastAPI', category: 'Backend', description: 'High performance async Python web APIs' },
    { id: 'sk-pytorch', name: 'PyTorch', category: 'AI/ML', description: 'Deep learning neural network modeling and training' },
    { id: 'sk-postgres', name: 'PostgreSQL', category: 'Database', description: 'Relational schema design, indexing, and queries' },
    { id: 'sk-docker', name: 'Docker', category: 'DevOps', description: 'Containerization, Docker Compose, and image builds' },
    { id: 'sk-figma', name: 'Figma', category: 'Design', description: 'UI/UX wireframing, design systems, and prototyping' },
    { id: 'sk-tailwind', name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first modern styling and responsive design' },
    { id: 'sk-graphql', name: 'GraphQL', category: 'Backend', description: 'Query language for APIs and schema stitching' },
    { id: 'sk-mongodb', name: 'MongoDB', category: 'Database', description: 'Document-oriented NoSQL persistence' },
    { id: 'sk-kubernetes', name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration, deployments, and services' },
    { id: 'sk-solidity', name: 'Solidity', category: 'Web3', description: 'Smart contract development and security audits' },
    { id: 'sk-embedded', name: 'C/C++ Embedded', category: 'IoT', description: 'Microcontroller firmware for ESP32 and Arduino' },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${skills.length} skills.`);

  // 2. Create Users, Profiles, UserSkills, Availability
  const studentData = [
    {
      id: 'usr-student-1',
      email: 'alex.chen@university.edu',
      name: 'Alex Chen',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'Computer Science',
      year: 4,
      interests: ['Web Development', 'AI/ML', 'Distributed Systems'],
      roles: ['Project Lead', 'Full-Stack Developer'],
      hours: 20,
      skills: [{ id: 'sk-nextjs', level: 5 }, { id: 'sk-react', level: 5 }, { id: 'sk-nodejs', level: 4 }, { id: 'sk-postgres', level: 4 }, { id: 'sk-docker', level: 3 }],
      avail: [{ day: 1, start: 14, end: 18 }, { day: 3, start: 14, end: 18 }, { day: 5, start: 10, end: 16 }],
    },
    {
      id: 'usr-student-2',
      email: 'sarah.miller@university.edu',
      name: 'Sarah Miller',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      department: 'Data Science',
      year: 3,
      interests: ['AI/ML', 'Predictive Modeling', 'Data Visualization'],
      roles: ['AI/ML Engineer', 'Data Scientist'],
      hours: 18,
      skills: [{ id: 'sk-python', level: 5 }, { id: 'sk-pytorch', level: 4 }, { id: 'sk-fastapi', level: 4 }, { id: 'sk-postgres', level: 3 }],
      avail: [{ day: 1, start: 15, end: 19 }, { day: 2, start: 13, end: 17 }, { day: 4, start: 13, end: 17 }],
    },
    {
      id: 'usr-student-3',
      email: 'marcus.vance@university.edu',
      name: 'Marcus Vance',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: 'Information Technology',
      year: 3,
      interests: ['UI/UX Design', 'Frontend Development', 'Accessibility'],
      roles: ['UI/UX Designer', 'Frontend Lead'],
      hours: 16,
      skills: [{ id: 'sk-figma', level: 5 }, { id: 'sk-react', level: 4 }, { id: 'sk-tailwind', level: 5 }, { id: 'sk-nextjs', level: 3 }],
      avail: [{ day: 1, start: 14, end: 18 }, { day: 3, start: 14, end: 18 }, { day: 5, start: 12, end: 17 }],
    },
    {
      id: 'usr-student-4',
      email: 'priya.sharma@university.edu',
      name: 'Priya Sharma',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      department: 'Computer Science',
      year: 4,
      interests: ['Cloud Infrastructure', 'DevOps', 'Cybersecurity'],
      roles: ['DevOps Engineer', 'Backend Developer'],
      hours: 22,
      skills: [{ id: 'sk-docker', level: 5 }, { id: 'sk-kubernetes', level: 4 }, { id: 'sk-nodejs', level: 4 }, { id: 'sk-postgres', level: 4 }],
      avail: [{ day: 1, start: 14, end: 18 }, { day: 2, start: 10, end: 16 }, { day: 4, start: 10, end: 16 }],
    },
    {
      id: 'usr-student-5',
      email: 'david.kim@university.edu',
      name: 'David Kim',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: 'Software Engineering',
      year: 2,
      interests: ['Web Development', 'Testing', 'Backend'],
      roles: ['Backend Developer', 'QA Tester'],
      hours: 15,
      skills: [{ id: 'sk-nodejs', level: 3 }, { id: 'sk-postgres', level: 3 }, { id: 'sk-react', level: 2 }],
      avail: [{ day: 2, start: 14, end: 18 }, { day: 4, start: 14, end: 18 }, { day: 6, start: 9, end: 14 }],
    },
  ];

  for (const s of studentData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, role: s.role, avatarUrl: s.avatarUrl, passwordHash },
      create: {
        id: s.id,
        email: s.email,
        name: s.name,
        role: s.role,
        avatarUrl: s.avatarUrl,
        passwordHash,
      },
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        department: s.department,
        academicYear: s.year,
        interests: JSON.stringify(s.interests),
        preferredRoles: JSON.stringify(s.roles),
        weeklyAvailabilityHours: s.hours,
      },
      create: {
        userId: user.id,
        department: s.department,
        academicYear: s.year,
        interests: JSON.stringify(s.interests),
        preferredRoles: JSON.stringify(s.roles),
        weeklyAvailabilityHours: s.hours,
        workloadCapacity: s.hours + 5,
        bio: `${s.name} is a student in ${s.department}.`,
      },
    });

    for (const sk of s.skills) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: { userId: user.id, skillId: sk.id },
        },
        update: { proficiencyLevel: sk.level },
        create: { userId: user.id, skillId: sk.id, proficiencyLevel: sk.level, verified: true },
      });
    }

    // Clean up existing slots for idempotency
    await prisma.availabilitySlot.deleteMany({ where: { userId: user.id } });
    for (const slot of s.avail) {
      await prisma.availabilitySlot.create({
        data: {
          userId: user.id,
          dayOfWeek: slot.day,
          startHour: slot.start,
          endHour: slot.end,
        },
      });
    }
  }

  // 3. Create Sample Projects
  const sampleProjects = [
    {
      id: 'proj-teamsync',
      title: 'TeamSync AI: Intelligent Student Collaboration Platform',
      description: 'Explainable AI-driven team formation platform with balanced workload management and verified contribution analytics.',
      category: 'Web Development',
      expectedTeamSize: 4,
      weeklyMeetingHours: 4,
      workloadHours: 80,
      deadline: new Date('2026-11-08T00:00:00Z'),
      status: 'IN_PROGRESS',
      ownerId: 'usr-student-1',
      milestones: JSON.stringify([
        { id: 'm1', title: 'Architecture & Schema Finalization', completed: true },
        { id: 'm2', title: 'Matching Engine & Simulator', completed: true },
        { id: 'm3', title: 'Kanban Workspace & Deliverables Review', completed: true },
        { id: 'm4', title: 'Contribution Intelligence & Final Evaluation', completed: false },
      ]),
      requirements: [
        { skillId: 'sk-nextjs', minProficiency: 4, isRequired: true, roleName: 'Frontend Lead' },
        { skillId: 'sk-postgres', minProficiency: 3, isRequired: true, roleName: 'Backend & DB Lead' },
        { skillId: 'sk-figma', minProficiency: 3, isRequired: true, roleName: 'UI/UX Designer' },
        { skillId: 'sk-docker', minProficiency: 2, isRequired: false, roleName: 'DevOps Specialist' },
      ],
    },
    {
      id: 'proj-healthpulse',
      title: 'HealthPulse: Predictive Patient Health Monitor',
      description: 'IoT and neural classification system for early hospital readmission risk detection and telemetry.',
      category: 'AI/ML',
      expectedTeamSize: 4,
      weeklyMeetingHours: 4,
      workloadHours: 75,
      deadline: new Date('2026-11-15T00:00:00Z'),
      status: 'RECRUITING',
      ownerId: 'usr-student-2',
      milestones: JSON.stringify([
        { id: 'm1', title: 'Clinical Dataset Ingestion', completed: true },
        { id: 'm2', title: 'Transformer Model Pipeline', completed: false },
      ]),
      requirements: [
        { skillId: 'sk-python', minProficiency: 4, isRequired: true, roleName: 'ML Engineer' },
        { skillId: 'sk-pytorch', minProficiency: 4, isRequired: true, roleName: 'Data Scientist' },
        { skillId: 'sk-fastapi', minProficiency: 3, isRequired: true, roleName: 'Backend Lead' },
        { skillId: 'sk-react', minProficiency: 3, isRequired: false, roleName: 'Frontend Developer' },
      ],
    },
  ];

  for (const pData of sampleProjects) {
    const { requirements, ...projFields } = pData;
    await prisma.project.upsert({
      where: { id: projFields.id },
      update: projFields,
      create: projFields,
    });

    for (const req of requirements) {
      const existing = await prisma.projectRequirement.findFirst({
        where: { projectId: projFields.id, skillId: req.skillId },
      });
      if (existing) {
        await prisma.projectRequirement.update({
          where: { id: existing.id },
          data: req,
        });
      } else {
        await prisma.projectRequirement.create({
          data: { projectId: projFields.id, ...req },
        });
      }
    }
  }

  // 4. Create Sample Team & Memberships
  const team = await prisma.team.upsert({
    where: { id: 'team-alpha' },
    update: { name: 'Alpha Core Innovators', projectId: 'proj-teamsync', status: 'ACTIVE' },
    create: {
      id: 'team-alpha',
      name: 'Alpha Core Innovators',
      projectId: 'proj-teamsync',
      status: 'ACTIVE',
    },
  });

  const memberships = [
    { userId: 'usr-student-1', role: 'PROJECT_LEAD', joinedAt: new Date('2026-08-25T10:00:00.000Z') },
    { userId: 'usr-student-3', role: 'UI_UX_DESIGNER', joinedAt: new Date('2026-08-26T11:00:00.000Z') },
    { userId: 'usr-student-4', role: 'DEVOPS_ENGINEER', joinedAt: new Date('2026-08-26T14:30:00.000Z') },
    { userId: 'usr-student-5', role: 'BACKEND_DEVELOPER', joinedAt: new Date('2026-08-28T09:15:00.000Z') },
  ];

  for (const m of memberships) {
    await prisma.teamMembership.upsert({
      where: { teamId_userId: { teamId: team.id, userId: m.userId } },
      update: { role: m.role, joinedAt: m.joinedAt },
      create: { teamId: team.id, userId: m.userId, role: m.role, joinedAt: m.joinedAt },
    });
  }

  // 5. Create Tasks
  const tasks = [
    {
      id: 'task-101',
      teamId: team.id,
      title: 'Design explainable matching scoring formula & API endpoints',
      description: 'Implement multi-factor weighted equation with weight validation.',
      status: 'COMPLETED',
      priority: 'HIGH',
      assignedToId: 'usr-student-1',
      createdById: 'usr-student-1',
      dueDate: new Date('2026-09-18T00:00:00.000Z'),
      estimatedHours: 12,
      acceptanceCriteria: 'Unit tests passing for all 5 sub-scores; weights summing to 1.0; deterministic output.',
    },
    {
      id: 'task-102',
      teamId: team.id,
      title: 'Build Interactive What-If Team Simulator UI',
      description: 'Real-time weight adjustment sliders and team candidate radar evaluation.',
      status: 'COMPLETED',
      priority: 'HIGH',
      assignedToId: 'usr-student-3',
      createdById: 'usr-student-1',
      dueDate: new Date('2026-09-25T00:00:00.000Z'),
      estimatedHours: 10,
      acceptanceCriteria: 'Mobile responsive, sub-100ms render, clean SVG charts.',
    },
    {
      id: 'task-103',
      teamId: team.id,
      title: 'Implement Deliverable Submission & Independent Review Workflow',
      description: 'Secure artifact uploads and strict peer approval anti-tamper guardrails.',
      status: 'IN_REVIEW',
      priority: 'MEDIUM',
      assignedToId: 'usr-student-5',
      createdById: 'usr-student-1',
      dueDate: new Date('2026-10-02T00:00:00.000Z'),
      estimatedHours: 8,
      acceptanceCriteria: 'Prevent author self-approval; persist review comments and audit events.',
    },
  ];

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // 6. Create Deliverables & Reviews
  const deliverables = [
    {
      id: 'del-1',
      taskId: 'task-101',
      teamId: team.id,
      submittedById: 'usr-student-1',
      title: 'PR #14: Explainable Recommendation Engine Implementation',
      fileUrlOrLink: 'https://github.com/teamsync-ai/core/pull/14',
      notes: 'Includes unit tests in tests/matching.test.js covering all boundary conditions.',
      status: 'APPROVED',
    },
    {
      id: 'del-2',
      taskId: 'task-102',
      teamId: team.id,
      submittedById: 'usr-student-3',
      title: 'PR #21: What-If Simulator Frontend Component & Style System',
      fileUrlOrLink: 'https://github.com/teamsync-ai/core/pull/21',
      notes: 'Fully responsive UI tokens with zero external CSS library dependencies.',
      status: 'APPROVED',
    },
  ];

  for (const d of deliverables) {
    await prisma.deliverable.upsert({
      where: { id: d.id },
      update: d,
      create: d,
    });
  }

  // Create Reviews
  const reviews = [
    {
      id: 'rev-1',
      deliverableId: 'del-1',
      reviewerId: 'usr-student-4',
      decision: 'APPROVED',
      comments: 'Architecture adheres to multi-criteria specification. Clean boundary checks.',
      score: 10,
    },
    {
      id: 'rev-2',
      deliverableId: 'del-2',
      reviewerId: 'usr-student-1',
      decision: 'APPROVED',
      comments: 'Excellent responsiveness and accessible contrast ratios. Approved for merge.',
      score: 9,
    },
  ];

  for (const r of reviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }

  console.log('✅ Seeded demo projects, teams, tasks, deliverables, and reviews.');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
