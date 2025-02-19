"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const roomSchema = z.object({
  name: z.string().min(3, "Room name is required"),
  capacity: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Capacity must be a number",
    })
    .transform((val) => Number(val)),
  amenities: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export default function AddRoomForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
  });

  // ✅ Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "samire"); // Change this
    formData.append("cloud_name", "dxox6rap3"); // Change this

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxox6rap3/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      setUploadingImage(false);
      return data.secure_url; // Image URL from Cloudinary
    } catch (err: any) {
      setUploadingImage(false);
      console.error("Image upload failed:", err);
      setError(err.message);
      return null;
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Upload image first
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
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          capacity: Number(data.capacity), // Ensure capacity is a number
          amenities: data.amenities
            ? data.amenities.split(",").map((a) => a.trim())
            : [],
          imageUrl,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Something went wrong");
      }

      setSuccess("Room added successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add a New Room</h2>

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
              Amenities (JSON Format)
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
            {uploadingImage && (
              <p className="text-blue-500">Uploading image...</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {loading ? "Adding Room..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
