import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { submitDeliverable, reviewDeliverable, logAudit } from '@/services/store';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { taskId, title, fileUrlOrLink, notes } = body;

    if (!taskId || !title || !fileUrlOrLink) {
      return NextResponse.json({ error: 'taskId, title, and fileUrlOrLink are required' }, { status: 400 });
    }

    const deliverable = await submitDeliverable({
      teamId: id,
      taskId,
      submittedById: session.id,
      title,
      fileUrlOrLink,
      notes,
    });

    await logAudit({
      userId: session.id,
      action: 'DELIVERABLE_SUBMITTED',
      entityType: 'Deliverable',
      entityId: deliverable.id,
      details: `Submitted deliverable for task ${taskId}`,
    });

    return NextResponse.json({ success: true, deliverable }, { status: 201 });
  } catch (error) {
    console.error('Deliverable submit error:', error);
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 400 });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { deliverableId, decision, comments, score } = body;

    if (!deliverableId || !decision || !comments) {
      return NextResponse.json({ error: 'deliverableId, decision, and comments are required' }, { status: 400 });
    }

    const result = await reviewDeliverable({
      deliverableId,
      reviewerId: session.id,
      decision,
      comments,
      score,
    });

    await logAudit({
      userId: session.id,
      action: 'DELIVERABLE_REVIEWED',
      entityType: 'Deliverable',
      entityId: deliverableId,
      details: `Review decision: ${decision}`,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Deliverable review error:', error);
    return NextResponse.json({ error: error.message || 'Review failed' }, { status: 400 });
  }
}
