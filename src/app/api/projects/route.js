import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllProjects, createProject, logAudit } from '@/services/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let projects = await getAllProjects();

    if (category && category !== 'ALL') {
      projects = projects.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      expectedTeamSize,
      weeklyMeetingHours,
      workloadHours,
      deadline,
      requirements,
      milestones,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const project = await createProject({
      title,
      description,
      category: category || 'Web Development',
      expectedTeamSize: expectedTeamSize || 4,
      weeklyMeetingHours: weeklyMeetingHours || 4,
      workloadHours: workloadHours || 60,
      deadline,
      ownerId: session.id,
      requirements: requirements || [],
      milestones: milestones || [],
    });

    await logAudit({
      userId: session.id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project.id,
      details: `Project "${project.title}" created with team size ${project.expectedTeamSize}`,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 400 });
  }
}
