import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { roomId, userId, title, description, startTime, endTime } = await req.json();

    console.log("Incoming Booking Request:", { roomId, userId, startTime, endTime });

    // Ensure date consistency
    const start = new Date(startTime).toISOString();
    const end = new Date(endTime).toISOString();

    // Fetch existing bookings for debugging
    const existingBookings = await prisma.booking.findMany({
      where: { roomId },
    });

    console.log("Existing Bookings for Room:", existingBookings);

    // Prevent overlapping bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    console.log("Conflicting Booking Found:", conflictingBooking);

    if (conflictingBooking) {
      return NextResponse.json({ error: "Room is already booked in this slot." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { roomId, userId, title, description, startTime: start, endTime: end },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const authData = await auth();
  const userId = authData?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  let whereCondition = {};

  // If page=all, fetch all users' bookings; otherwise, fetch only the logged-in user's bookings
  if (page !== "all") {
    whereCondition = { userId };
  }

  const bookings = await prisma.booking.findMany({
    where: whereCondition,
    include: { room: true, user: true },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(bookings);
}
