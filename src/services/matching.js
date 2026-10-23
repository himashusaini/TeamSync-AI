/**
 * TeamSync AI - Intelligent Team Matching Engine
 * 
 * Implements explainable, transparent candidate team evaluation
 * Formula: M = 0.40S + 0.25A + 0.15I + 0.10R + 0.10W
 * Where:
 *  S = Skill coverage score [0-100]
 *  A = Availability compatibility score [0-100]
 *  I = Interest alignment score [0-100]
 *  R = Role coverage score [0-100]
 *  W = Workload compatibility score [0-100]
 */

export const DEFAULT_WEIGHTS = {
  skills: 0.40,
  availability: 0.25,
  interest: 0.15,
  role: 0.10,
  workload: 0.10,
};

/**
 * Validate that weights sum to 1.0 (with small floating tolerance)
 */
export function validateWeights(weights = DEFAULT_WEIGHTS) {
  const sum = (weights.skills || 0) +
    (weights.availability || 0) +
    (weights.interest || 0) +
    (weights.role || 0) +
    (weights.workload || 0);

  if (Math.abs(sum - 1.0) > 0.005) {
    throw new Error(`Weights must total 100% (1.0). Current sum: ${(sum * 100).toFixed(1)}%`);
  }
  return true;
}

/**
 * Calculate Skill Coverage (S)
 * Evaluates required skills and minimum proficiency levels against team capabilities.
 */
export function calculateSkillCoverage(requirements = [], teamMembers = []) {
  if (!requirements || requirements.length === 0) {
    return {
      score: 100,
      fullyCovered: [],
      partiallyCovered: [],
      missingCritical: [],
      redundantSkills: [],
      mentoringOpportunities: [],
    };
  }

  if (!teamMembers || teamMembers.length === 0) {
    return {
      score: 0,
      fullyCovered: [],
      partiallyCovered: [],
      missingCritical: requirements.map(r => ({
        skillName: r.skill?.name || r.skillName || 'Unknown Skill',
        minProficiency: r.minProficiency || 2,
        isRequired: r.isRequired !== false,
      })),
      redundantSkills: [],
      mentoringOpportunities: [],
    };
  }

  // Aggregate skills possessed by team
  const skillMap = new Map(); // skillName -> Array of { userId, userName, proficiency }

  for (const member of teamMembers) {
    const userSkills = member.userSkills || [];
    for (const us of userSkills) {
      const name = (us.skill?.name || us.skillName || '').toLowerCase().trim();
      if (!name) continue;
      if (!skillMap.has(name)) {
        skillMap.set(name, []);
      }
      skillMap.get(name).push({
        userId: member.id,
        userName: member.name,
        proficiency: us.proficiencyLevel || 1,
      });
    }
  }

  let totalWeight = 0;
  let earnedScore = 0;
  const fullyCovered = [];
  const partiallyCovered = [];
  const missingCritical = [];
  const redundantSkills = [];
  const mentoringOpportunities = [];

  for (const req of requirements) {
    const reqName = (req.skill?.name || req.skillName || '').toLowerCase().trim();
    const displayName = req.skill?.name || req.skillName || reqName;
    const minProf = req.minProficiency || 2;
    const isRequired = req.isRequired !== false;
    const weight = isRequired ? 2 : 1;
    totalWeight += weight;

    const holders = skillMap.get(reqName) || [];

    if (holders.length === 0) {
      if (isRequired) {
        missingCritical.push({ skillName: displayName, minProficiency: minProf });
      } else {
        partiallyCovered.push({ skillName: displayName, maxProficiency: 0, minProficiency: minProf, coverageRatio: 0 });
      }
      continue;
    }

    const maxProf = Math.max(...holders.map(h => h.proficiency));
    const bestCoverageRatio = Math.min(1, maxProf / minProf);
    earnedScore += weight * bestCoverageRatio * 100;

    if (maxProf >= minProf) {
      fullyCovered.push({
        skillName: displayName,
        highestProficiency: maxProf,
        holders: holders.map(h => ({ name: h.userName, level: h.proficiency })),
      });
    } else {
      partiallyCovered.push({
        skillName: displayName,
        maxProficiency: maxProf,
        minProficiency: minProf,
        coverageRatio: Math.round(bestCoverageRatio * 100),
      });
    }

    // Redundancy: multiple members proficient
    const qualifiedHolders = holders.filter(h => h.proficiency >= minProf);
    if (qualifiedHolders.length > 1) {
      redundantSkills.push({
        skillName: displayName,
        memberCount: qualifiedHolders.length,
        members: qualifiedHolders.map(h => h.userName),
      });
    }

    // Mentoring opportunities: at least one expert (>=4) and one novice (<=2)
    const hasExpert = holders.some(h => h.proficiency >= 4);
    const hasNovice = holders.some(h => h.proficiency <= 2);
    if (hasExpert && hasNovice) {
      mentoringOpportunities.push({
        skillName: displayName,
        mentor: holders.find(h => h.proficiency >= 4)?.userName,
        mentee: holders.find(h => h.proficiency <= 2)?.userName,
      });
    }
  }

  const normalizedScore = totalWeight > 0 ? Math.round(earnedScore / totalWeight) : 100;

  return {
    score: Math.max(0, Math.min(100, normalizedScore)),
    fullyCovered,
    partiallyCovered,
    missingCritical,
    redundantSkills,
    mentoringOpportunities,
  };
}

/**
 * Calculate Availability Compatibility (A)
 * Compares weekly overlapping hours with project weeklyMeetingHours.
 */
export function calculateAvailabilityCompatibility(weeklyMeetingHours = 4, teamMembers = []) {
  if (!teamMembers || teamMembers.length === 0) {
    return { score: 0, overlappingHours: 0, targetHours: weeklyMeetingHours, conflictDays: [] };
  }

  // Build grid: 7 days x 24 hours. A slot is mutually available if EVERY member is available.
  const slotsGrid = Array.from({ length: 7 }, () => Array(24).fill(0));
  let membersWithNoSchedule = 0;

  for (const member of teamMembers) {
    const slots = member.availabilitySlots || [];
    if (slots.length === 0) {
      membersWithNoSchedule++;
      continue;
    }
    const memberGrid = Array.from({ length: 7 }, () => Array(24).fill(false));
    for (const slot of slots) {
      const d = slot.dayOfWeek;
      const start = Math.max(0, Math.min(23, slot.startHour));
      const end = Math.max(start + 1, Math.min(24, slot.endHour));
      if (d >= 0 && d < 7) {
        for (let h = start; h < end; h++) {
          memberGrid[d][h] = true;
        }
      }
    }
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        if (memberGrid[d][h]) {
          slotsGrid[d][h]++;
        }
      }
    }
  }

  const teamSize = teamMembers.length;
  let commonOverlapHours = 0;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const commonSlotWindows = [];

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      // Overlap: all members who provided availability share this hour
      if (slotsGrid[d][h] === teamSize && teamSize > 0) {
        commonOverlapHours++;
        commonSlotWindows.push({ day: dayNames[d], hour: `${h}:00 - ${h + 1}:00` });
      }
    }
  }

  // Missing availability penalty: unknown availability cannot be treated as 100% compatible
  let penaltyRatio = 1.0;
  if (membersWithNoSchedule > 0) {
    penaltyRatio = (teamSize - membersWithNoSchedule * 0.4) / teamSize;
  }

  const target = Math.max(1, weeklyMeetingHours);
  const overlapRatio = Math.min(1.5, commonOverlapHours / target);
  let rawScore = (overlapRatio / 1.0) * 100 * penaltyRatio;

  // Even if overlap is low, give baseline proportional score if members have individual availability
  if (commonOverlapHours === 0 && teamSize > 0) {
    // Check partial overlap (majority)
    let partialOverlapHours = 0;
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        if (slotsGrid[d][h] >= Math.max(2, teamSize - 1)) {
          partialOverlapHours++;
        }
      }
    }
    rawScore = Math.min(45, (partialOverlapHours / target) * 40 * penaltyRatio);
  }

  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  return {
    score,
    overlappingHours: commonOverlapHours,
    targetHours: target,
    commonWindows: commonSlotWindows.slice(0, 5),
    missingAvailabilityMembers: membersWithNoSchedule,
  };
}

/**
 * Calculate Interest Alignment (I)
 * Compares project domain/category and description keywords with student interests.
 */
export function calculateInterestAlignment(project = {}, teamMembers = []) {
  if (!teamMembers || teamMembers.length === 0) return { score: 0, matchedInterests: [] };

  const projectKeywords = [
    project.category || '',
    ...(project.title || '').split(/\s+/),
    ...(project.description || '').split(/\s+/),
  ].map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2);

  const matchedInterests = [];
  let memberScoreSum = 0;

  for (const member of teamMembers) {
    const rawInterests = member.studentProfile?.interests;
    let interests = [];
    if (Array.isArray(rawInterests)) {
      interests = rawInterests;
    } else if (typeof rawInterests === 'string') {
      try {
        interests = JSON.parse(rawInterests);
      } catch {
        interests = rawInterests.split(',').map(s => s.trim());
      }
    }

    if (interests.length === 0) {
      memberScoreSum += 40; // baseline neutral
      continue;
    }

    let matchCount = 0;
    for (const interest of interests) {
      const cleanInterest = interest.toLowerCase().trim();
      const directMatch = projectKeywords.some(kw => kw.includes(cleanInterest) || cleanInterest.includes(kw));
      if (directMatch) {
        matchCount++;
        matchedInterests.push({ memberName: member.name, interest });
      }
    }

    const memberInterestScore = Math.min(100, Math.round((matchCount / Math.max(1, interests.length)) * 100) + 30);
    memberScoreSum += memberInterestScore;
  }

  const avgScore = Math.round(memberScoreSum / teamMembers.length);

  return {
    score: Math.max(0, Math.min(100, avgScore)),
    matchedInterests,
  };
}

/**
 * Calculate Role Coverage (R)
 * Checks if key roles (Lead, Frontend, Backend, UI/UX, QA/DevOps, Data) are satisfied.
 */
export function calculateRoleCoverage(project = {}, teamMembers = []) {
  if (!teamMembers || teamMembers.length === 0) return { score: 0, filledRoles: [], unfilledRoles: [] };

  const standardRoles = ['Frontend', 'Backend', 'Lead', 'UI/UX', 'DevOps'];
  const preferredTeamRoles = new Map();

  for (const member of teamMembers) {
    const rawRoles = member.studentProfile?.preferredRoles;
    let roles = [];
    if (Array.isArray(rawRoles)) {
      roles = rawRoles;
    } else if (typeof rawRoles === 'string') {
      try {
        roles = JSON.parse(rawRoles);
      } catch {
        roles = rawRoles.split(',').map(s => s.trim());
      }
    }

    for (const r of roles) {
      const clean = r.trim();
      if (!preferredTeamRoles.has(clean)) {
        preferredTeamRoles.set(clean, []);
      }
      preferredTeamRoles.get(clean).push(member.name);
    }
  }

  const filledRoles = [];
  const unfilledRoles = [];

  for (const role of standardRoles) {
    let matched = false;
    for (const [key, members] of preferredTeamRoles.entries()) {
      if (key.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(key.toLowerCase())) {
        filledRoles.push({ role, members });
        matched = true;
        break;
      }
    }
    if (!matched) {
      unfilledRoles.push(role);
    }
  }

  // Calculate score based on filled standard roles
  const coverageRatio = filledRoles.length / Math.min(teamMembers.length, standardRoles.length);
  const score = Math.round(Math.min(100, coverageRatio * 100));

  return {
    score: Math.max(0, Math.min(100, score)),
    filledRoles,
    unfilledRoles,
  };
}

/**
 * Calculate Workload Compatibility (W)
 * Compares weekly project demand with member capacity and commitments.
 */
export function calculateWorkloadCompatibility(project = {}, teamMembers = []) {
  if (!teamMembers || teamMembers.length === 0) return { score: 0, warnings: [], averageCapacity: 0 };

  const totalProjectHours = project.workloadHours || 60;
  const projectWeeks = 10;
  const teamSize = teamMembers.length;
  const weeklyProjectHoursPerMember = (totalProjectHours / projectWeeks) / Math.max(1, teamSize);

  const warnings = [];
  let capacitySum = 0;
  let feasibleCount = 0;

  for (const member of teamMembers) {
    const profile = member.studentProfile || {};
    const capacity = profile.workloadCapacity || 15;
    const weeklyAvail = profile.weeklyAvailabilityHours || 15;
    capacitySum += capacity;

    const availableEffective = Math.min(capacity, weeklyAvail);

    if (weeklyProjectHoursPerMember > availableEffective) {
      warnings.push({
        memberName: member.name,
        issue: 'OVERLOAD_RISK',
        details: `Requires ~${weeklyProjectHoursPerMember.toFixed(1)} hrs/wk, but only has ${availableEffective} hrs capacity`,
      });
    } else if (profile.currentCommitments && profile.currentCommitments.toLowerCase().includes('heavy')) {
      warnings.push({
        memberName: member.name,
        issue: 'HEAVY_COMMITMENTS',
        details: `Has heavy external commitments: "${profile.currentCommitments}"`,
      });
      feasibleCount += 0.8;
    } else {
      feasibleCount += 1.0;
    }
  }

  const feasibleRatio = feasibleCount / teamSize;
  const score = Math.round(Math.max(10, Math.min(100, feasibleRatio * 100)));

  return {
    score,
    warnings,
    averageCapacity: Math.round(capacitySum / teamSize),
    estimatedWeeklyHoursPerPerson: Number(weeklyProjectHoursPerMember.toFixed(1)),
  };
}

/**
 * Compute the comprehensive team match score
 */
export function evaluateTeamMatch(project, teamMembers, customWeights = DEFAULT_WEIGHTS) {
  validateWeights(customWeights);

  const skillAnalysis = calculateSkillCoverage(project.requirements || [], teamMembers);
  const availabilityAnalysis = calculateAvailabilityCompatibility(project.weeklyMeetingHours || 4, teamMembers);
  const interestAnalysis = calculateInterestAlignment(project, teamMembers);
  const roleAnalysis = calculateRoleCoverage(project, teamMembers);
  const workloadAnalysis = calculateWorkloadCompatibility(project, teamMembers);

  const overallScore = Math.round(
    (customWeights.skills * skillAnalysis.score) +
    (customWeights.availability * availabilityAnalysis.score) +
    (customWeights.interest * interestAnalysis.score) +
    (customWeights.role * roleAnalysis.score) +
    (customWeights.workload * workloadAnalysis.score)
  );

  // Generate explainability narrative & constructive recommendations
  const reasons = [];
  const improvements = [];

  if (skillAnalysis.score >= 80) {
    reasons.push(`Strong skill coverage (${skillAnalysis.score}%) covering critical project competencies.`);
  } else if (skillAnalysis.missingCritical.length > 0) {
    improvements.push(`Missing critical skills: ${skillAnalysis.missingCritical.map(s => s.skillName).join(', ')}.`);
  }

  if (availabilityAnalysis.overlappingHours >= (project.weeklyMeetingHours || 4)) {
    reasons.push(`High availability overlap with ${availabilityAnalysis.overlappingHours} shared weekly hours for synchronizations.`);
  } else {
    improvements.push(`Limited common time slots (${availabilityAnalysis.overlappingHours} hrs overlap). Consider asynchronous milestones.`);
  }

  if (roleAnalysis.filledRoles.length >= 3) {
    reasons.push(`Balanced role distribution covering ${roleAnalysis.filledRoles.map(r => r.role).join(', ')}.`);
  }

  if (workloadAnalysis.warnings.length === 0) {
    reasons.push('All members have adequate workload capacity for project deliverables.');
  } else {
    workloadAnalysis.warnings.forEach(w => improvements.push(`${w.memberName}: ${w.details}`));
  }

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    components: {
      skillScore: skillAnalysis.score,
      availabilityScore: availabilityAnalysis.score,
      interestScore: interestAnalysis.score,
      roleScore: roleAnalysis.score,
      workloadScore: workloadAnalysis.score,
    },
    weights: customWeights,
    analysis: {
      skills: skillAnalysis,
      availability: availabilityAnalysis,
      interests: interestAnalysis,
      roles: roleAnalysis,
      workload: workloadAnalysis,
    },
    explanations: {
      reasons,
      improvements,
    },
    teamSize: teamMembers.length,
    targetSize: project.expectedTeamSize || 4,
  };
}

/**
 * Generate candidate team recommendations from a candidate pool
 * Uses deterministic greedy search with bounded combinatorial exploration
 */
export function generateTeamRecommendations(project, candidatePool = [], options = {}) {
  const targetSize = options.targetSize || project.expectedTeamSize || 4;
  const weights = options.weights || DEFAULT_WEIGHTS;
  const maxTeamsToReturn = options.maxTeams || 5;

  if (!candidatePool || candidatePool.length < targetSize) {
    // If pool is smaller than target size, evaluate the whole pool as a single candidate
    if (candidatePool && candidatePool.length > 0) {
      const evaluation = evaluateTeamMatch(project, candidatePool, weights);
      return [{
        id: 'candidate-partial-1',
        name: 'Prospective Cohort',
        members: candidatePool,
        ...evaluation,
      }];
    }
    return [];
  }

  // Pre-score individual suitability to prioritize candidate combinations
  const scoredCandidates = candidatePool.map(student => {
    const singleEval = evaluateTeamMatch(project, [student], weights);
    return {
      student,
      individualScore: singleEval.overallScore,
    };
  }).sort((a, b) => b.individualScore - a.individualScore);

  // Generate distinct team variations:
  // 1. Top balanced team (Greedy complementary addition)
  // 2. High-skill specialist team
  // 3. High-availability/collaboration-focused team
  // 4. Mentorship/growth balanced team

  const candidateTeams = [];
  const usedCombos = new Set();

  function makeKey(members) {
    return members.map(m => m.id).sort().join('_');
  }

  // Strategy A: Greedy complementary selection
  const teamA = [];
  const poolCopyA = [...scoredCandidates.map(c => c.student)];

  // Seed with highest individual performer
  if (poolCopyA.length > 0) {
    teamA.push(poolCopyA.shift());
  }

  while (teamA.length < targetSize && poolCopyA.length > 0) {
    // Pick candidate that gives the highest marginal team score increase
    let bestCandidateIndex = 0;
    let bestMarginalScore = -1;

    for (let i = 0; i < poolCopyA.length; i++) {
      const candidate = poolCopyA[i];
      const testTeam = [...teamA, candidate];
      const evaluation = evaluateTeamMatch(project, testTeam, weights);
      if (evaluation.overallScore > bestMarginalScore) {
        bestMarginalScore = evaluation.overallScore;
        bestCandidateIndex = i;
      }
    }

    teamA.push(poolCopyA.splice(bestCandidateIndex, 1)[0]);
  }

  if (teamA.length > 0) {
    const key = makeKey(teamA);
    usedCombos.add(key);
    candidateTeams.push({
      id: 'team-opt-balanced',
      name: 'Optimal Synergy Team',
      tag: 'Best Overall Match',
      members: teamA,
      ...evaluateTeamMatch(project, teamA, weights),
    });
  }

  // Strategy B: Skill-First Specialist Team
  const skillSorted = [...candidatePool].sort((a, b) => {
    const aCount = (a.userSkills || []).length;
    const bCount = (b.userSkills || []).length;
    return bCount - aCount;
  });
  const teamB = skillSorted.slice(0, targetSize);
  if (teamB.length >= Math.min(targetSize, candidatePool.length)) {
    const key = makeKey(teamB);
    if (!usedCombos.has(key)) {
      usedCombos.add(key);
      candidateTeams.push({
        id: 'team-opt-skills',
        name: 'Technical Depth Team',
        tag: 'Highest Skill Coverage',
        members: teamB,
        ...evaluateTeamMatch(project, teamB, weights),
      });
    }
  }

  // Strategy C: Availability & Collaboration Maximized
  const availSorted = [...candidatePool].sort((a, b) => {
    const aSlots = (a.availabilitySlots || []).length;
    const bSlots = (b.availabilitySlots || []).length;
    return bSlots - aSlots;
  });
  const teamC = availSorted.slice(0, targetSize);
  if (teamC.length >= Math.min(targetSize, candidatePool.length)) {
    const key = makeKey(teamC);
    if (!usedCombos.has(key)) {
      usedCombos.add(key);
      candidateTeams.push({
        id: 'team-opt-collab',
        name: 'High Availability Cohort',
        tag: 'Max Overlap Schedule',
        members: teamC,
        ...evaluateTeamMatch(project, teamC, weights),
      });
    }
  }

  // Strategy D: Diverse / Mentorship Team (Mix top student, mid students, and eager learners)
  if (candidatePool.length >= targetSize + 2) {
    const top = scoredCandidates[0]?.student;
    const mid1 = scoredCandidates[Math.floor(scoredCandidates.length / 2)]?.student;
    const mid2 = scoredCandidates[Math.floor(scoredCandidates.length / 2) + 1]?.student;
    const lower = scoredCandidates[scoredCandidates.length - 1]?.student;
    const teamD = [top, mid1, mid2, lower].filter(Boolean).slice(0, targetSize);

    if (teamD.length >= targetSize) {
      const key = makeKey(teamD);
      if (!usedCombos.has(key)) {
        usedCombos.add(key);
        candidateTeams.push({
          id: 'team-opt-mentor',
          name: 'Mentorship & Growth Squad',
          tag: 'Balanced Learning & Mentoring',
          members: teamD,
          ...evaluateTeamMatch(project, teamD, weights),
        });
      }
    }
  }

  // Sort candidate teams by overallScore descending
  return candidateTeams
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, maxTeamsToReturn);
}
