import { useAuthStore } from "@/stores";

export default function AuthDataDisplay() {
  const authEmail = useAuthStore((s) => s.authEmail);

  return (
    <div className="flex flex-col px-5 py-3 space-y-3 border border-gray-500 rounded-md">
      <div className="flex flex-col space-y-1">
        <div className="text-sm">Login email</div>
        <div className="px-3 py-2 text-black bg-gray-400 rounded-md">
          {authEmail}
        </div>
      </div>
    </div>
  );
}
