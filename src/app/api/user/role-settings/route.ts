import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { action, role } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'delete') {
      await prisma.patientProfile.deleteMany({ where: { userId: user.id } });
      await prisma.doctorProfile.deleteMany({ where: { userId: user.id } });
      await prisma.user.update({
        where: { id: user.id },
        data: { role: null },
      });

      return NextResponse.json({ message: 'Role and profile data deleted successfully' }, { status: 200 });
    }

    if (action === 'change' && (role === 'doctor' || role === 'patient')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });

      if (role === 'doctor') {
        await prisma.patientProfile.deleteMany({ where: { userId: user.id } });
      }

      if (role === 'patient') {
        await prisma.doctorProfile.deleteMany({ where: { userId: user.id } });
      }

      return NextResponse.json({ message: 'Role changed successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action or role' }, { status: 400 });
  } catch (error) {
    console.error('Role settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
