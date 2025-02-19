"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

// ✅ Define Room Schema with Proper Type Validation
const roomSchema = z.object({
  name: z.string().min(3, "Room name is required"),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Capacity must be at least 1")
  ),
  amenities: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

interface Room {
  id: string;
  name: string;
  amenities: string[];
  capacity: number;
  imageUrl?: string;
  updatedAt: string;
}

export default function UpdateRoom({ params }: { params: { id: string } }) {
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
  });

  // ✅ Fetch Room Data from API
  useEffect(() => {
    if (!params.id) return;
    const fetchRoomData = async () => {
      try {
        const res = await fetch(`/api/rooms/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch room data");

        const data: Room = await res.json();
        setRoomData(data);

        // ✅ Set Form Default Values
        setValue("name", data.name);
        setValue("capacity", data.capacity);
        setValue("amenities", data.amenities.join(", "));
        setValue("imageUrl", data.imageUrl ?? "");
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchRoomData();
  }, [params.id, setValue]);

  // ✅ Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "samire");
    formData.append("cloud_name", "dxox6rap3");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxox6rap3/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Image upload failed");

      return data.secure_url;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // ✅ Handle Form Submission
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Upload image if new image is selected
    let imageUrl = data.imageUrl;
    if (imageFile) {
      const uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        setError("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = uploadedImageUrl;
    }

    try {
      const response = await fetch(`/api/rooms/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          capacity: Number(data.capacity), // Ensure capacity is a number
          amenities: data.amenities
            ? data.amenities.split(",").map((a:string) => a.trim())
            : [],
          imageUrl,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Something went wrong");
      }

      setSuccess("Room updated successfully!");
      router.refresh(); // Refresh the page after successful update
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!roomData) return <p>Loading room data...</p>;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Update Room</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Room Name</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input
              type="number"
              {...register("capacity")}
              className="w-full p-2 border rounded"
            />
            {errors.capacity && (
              <p className="text-red-500">{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Amenities (Comma separated)
            </label>
            <input
              {...register("amenities")}
              className="w-full p-2 border rounded"
            />
            {errors.amenities && (
              <p className="text-red-500">{errors.amenities.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
            {imageFile && <p>Selected: {imageFile.name}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {loading ? "Updating Room..." : "Update Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
