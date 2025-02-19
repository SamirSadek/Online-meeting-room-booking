"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: { name: string };
}

export default function BookingPage() {
  const { user } = useUser();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedStartTime, setUpdatedStartTime] = useState("");
  const [updatedEndTime, setUpdatedEndTime] = useState("");

  const { data: userBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["userBookings", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings`);
      return res.data;
    },
    enabled: !!userId,
  });

  const deleteBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      await axios.delete(`/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings", userId] });
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({
      bookingId,
      title,
      startTime,
      endTime,
    }: {
      bookingId: string;
      title: string;
      startTime: string;
      endTime: string;
    }) => {
      await axios.put(`/api/bookings/${bookingId}`, {
        title,
        startTime: new Date(startTime).toISOString(), // Ensure valid ISO format
        endTime: new Date(endTime).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings", userId] });
      setEditingBooking(null);
    },
  });

  if (isLoading) return <p>Loading your bookings...</p>;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto py-10 ">
        <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
        {userBookings?.length ? (
          <ul>
            {userBookings.map((booking) => (
              <li key={booking.id} className="border p-2 my-2">
                {editingBooking === booking.id ? (
                  <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                      Edit Booking
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                          Title
                        </label>
                        <input
                          type="text"
                          value={updatedTitle}
                          onChange={(e) => setUpdatedTitle(e.target.value)}
                          placeholder="Enter new title"
                          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          value={updatedStartTime}
                          onChange={(e) => setUpdatedStartTime(e.target.value)}
                          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          value={updatedEndTime}
                          onChange={(e) => setUpdatedEndTime(e.target.value)}
                          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <Button
                          onClick={() =>
                            updateBooking.mutate({
                              bookingId: booking.id,
                              title: updatedTitle,
                              startTime: updatedStartTime,
                              endTime: updatedEndTime,
                            })
                          }
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingBooking(null)}
                          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-2xl">
                    {/* Left Section: Booking Details */}
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {booking.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Room:</strong> {booking.room.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Starting Time:</strong>{" "}
                          {new Date(booking.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Ending Time:</strong>{" "}
                          {new Date(booking.endTime).toLocaleString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-4">
                        <Button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                          onClick={() => {
                            setEditingBooking(booking.id);
                            setUpdatedTitle(booking.title);
                            setUpdatedStartTime(booking.startTime);
                            setUpdatedEndTime(booking.endTime);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                          onClick={() => deleteBooking.mutate(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Right Section: Room Image */}
                    <div className="md:w-1/3 flex items-center justify-center">
                      <img
                        className="w-full h-[150px] rounded-lg object-cover shadow-md"
                        src={booking.room.imageUrl}
                        alt="Room Image"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found for you.</p>
        )}
      </div>
    </div>
  );
}
