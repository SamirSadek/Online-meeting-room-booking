import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  console.log("Fetching room from DB:", id); // Debug log

  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      console.log("Room not found:", id);
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract ID from URL path

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Ensure the id is not undefined or null before trying to delete
    if (!id) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const deletedRoom = await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Room deleted successfully",
      room: deletedRoom,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Handle PUT request to update room
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;
    if (!roomId)
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );

    const body = await req.json();
    const { name, capacity, amenities, imageUrl } = body;

    // ✅ Ensure Capacity is a number
    const parsedCapacity = Number(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return NextResponse.json({ error: "Invalid capacity" }, { status: 400 });
    }

    // ✅ Update Room in Database
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name,
        capacity: parsedCapacity,
        amenities: Array.isArray(amenities)
          ? amenities
          : amenities.split(",").map((a:string) => a.trim()),
        imageUrl,
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (error: any) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
