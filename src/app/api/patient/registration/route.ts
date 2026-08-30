import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// This API route handles patient registration.
// Simple meaning: it receives the form data and saves the patient information in the database.
// It also makes sure the user role is set to patient so they do not have to register again.

export async function POST(request: NextRequest) {
  try {
    // Get the logged-in user's session
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the patient data from the request
    const {
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      city,
      preferredLanguage,
    } = await request.json();

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Save or update the patient profile.
    // This is important because the patient should keep their data even if they log in again later.
    const patientProfile = await prisma.patientProfile.upsert({
      where: { userId: user.id },
      update: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phoneNumber,
        city,
        preferredLanguage,
      },
      create: {
        userId: user.id,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phoneNumber,
        city,
        preferredLanguage,
      },
    });

    // Set the user role to patient after successful registration.
    // This makes future logins know the person is a patient and not ask them to register again.
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'patient' },
    });

    return NextResponse.json(
      { message: 'Patient profile created successfully', patientProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating patient profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
