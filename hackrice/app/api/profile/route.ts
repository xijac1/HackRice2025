import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: fetch current user's profile
// POST: update or create profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }, // <-- number, not string
    });

    return NextResponse.json(profile || null);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert: update if exists, create if not
    const profile = await prisma.profile.upsert({
      where: { userId: user.id }, // <-- number
      update: {
        name: data.name,
        hasAsthma: data.hasAsthma,
        hasCardioDisease: data.hasCardioDisease,
        pregnant: data.pregnant,
        ageGroup: data.ageGroup,
        lifestyleSmoking: data.lifestyleSmoking,
        lifestyleMold: data.lifestyleMold,
        sensitivity: data.sensitivity,
      },
      create: {
        userId: user.id, // <-- number
        name: data.name,
        hasAsthma: data.hasAsthma,
        hasCardioDisease: data.hasCardioDisease,
        pregnant: data.pregnant,
        ageGroup: data.ageGroup,
        lifestyleSmoking: data.lifestyleSmoking,
        lifestyleMold: data.lifestyleMold,
        sensitivity: data.sensitivity,
      },
    });

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}