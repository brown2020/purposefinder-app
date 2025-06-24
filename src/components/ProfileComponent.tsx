"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { auth, db, storage } from "@/lib/firebase/firebaseConfig";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import dynamic from "next/dynamic";

import { ClipLoader } from "react-spinners";
import { useAuthStore } from "@/stores/useAuthStore";
import { resizeImage } from "@/lib/utils/resizeImage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfile } from "@/stores";

// Dynamic import for heavy SavedStatementUpdate component
const SavedStatementUpdate = dynamic(() => import("./SavedStatementUpdate"), {
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <ClipLoader color="#3B82F6" size={40} />
      <span className="ml-3 text-gray-600">Loading statements...</span>
    </div>
  ),
  ssr: false, // Disable SSR for this component since it uses canvas/DOM APIs
});

export default function ProfileComponent() {
  const uid = useAuthStore((s) => s.uid);
  const { profile, updateProfile } = useProfile();
  const [newProfile, setNewProfile] = useState(profile || {
    firstName: "",
    lastName: "",
    contactEmail: "",
    photoUrl: "",
    uid: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setNewProfile(profile || {
      firstName: "",
      lastName: "",
      contactEmail: "",
      photoUrl: "",
      uid: ""
    });
  }, [profile]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const files = e.target.files;
      if (!files || !files[0]) throw new Error("No file selected");

      const resizedBlob = await resizeImage(files[0]);
      const storageRef = ref(storage, `users/${uid}/profile.png`);
      await uploadBytesResumable(storageRef, resizedBlob);

      if (!storageRef) throw new Error("Error uploading file");

      const updatedUrl = await getDownloadURL(storageRef);
      setNewProfile({ ...newProfile, photoUrl: updatedUrl });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error uploading file: ", error.message);
      } else {
        console.error("An unknown error occurred during file upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    newProfile.firstName !== profile.firstName ||
    newProfile.lastName !== profile.lastName ||
    newProfile.contactEmail !== profile.contactEmail ||
    newProfile.photoUrl !== profile.photoUrl;

  const handleSubmit = async () => {
    try {
      if (!uid) throw new Error("No user found");
      const userRef = uid ? doc(db, "users", uid) : null;
      if (!userRef) throw new Error("Error saving to Firestore");

      updateProfile({
        firstName: newProfile.firstName || "",
        lastName: newProfile.lastName || "",
        photoUrl: newProfile.photoUrl || "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving to Firestore:", error.message);
      } else {
        console.error("An unknown error occurred while saving to Firestore.");
      }
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace("/introrouter/identify");
      })
      .catch((error) => {
        console.error("Error during sign out:", error.message);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full px-4 py-3 gap-3 border border-gray-500 rounded-md">
        <div className="flex flex-col sm:flex-row w-full gap-3 ">
          <div className="relative w-56 aspect-square">
            {newProfile.photoUrl && (
              <Image
                width={512}
                height={512}
                src={newProfile.photoUrl}
                alt="User"
                className="object-cover rounded-md"
                priority={true}
              />
            )}
            {!newProfile.photoUrl && (
              <div className="flex h-full items-center justify-center bg-gray-300 rounded-md">
                <span>Click to upload</span>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50 rounded-md">
                <ClipLoader color="#4A90E2" />
              </div>
            )}

            <div className="absolute z-10 top-0 left-0 h-full w-full opacity-0 bg-black hover:opacity-50 cursor-pointer">
              <input
                className="opacity-0 h-full w-full"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <div className="text-sm">{"First Name"}</div>
              <input
                className="px-3 py-2 text-black border border-gray-700 rounded-md"
                type="text"
                value={newProfile?.firstName || ""}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, firstName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm">{"Last Name"}</div>
              <input
                className="px-3 py-2 text-black border border-gray-700 rounded-md"
                type="text"
                value={newProfile?.lastName || ""}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, lastName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm">{"Contact Email"}</div>
              <input
                className="px-3 py-2 text-black border border-gray-700 rounded-md"
                type="text"
                value={newProfile?.contactEmail || ""}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, contactEmail: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <button
          className="btn btn-blue flex-1 mx-auto w-full"
          type="button"
          disabled={!hasChanges}
          onClick={handleSubmit}
        >
          Save Profile Changes
        </button>
      </div>

      <SavedStatementUpdate />

      <div className="flex gap-2">
        <button
          className="btn btn-muted flex-1"
          type="button"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
