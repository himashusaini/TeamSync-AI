import { NextResponse } from 'next/server';
import { getAllSkills } from '@/services/store';

export async function GET() {
  try {
    const skills = await getAllSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Skills fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
