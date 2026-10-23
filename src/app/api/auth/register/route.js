import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, logAudit } from '@/services/store';
import { hashPassword, signToken, setSessionCookie } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().optional().default('Computer Science'),
  academicYear: z.coerce.number().min(1).max(5).default(3),
  role: z.enum(['STUDENT', 'PROJECT_OWNER']).optional().default('STUDENT'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0]?.message || 'Validation failed' }, { status: 400 });
    }

    const { name, email, password, department, academicYear, role } = result.data;
    const passwordHash = await hashPassword(password);

    const user = await createUser({
      name,
      email,
      passwordHash,
      department,
      academicYear,
      role,
    });

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);
    await logAudit({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      details: `New account created: ${user.name} (${user.role})`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
