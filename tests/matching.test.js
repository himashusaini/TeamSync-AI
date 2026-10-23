import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WEIGHTS,
  validateWeights,
  calculateSkillCoverage,
  calculateAvailabilityCompatibility,
  calculateInterestAlignment,
  calculateRoleCoverage,
  calculateWorkloadCompatibility,
  evaluateTeamMatch,
  generateTeamRecommendations,
} from '../src/services/matching.js';

test('Matching Engine: Weights validation', () => {
  assert.equal(validateWeights(DEFAULT_WEIGHTS), true);

  // Invalid weights that don't sum to 1.0
  assert.throws(() => {
    validateWeights({
      skills: 0.5,
      availability: 0.5,
      interest: 0.2, // sum = 1.2
      role: 0.1,
      workload: 0.1,
    });
  }, /Weights must total 100%/);
});

test('Matching Engine: Skill coverage scoring and missing critical skills', () => {
  const requirements = [
    { skillName: 'React', minProficiency: 3, isRequired: true },
    { skillName: 'Node.js', minProficiency: 3, isRequired: true },
    { skillName: 'PostgreSQL', minProficiency: 2, isRequired: false },
  ];

  // Team with only React
  const memberA = {
    id: 'u1',
    name: 'Alice',
    userSkills: [{ skill: { name: 'React' }, proficiencyLevel: 4 }],
  };

  const res1 = calculateSkillCoverage(requirements, [memberA]);
  assert.equal(res1.fullyCovered.length, 1);
  assert.equal(res1.fullyCovered[0].skillName, 'React');
  assert.equal(res1.missingCritical.length, 1);
  assert.equal(res1.missingCritical[0].skillName, 'Node.js');
  assert.ok(res1.score < 60, 'Score should be penalized for missing critical skill');

  // Team with complementary skills (Alice + Bob)
  const memberB = {
    id: 'u2',
    name: 'Bob',
    userSkills: [
      { skill: { name: 'Node.js' }, proficiencyLevel: 3 },
      { skill: { name: 'PostgreSQL' }, proficiencyLevel: 3 },
    ],
  };

  const res2 = calculateSkillCoverage(requirements, [memberA, memberB]);
  assert.equal(res2.missingCritical.length, 0);
  assert.equal(res2.score, 100);
  assert.equal(res2.fullyCovered.length, 3);
});

test('Matching Engine: Availability overlap and missing schedule penalty', () => {
  // Member 1 has slot Mon 14-18
  const member1 = {
    id: 'u1',
    name: 'Alice',
    availabilitySlots: [
      { dayOfWeek: 1, startHour: 14, endHour: 18 },
    ],
  };

  // Member 2 has slot Mon 16-20 (overlap is 16-18: 2 hours)
  const member2 = {
    id: 'u2',
    name: 'Bob',
    availabilitySlots: [
      { dayOfWeek: 1, startHour: 16, endHour: 20 },
    ],
  };

  const res = calculateAvailabilityCompatibility(2, [member1, member2]);
  assert.equal(res.overlappingHours, 2);
  assert.ok(res.score >= 80, 'Score should be high when meeting target overlap is met');

  // Member with missing availability should reduce certainty/score
  const memberNoAvail = { id: 'u3', name: 'Charlie', availabilitySlots: [] };
  const resWithMissing = calculateAvailabilityCompatibility(2, [member1, member2, memberNoAvail]);
  assert.ok(resWithMissing.score < res.score, 'Missing schedule should lower availability score');
  assert.equal(resWithMissing.missingAvailabilityMembers, 1);
});

test('Matching Engine: Interest alignment normalization', () => {
  const project = {
    title: 'AI Medical Imaging Diagnostic Platform',
    category: 'Healthcare AI',
    description: 'Deep learning for MRI classification',
  };

  const member = {
    id: 'u1',
    name: 'Alice',
    studentProfile: {
      interests: JSON.stringify(['AI', 'Healthcare', 'Computer Vision']),
    },
  };

  const res = calculateInterestAlignment(project, [member]);
  assert.ok(res.score >= 70, 'Direct match of AI and Healthcare should score high');
  assert.ok(res.matchedInterests.length > 0);
});

test('Matching Engine: Role coverage detection', () => {
  const project = { category: 'Web App' };
  const team = [
    { id: '1', name: 'Alice', studentProfile: { preferredRoles: JSON.stringify(['Frontend', 'UI/UX']) } },
    { id: '2', name: 'Bob', studentProfile: { preferredRoles: JSON.stringify(['Backend', 'Database']) } },
  ];

  const res = calculateRoleCoverage(project, team);
  assert.ok(res.filledRoles.some(r => r.role === 'Frontend'));
  assert.ok(res.filledRoles.some(r => r.role === 'Backend'));
  assert.ok(res.unfilledRoles.includes('DevOps'));
});

test('Matching Engine: Workload compatibility and overload warning', () => {
  const project = { workloadHours: 120 }; // High workload project
  const memberOverloaded = {
    id: '1',
    name: 'Stressed Student',
    studentProfile: {
      workloadCapacity: 10,
      weeklyAvailabilityHours: 8,
      currentCommitments: 'Heavy course load and thesis',
    },
  };

  const res = calculateWorkloadCompatibility(project, [memberOverloaded]);
  assert.ok(res.warnings.length > 0);
  assert.ok(res.score < 50);
});

test('Matching Engine: Full team evaluation and candidate recommendations', () => {
  const project = {
    id: 'p1',
    title: 'Full-Stack FinTech Portal',
    category: 'FinTech',
    expectedTeamSize: 2,
    weeklyMeetingHours: 2,
    workloadHours: 40,
    requirements: [
      { skillName: 'React', minProficiency: 3, isRequired: true },
      { skillName: 'Node.js', minProficiency: 3, isRequired: true },
    ],
  };

  const candidates = [
    {
      id: 'c1',
      name: 'Alice',
      studentProfile: {
        department: 'Computer Science',
        interests: JSON.stringify(['FinTech', 'Web']),
        preferredRoles: JSON.stringify(['Frontend']),
        workloadCapacity: 20,
        weeklyAvailabilityHours: 18,
      },
      userSkills: [{ skill: { name: 'React' }, proficiencyLevel: 4 }],
      availabilitySlots: [{ dayOfWeek: 2, startHour: 10, endHour: 16 }],
    },
    {
      id: 'c2',
      name: 'Bob',
      studentProfile: {
        department: 'Software Engineering',
        interests: JSON.stringify(['FinTech', 'Cloud']),
        preferredRoles: JSON.stringify(['Backend']),
        workloadCapacity: 20,
        weeklyAvailabilityHours: 16,
      },
      userSkills: [{ skill: { name: 'Node.js' }, proficiencyLevel: 4 }],
      availabilitySlots: [{ dayOfWeek: 2, startHour: 12, endHour: 18 }],
    },
    {
      id: 'c3',
      name: 'Charlie',
      studentProfile: {
        department: 'Design',
        interests: JSON.stringify(['Game Dev']),
        preferredRoles: JSON.stringify(['Game Designer']),
        workloadCapacity: 10,
        weeklyAvailabilityHours: 5,
      },
      userSkills: [{ skill: { name: 'Photoshop' }, proficiencyLevel: 2 }],
      availabilitySlots: [{ dayOfWeek: 5, startHour: 8, endHour: 10 }],
    },
  ];

  const recs = generateTeamRecommendations(project, candidates, { targetSize: 2 });
  assert.ok(recs.length > 0);
  const best = recs[0];
  assert.equal(best.members.length, 2);
  assert.ok(best.overallScore > 60);
  assert.ok(best.explanations.reasons.length > 0);
});
