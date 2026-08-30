import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// This API route handles role selection
// When a user chooses "Doctor" or "Patient", this route:
// 1. Gets the logged-in user's information
// 2. Saves the role to the database
// 3. Returns success/error message

export async function POST(request: NextRequest) {
  try {
    // Get the user's session to verify they are logged in
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the role from the request body
    const { role } = await request.json();

    // Validate the role is either "doctor" or "patient"
    if (!role || !['doctor', 'patient'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Make sure the Google user exists in the database,
    // then save the selected role.
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        role,
        name: session.user.name ?? 'User',
      },
      create: {
        email: session.user.email,
        name: session.user.name ?? 'User',
        role,
      },
    });

    if (role === 'patient') {
      await prisma.patientProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          fullName: session.user.name ?? 'Patient',
          dateOfBirth: new Date('2000-01-01'),
          gender: 'other',
          phoneNumber: '0000000000',
          city: 'Not provided',
          preferredLanguage: 'English',
        },
      });
    }

    return NextResponse.json(
      { message: 'Role saved successfully', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
