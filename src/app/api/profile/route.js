import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { findUserById, updateUserProfile, logAudit } from '@/services/store';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await findUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatedUser = await updateUserProfile(session.id, body);

    await logAudit({
      userId: session.id,
      action: 'PROFILE_UPDATED',
      entityType: 'StudentProfile',
      entityId: session.id,
      details: 'Updated profile, skills, and availability',
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 400 });
  }
}
