import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createTask, updateTaskStatus, logAudit } from '@/services/store';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      priority,
      assignedToId,
      dueDate,
      estimatedHours,
      acceptanceCriteria,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const task = await createTask({
      teamId: id,
      title,
      description: description || '',
      priority: priority || 'MEDIUM',
      assignedToId: assignedToId || null,
      createdById: session.id,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 4,
      acceptanceCriteria,
    });

    await logAudit({
      userId: session.id,
      action: 'TASK_CREATED',
      entityType: 'Task',
      entityId: task.id,
      details: `Created task "${title}" in team ${id}`,
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create task' }, { status: 400 });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { taskId, status, blockerDescription } = body;

    if (!taskId || !status) {
      return NextResponse.json({ error: 'taskId and status are required' }, { status: 400 });
    }

    const task = await updateTaskStatus(taskId, status, session.id, blockerDescription);

    await logAudit({
      userId: session.id,
      action: 'TASK_STATUS_UPDATED',
      entityType: 'Task',
      entityId: taskId,
      details: `Status transitioned to ${status}`,
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update task' }, { status: 400 });
  }
}
