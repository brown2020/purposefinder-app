"use client";

import AuthDataDisplay from "@/features/auth/AuthDataDisplay";
import ProfileComponent from "@/features/profile/ProfileComponent";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <AuthDataDisplay />
      <ProfileComponent />
    </div>
  );
}
