import { NextResponse } from "next/server";
import {
  adminBucket as rawAdminBucket,
  adminAuth,
} from "@/firebase/firebaseAdmin";
import { Bucket } from "@google-cloud/storage";
import * as dotenv from "dotenv";

dotenv.config();

export const maxDuration = 120;
export const runtime = "nodejs";

const adminBucket = rawAdminBucket as Bucket;

export async function POST(request: Request) {
  const { message, uid = "generic" } = await request.json();

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    // Verify the token using the exported admin instance
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await fetch(
      `https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0 `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "image/jpeg",
          Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        },
        body: JSON.stringify({
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          sampler: null,
          samples: 1,
          steps: 30,
          seed: 0,
          style_preset: null,
          safety_check: false,
          prompt: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong with Eleven Labs API");
    }

    const imageData = await response.arrayBuffer();

    const filename = `generated/${uid}/${Date.now()}.jpg`;
    const file = adminBucket.file(filename);

    // Upload audio data to Firebase Storage
    await file.save(Buffer.from(imageData), {
      contentType: "image/jpeg",
    });

    // Get the URL for the uploaded file. This is a signed URL, and you can set its expiration time.
    const signedUrls = await file.getSignedUrl({
      action: "read",
      expires: "03-17-2125", // This date can be adjusted based on when you want the URL to expire.
    });

    const imageUrl = signedUrls[0]; // The URL to access the uploaded audio file

    // Return the URL in the response
    return NextResponse.json({ imageUrl: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
