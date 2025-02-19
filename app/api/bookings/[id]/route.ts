import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, startTime, endTime } = await req.json();

    if (!title || !startTime || !endTime) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { title, startTime, endTime },
    });

    return new Response(JSON.stringify(updatedBooking), { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}


  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.booking.delete({ where: { id: params.id } });
      return NextResponse.json({ message: "Booking deleted" });
    } catch {
      return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
  }
  