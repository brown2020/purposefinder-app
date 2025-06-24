"use client";

import AuthDataDisplay from "@/components/AuthDataDisplay";
import ProfileComponent from "@/components/ProfileComponent";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <AuthDataDisplay />
      <ProfileComponent />
    </div>
  );
}
