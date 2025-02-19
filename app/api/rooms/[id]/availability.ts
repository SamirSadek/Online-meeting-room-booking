import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const roomId = params.id;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
  
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        startTime: { gte: new Date(date + "T00:00:00Z") },
        endTime: { lt: new Date(date + "T23:59:59Z") },
      },
      select: { startTime: true, endTime: true },
    });
  
    return NextResponse.json(bookings);
  }
  