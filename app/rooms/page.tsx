"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, Hospital, Users } from "lucide-react";
import Image from "next/image";
import axios from "axios";

// Define the Room type
interface Room {
  id: string;
  name: string;
  imageUrl?: string;
  amenities: string[];
  capacity: number;
  updatedAt: string;
}

async function fetchRooms() {
  try {
    const response = await axios.get("/api/rooms"); 
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch rooms");
  }
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const roomsData = await fetchRooms();
        setRooms(roomsData);
      } catch (err) {
        setError("Failed to fetch rooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-orange-50 py-10">
      <div className="flex flex-col text-center w-full mb-12 ">
        <h1 className="sm:text-3xl text-xl font-bold title-font mb-4 text-gray-900">
          Available Rooms
        </h1>
        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
          Book a Meeting for Your Meeting
        </p>
      </div>
      <div className="grid grid-cols-3 gap-5 max-w-7xl mx-auto">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-5 md:w-96 sm:mb-0 mb-6 shadow-lg bg-white rounded-xl transition-all hover:shadow-2xl"
          >
            {/* Room Image */}
            <div className="rounded-lg overflow-hidden shadow-md">
              {room?.imageUrl && (
                <Image
                  alt="Room Image"
                  className="object-cover object-center w-full h-64"
                  src={room.imageUrl}
                  width={300}
                  height={300}
                />
              )}
            </div>

            {/* Room Title */}
            <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-900 mt-4">
              <Hospital className="text-orange-500" />
              {room.name}
            </h2>

            {/* Amenities */}
            <p className="mt-2 text-gray-700">
              <b className="text-orange-500">Amenities: </b>
              {Array.isArray(room.amenities)
                ? room.amenities.join(", ")
                : "No amenities available"}
            </p>

            {/* Room Details */}
            <div className="flex items-center justify-between text-gray-600 mt-3 text-sm">
              <div className="flex gap-2 items-center">
                <Users className="w-4 h-4 text-gray-500" />
                <p className="font-medium">Capacity: {room.capacity}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="font-medium">
                  Updated: {new Date(room.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Book Now Button */}
            <Link
              href={`/rooms/${room.id}`}
              className="flex justify-end items-center mt-4"
            >
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                Book Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
