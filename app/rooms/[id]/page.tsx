"use client";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader, Users } from "lucide-react";

type Room = {
  id: string;
  name: string;
  capacity: number;
  imageUrl?: string;
};

type Booking = {
  roomId: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
};

export default function RoomPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const { register, handleSubmit } = useForm<Booking>();

  const { data: room, isLoading } = useQuery<Room>({
    queryKey: ["room", id],
    queryFn: async () => {
      const res = await axios.get(`/api/rooms/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const createBooking = useMutation({
    mutationFn: async (newBooking: Booking) => {
      await axios.post("/api/bookings", newBooking);
    },
    onSuccess: () => {
      alert("Room booked successfully!");
      router.push("/rooms");
    },
    onError: () => {
      alert(
        "Booking failed. Room might already be booked for the selected time."
      );
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!room) return <p>Room not found.</p>;

  const onSubmit = (data: Booking) => {
    if (!userId) {
      alert("You must be logged in to book a room.");
      return;
    }
    createBooking.mutate({ ...data, roomId: id, userId });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      {/* Room Image */}
      {room.imageUrl && (
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      )}

      {/* Room Info */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
        <p className="text-gray-600 text-lg">
          <Users className="inline-block text-orange-500 w-5 h-5 mr-2" />
          Capacity: {room.capacity}
        </p>
      </div>

      {/* Booking Form */}
      <h2 className="text-xl font-semibold mt-6 text-gray-900">
        Book This Room
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            placeholder="Enter title"
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            placeholder="Enter description"
            {...register("description")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-700 font-medium">Start Time</label>
          <input
            type="datetime-local"
            {...register("startTime", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-gray-700 font-medium">End Time</label>
          <input
            type="datetime-local"
            {...register("endTime", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createBooking.isPending}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition-all flex justify-center items-center"
        >
          {createBooking.isPending ? (
            <div className="flex items-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              Booking...
            </div>
          ) : (
            "Book Now"
          )}
        </button>
      </form>
    </div>
  );
}
