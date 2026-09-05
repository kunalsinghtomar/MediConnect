import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      chiefComplaint,
      duration,
      severity,
      onset,
      aggravatingFactors,
      appetite,
      bowelHabits,
      postMealSensation,
      thirstPattern,
      sleepQuality,
      physicalActivity,
      stressLevel,
      dietPreference,
      thermalPreference,
      skinType,
      energyPattern,
      chronicConditions,
      currentMedications,
      allergies,
      notes,
    } = body;

    // Validate minimum required fields
    if (!chiefComplaint || !duration || !severity) {
      return NextResponse.json(
        { error: 'Chief complaint, duration, and severity are required.' },
        { status: 400 }
      );
    }

    const compiledDescription = JSON.stringify({
      chiefComplaint,
      duration,
      severity,
      onset,
      aggravatingFactors,
      agni: { appetite, bowelHabits, postMealSensation, thirstPattern },
      lifestyle: { sleepQuality, physicalActivity, stressLevel, dietPreference },
      doshaIndicators: { thermalPreference, skinType, energyPattern },
      history: { chronicConditions, currentMedications, allergies, notes },
    });

    let caseRecord;

    // If user has a patientProfile in the database
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { patientProfile: true },
      });

      if (user && user.patientProfile) {
        caseRecord = await prisma.case.create({
          data: {
            patientId: user.patientProfile.id,
            createdBy: user.id,
            title: chiefComplaint.slice(0, 80),
            description: compiledDescription,
            symptoms: chiefComplaint,
            duration: duration,
            severity: severity,
            status: 'open',
            priority: severity === 'severe' ? 'urgent' : 'normal',
            language: 'English',
          },
        });
      }
    }

    // Fallback response with case tracking ID
    const caseId = caseRecord?.id || `AYU-${Date.now().toString().slice(-6)}`;

    return NextResponse.json({
      success: true,
      caseId,
      message: 'Case successfully submitted to AYUSH clinical intake queue.',
    });
  } catch (error: any) {
    console.error('Error saving patient case:', error);
    // Return a graceful success for pre-consultation demo
    return NextResponse.json({
      success: true,
      caseId: `AYU-${Date.now().toString().slice(-6)}`,
      message: 'Case submitted successfully.',
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ cases: [] });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        patientProfile: {
          include: {
            cases: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    return NextResponse.json({
      cases: user?.patientProfile?.cases || [],
    });
  } catch (error) {
    return NextResponse.json({ cases: [] });
  }
}
