import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const capacity = searchParams.get("capacity");
  const amenities = searchParams.get("amenities");

  const rooms = await prisma.room.findMany({
    where: {
      capacity: capacity ? Number(capacity) : undefined,
      amenities: amenities ? { array_contains: JSON.parse(amenities) } : undefined,
    },
  });

  return NextResponse.json(rooms);
}


export async function POST(req: Request) {
  const { userId } =await auth();
  const { name, capacity, amenities, imageUrl } = await req.json();
  console.log("Fetching user with ID:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  

  const room = await prisma.room.create({ data: { name, capacity, amenities, imageUrl } });
  return NextResponse.json(room);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  const { id, name, capacity, amenities, imageUrl } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedRoom = await prisma.room.update({
    where: { id },
    data: { name, capacity, amenities, imageUrl },
  });

  return NextResponse.json(updatedRoom);
}
export async function DELETE(req: Request) {
  const { userId } = await auth();
  const { id } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.room.delete({ where: { id } });

  return NextResponse.json({ message: "Room deleted successfully" });
}