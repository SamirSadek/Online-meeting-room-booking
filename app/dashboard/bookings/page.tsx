"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: { name: string; imageUrl?: string };
}

export default function AllBookingsPage() {
  const { user, isLoaded } = useUser(); // ✅ Hook is always called at the top level
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedStartTime, setUpdatedStartTime] = useState("");
  const [updatedEndTime, setUpdatedEndTime] = useState("");

  const { data: allBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?page=all`);
      return res.data;
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      await axios.delete(`/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
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
        startTime,
        endTime,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      setEditingBooking(null);
    },
  });

  return (
    <div className="max-w-7xl  mt-10 px-4">
      {/* ✅ Handle loading & authentication inside JSX */}
      {!isLoaded ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : !user ? (
        <RedirectToSignIn />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📅 All Bookings
          </h1>

          {isLoading ? (
            <p className="text-center text-lg text-gray-600">
              Loading all bookings...
            </p>
          ) : allBookings?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {editingBooking === booking.id ? (
                    <div className="p-5 space-y-3">
                      <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        placeholder="Update Title"
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="datetime-local"
                        value={updatedStartTime}
                        onChange={(e) => setUpdatedStartTime(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="datetime-local"
                        value={updatedEndTime}
                        onChange={(e) => setUpdatedEndTime(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                      <div className="flex justify-between gap-3">
                        <Button
                          className="w-full"
                          onClick={() =>
                            updateBooking.mutate({
                              bookingId: booking.id,
                              title: updatedTitle,
                              startTime: updatedStartTime,
                              endTime: updatedEndTime,
                            })
                          }
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setEditingBooking(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 space-y-4">
                      {/* Room Image */}
                      <div className="h-48 w-full overflow-hidden rounded-lg">
                        <img
                          src={booking.room.imageUrl}
                          alt="Room"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Booking Info */}
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {booking.room.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          <b className="text-orange-500">Title:</b>{" "}
                          {booking.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          <b className="text-orange-500">Start:</b>{" "}
                          {new Date(booking.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <b className="text-orange-500">End:</b>{" "}
                          {new Date(booking.endTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <b className="text-orange-500">Booked By:</b>{" "}
                          {user.firstName} {user.lastName}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center gap-4 mt-4">
                        <Button
                          className="w-full"
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
                          className="w-full"
                          onClick={() => deleteBooking.mutate(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600">
              No bookings found.
            </p>
          )}
        </>
      )}
    </div>
  );
}
