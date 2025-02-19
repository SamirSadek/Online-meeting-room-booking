import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, email, name, imageUrl } = await req.json();

  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      // Create user in database if they don't exist
      user = await prisma.user.create({
        data: { id, email, name, imageUrl },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}