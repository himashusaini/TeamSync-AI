import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { submitPeerFeedback, logAudit } from '@/services/store';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { toUserId, rating, strengths, improvements, anonymous } = body;

    if (!toUserId || !rating || !strengths) {
      return NextResponse.json({ error: 'toUserId, rating, and strengths are required' }, { status: 400 });
    }

    const feedback = await submitPeerFeedback({
      teamId: id,
      fromUserId: session.id,
      toUserId,
      rating,
      strengths,
      improvements: improvements || '',
      anonymous: Boolean(anonymous),
    });

    await logAudit({
      userId: session.id,
      action: 'PEER_FEEDBACK_SUBMITTED',
      entityType: 'PeerFeedback',
      entityId: feedback.id,
      details: `Rating ${rating} submitted for user ${toUserId}`,
    });

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('Peer feedback error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit feedback' }, { status: 400 });
  }
}
