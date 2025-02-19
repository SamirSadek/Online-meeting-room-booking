"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hospital } from "lucide-react";

interface Room {
  id: string;
  name: string;
  amenities: string[];
  capacity: number;
  imageUrl?: string;
  updatedAt: string;
}

export default function Rooms() {
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("/api/rooms");
      return res.data;
    },
  });

  const { mutate: deleteRoom, status: deleteStatus } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: async (roomId: string) => {
      await axios.delete(`/api/rooms/${roomId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  if (isLoading) return <p>Loading rooms...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 max-w-7xl mx-auto p-5 pt-36">
      {rooms?.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Room Image */}
          <div className="h-56 w-full overflow-hidden">
            <img
              alt="Room"
              className="h-full w-full object-cover"
              src={room?.imageUrl ?? "https://via.placeholder.com/300"}
            />
          </div>

          {/* Room Details */}
          <div className="p-5 space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Hospital className="text-orange-500" />
              {room.name}
            </h2>

            <p className="text-sm text-gray-600">
              <b className="text-orange-500">Amenities:</b>{" "}
              {Array.isArray(room.amenities) && room.amenities.length > 0
                ? room.amenities.join(", ")
                : "No amenities available"}
            </p>

            {/* Capacity & Updated Time */}
            <div className="flex justify-between text-gray-700 text-sm">
              <span className="flex items-center gap-1">
                <b>Capacity:</b> {room.capacity}
              </span>
              <span className="flex items-center gap-1">
                <b>Updated:</b> {new Date(room.updatedAt).toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between items-center mt-4">
              <Link href={`/dashboard/all-rooms/${room.id}`} className="w-full">
                <Button className="w-full">Update</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => deleteRoom(room.id)}
                disabled={deleteStatus === "pending"}
                className="w-full"
              >
                {deleteStatus === "pending" ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
