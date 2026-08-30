import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name ?? data.fullName ?? 'Doctor', role: 'doctor' },
      create: {
        email: session.user.email,
        name: session.user.name ?? data.fullName ?? 'Doctor',
        role: 'doctor',
      },
    });

    await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {
        fullName: data.fullName,
        age: Number(data.age),
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        clinicName: data.clinicName,
        clinicAddress: data.clinicAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        consultationLocation: data.consultationLocation,
        languages: data.languages,
        medicalQualification: data.medicalQualification,
        specialization: data.specialization,
        medicalRegistrationNumber: data.medicalRegistrationNumber,
        medicalCouncil: data.medicalCouncil,
        yearsOfExperience: Number(data.yearsOfExperience),
        areasOfExpertise: data.areasOfExpertise,
        commonConditionsTreated: data.commonConditionsTreated,
        consultationType: data.consultationType,
        verificationDocument: data.verificationDocument || null,
        verificationStatus: 'pending',
      },
      create: {
        userId: user.id,
        fullName: data.fullName,
        age: Number(data.age),
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        clinicName: data.clinicName,
        clinicAddress: data.clinicAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        consultationLocation: data.consultationLocation,
        languages: data.languages,
        medicalQualification: data.medicalQualification,
        specialization: data.specialization,
        medicalRegistrationNumber: data.medicalRegistrationNumber,
        medicalCouncil: data.medicalCouncil,
        yearsOfExperience: Number(data.yearsOfExperience),
        areasOfExpertise: data.areasOfExpertise,
        commonConditionsTreated: data.commonConditionsTreated,
        consultationType: data.consultationType,
        verificationDocument: data.verificationDocument || null,
        verificationStatus: 'pending',
      },
    });

    return NextResponse.json({ message: 'Doctor registration saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Doctor registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
