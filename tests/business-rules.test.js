import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
} from '../src/lib/auth.js';
import {
  findUserByEmail,
  createUser,
  updateUserProfile,
  getAllProjects,
  createProject,
  getTeamById,
  addTeamMember,
  createTask,
  updateTaskStatus,
  submitDeliverable,
  reviewDeliverable,
  createDispute,
  resolveDispute,
} from '../src/services/store.js';

test('Security & Auth: Password hashing and JWT verification', async () => {
  const plain = 'CollegeSubmission2026!';
  const hash = await hashPassword(plain);

  assert.ok(hash !== plain, 'Password must be hashed');
  const valid = await verifyPassword(plain, hash);
  assert.equal(valid, true, 'Correct password must verify');

  const invalid = await verifyPassword('WrongPassword', hash);
  assert.equal(invalid, false, 'Wrong password must reject');

  // Test token signing & decoding
  const token = await signToken({ id: 'test-user', email: 'test@uni.edu', role: 'STUDENT' });
  const payload = await verifyToken(token);
  assert.equal(payload.id, 'test-user');
  assert.equal(payload.role, 'STUDENT');
});

test('Business Rule: User creation and profile integration', async () => {
  const email = `student_${Date.now()}@university.edu`;
  const pwdHash = await hashPassword('SamplePass123!');

  const user = await createUser({
    email,
    passwordHash: pwdHash,
    name: 'Test Evaluation Student',
    department: 'Data Science',
    academicYear: 3,
  });

  assert.equal(user.email, email);
  assert.equal(user.studentProfile.department, 'Data Science');
  assert.equal(user.studentProfile.academicYear, 3);

  // Duplicate email prevention
  await assert.rejects(
    async () => {
      await createUser({ email, passwordHash: pwdHash, name: 'Duplicate' });
    },
    /already exists/
  );
});

test('Business Rule: Project creation and automatic team allocation', async () => {
  const project = await createProject({
    title: 'Autonomous Drone Navigation Capstone',
    description: 'ROS2 and computer vision for indoor localization',
    category: 'AI/ML',
    expectedTeamSize: 3,
    weeklyMeetingHours: 3,
    workloadHours: 50,
    ownerId: 'usr-student-1',
  });

  assert.ok(project.id);
  assert.equal(project.expectedTeamSize, 3);
  assert.ok(project.teams.length >= 1, 'Project must automatically instantiate a collaborative team');
});

test('Business Rule: Team capacity limits and duplicate membership prevention', async () => {
  // Use project with capacity 2
  const project = await createProject({
    title: 'Pair Programming Mobile Suite',
    description: 'Flutter project for 2 members',
    expectedTeamSize: 2,
    ownerId: 'usr-student-1',
  });

  const team = project.teams[0];
  assert.equal(team.members.length, 1); // Owner is first member

  // Add 2nd member
  const updatedTeam = await addTeamMember(team.id, 'usr-student-2', 'FRONTEND');
  assert.equal(updatedTeam.members.length, 2);

  // Attempt duplicate addition of usr-student-2
  await assert.rejects(
    async () => {
      await addTeamMember(team.id, 'usr-student-2');
    },
    /already a member/
  );

  // Attempt exceeding capacity limit
  await assert.rejects(
    async () => {
      await addTeamMember(team.id, 'usr-student-3');
    },
    /capacity reached/
  );
});

test('Business Rule: Deliverable review guardrail prevents author self-approval', async () => {
  const team = await getTeamById('team-alpha');

  // Create a task
  const task = await createTask({
    teamId: team.id,
    title: 'Security Audit Script',
    description: 'Verify JWT expiration bounds',
    createdById: 'usr-student-1',
    assignedToId: 'usr-student-1',
  });

  // Submit deliverable by usr-student-1
  const del = await submitDeliverable({
    teamId: team.id,
    taskId: task.id,
    submittedById: 'usr-student-1',
    title: 'PR #99 Security Audit',
    fileUrlOrLink: 'https://github.com/teamsync-ai/core/pull/99',
  });

  // Attempt self-approval by usr-student-1 (must fail)
  await assert.rejects(
    async () => {
      await reviewDeliverable({
        deliverableId: del.id,
        reviewerId: 'usr-student-1', // Author attempting self-review
        decision: 'APPROVED',
        comments: 'Looks good to me',
      });
    },
    /Self-approval forbidden/
  );

  // Independent review by peer (usr-student-4) must succeed
  const reviewResult = await reviewDeliverable({
    deliverableId: del.id,
    reviewerId: 'usr-student-4',
    decision: 'APPROVED',
    comments: 'Verified independently. Passing all assertions.',
    score: 10,
  });

  assert.equal(reviewResult.deliverable.status, 'APPROVED');
  assert.equal(reviewResult.review.decision, 'APPROVED');
});

test('Business Rule: Contribution dispute reporting and recorded resolution', async () => {
  const team = await getTeamById('team-alpha');

  const dispute = await createDispute({
    teamId: team.id,
    reportedById: 'usr-student-5',
    title: 'Contested sprint workload weight',
    reason: 'Executed database schema migrations that were not credited in sprint points',
    requestedCorrection: 'Add 1.5 contribution points',
  });

  assert.equal(dispute.status, 'OPEN');

  const resolved = await resolveDispute({
    disputeId: dispute.id,
    resolvedById: 'usr-student-1',
    resolutionNotes: 'Reviewed git history. Confirmed migration commits. Credited 1.5 points.',
    newStatus: 'RESOLVED',
  });

  assert.equal(resolved.status, 'RESOLVED');
  assert.ok(resolved.resolutionNotes.includes('Confirmed migration'));
  assert.ok(resolved.resolvedAt);
});
