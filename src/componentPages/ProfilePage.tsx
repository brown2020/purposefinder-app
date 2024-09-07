"use client";

import AuthDataDisplay from "@/components/AuthDataDisplay";
import ProfileComponent from "@/components/ProfileComponent";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-4">
      <div className="text-3xl font-semibold">Your Profile</div>
      <AuthDataDisplay />
      <ProfileComponent />
    </div>
  );
}
