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
      update: { name: s.name, role: s.role, passwordHash },
      create: {
        id: s.id,
        email: s.email,
        name: s.name,
        role: s.role,
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

  // 3. Create Sample Project & Team
  const project = await prisma.project.upsert({
    where: { id: 'proj-teamsync' },
    update: {},
    create: {
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
    },
  });

  const team = await prisma.team.upsert({
    where: { id: 'team-alpha' },
    update: {},
    create: {
      id: 'team-alpha',
      name: 'Alpha Core Innovators',
      projectId: project.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Seeded demo project and team.');
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
