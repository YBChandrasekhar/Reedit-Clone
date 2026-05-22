import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type))
    return NextResponse.json({ error: "Only JPEG, PNG, WEBP and GIF are allowed" }, { status: 400 });

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "reddit-clone", resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result as { secure_url: string });
      }
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
