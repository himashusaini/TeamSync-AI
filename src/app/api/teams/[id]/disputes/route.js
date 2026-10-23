import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createDispute, resolveDispute, logAudit } from '@/services/store';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, reason, requestedCorrection } = body;

    if (!title || !reason || !requestedCorrection) {
      return NextResponse.json({ error: 'title, reason, and requestedCorrection are required' }, { status: 400 });
    }

    const dispute = await createDispute({
      teamId: id,
      reportedById: session.id,
      title,
      reason,
      requestedCorrection,
    });

    await logAudit({
      userId: session.id,
      action: 'DISPUTE_FILED',
      entityType: 'ContributionDispute',
      entityId: dispute.id,
      details: `Dispute filed: "${title}"`,
    });

    return NextResponse.json({ success: true, dispute }, { status: 201 });
  } catch (error) {
    console.error('Dispute creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to file dispute' }, { status: 400 });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { disputeId, resolutionNotes, status } = body;

    if (!disputeId || !resolutionNotes) {
      return NextResponse.json({ error: 'disputeId and resolutionNotes are required' }, { status: 400 });
    }

    const updated = await resolveDispute({
      disputeId,
      resolvedById: session.id,
      resolutionNotes,
      newStatus: status || 'RESOLVED',
    });

    await logAudit({
      userId: session.id,
      action: 'DISPUTE_RESOLVED',
      entityType: 'ContributionDispute',
      entityId: disputeId,
      details: `Dispute status set to ${status || 'RESOLVED'}`,
    });

    return NextResponse.json({ success: true, dispute: updated });
  } catch (error) {
    console.error('Dispute resolution error:', error);
    return NextResponse.json({ error: error.message || 'Failed to resolve dispute' }, { status: 400 });
  }
}
