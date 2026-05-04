import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex max-w-5xl justify-center">
        <UserProfile path="/user-profile" routing="path" />
      </div>
    </main>
  );
}
