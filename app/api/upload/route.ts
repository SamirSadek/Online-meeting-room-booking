import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;
  
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: JSON.stringify({
        file: buffer.toString("base64"),
        upload_preset: "your_upload_preset",
      }),
      headers: { "Content-Type": "application/json" },
    });
  
    const data = await response.json();
    return NextResponse.json({ imageUrl: data.secure_url });
  }
  