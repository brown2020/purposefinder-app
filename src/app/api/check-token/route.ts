import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) throw new Error("Unauthorized: No token provided");

    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);
    const currentClaims = user.customClaims || {};

    if (!decodedToken) throw new Error("Unauthorized: Invalid token");

    return NextResponse.json({
      uid: decodedToken.uid,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
