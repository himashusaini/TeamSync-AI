import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { addTeamMember, logAudit } from '@/services/store';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, role } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedTeam = await addTeamMember(id, userId, role || 'MEMBER');

    await logAudit({
      userId: session.id,
      action: 'TEAM_MEMBER_ADDED',
      entityType: 'Team',
      entityId: id,
      details: `Added user ${userId} as ${role || 'MEMBER'}`,
    });

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add member' }, { status: 400 });
  }
}
