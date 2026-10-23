import { NextResponse } from 'next/server';
import { getProjectById, getAllStudentCandidates } from '@/services/store';
import {
  DEFAULT_WEIGHTS,
  validateWeights,
  generateTeamRecommendations,
  evaluateTeamMatch,
} from '@/services/matching';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const allCandidates = await getAllStudentCandidates();

    // Filter out candidates already assigned or project owner if desired, or include all for recommendation
    const recommendations = generateTeamRecommendations(project, allCandidates, {
      targetSize: project.expectedTeamSize || 4,
      weights: DEFAULT_WEIGHTS,
    });

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        expectedTeamSize: project.expectedTeamSize,
        weeklyMeetingHours: project.weeklyMeetingHours,
      },
      weights: DEFAULT_WEIGHTS,
      candidatePoolCount: allCandidates.length,
      recommendations,
    });
  } catch (error) {
    console.error('Match recommendation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate recommendations' }, { status: 500 });
  }
}

/**
 * POST endpoint for the What-If Team Simulator
 * Accepts:
 *  - weights: { skills, availability, interest, role, workload }
 *  - memberIds: array of student user IDs
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const weights = body.weights || DEFAULT_WEIGHTS;
    validateWeights(weights);

    const allCandidates = await getAllStudentCandidates();

    // If specific memberIds are provided (What-if composition mode)
    if (body.memberIds && Array.isArray(body.memberIds)) {
      const selectedMembers = allCandidates.filter(c => body.memberIds.includes(c.id));
      const evaluation = evaluateTeamMatch(project, selectedMembers, weights);

      return NextResponse.json({
        type: 'CUSTOM_COMPOSITION_EVALUATION',
        members: selectedMembers,
        ...evaluation,
      });
    }

    // Otherwise, generate candidate teams with the custom weights
    const recommendations = generateTeamRecommendations(project, allCandidates, {
      targetSize: body.targetSize || project.expectedTeamSize || 4,
      weights,
    });

    return NextResponse.json({
      type: 'RECOMMENDATIONS_WITH_CUSTOM_WEIGHTS',
      weights,
      recommendations,
    });
  } catch (error) {
    console.error('What-if simulator evaluation error:', error);
    return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 400 });
  }
}
