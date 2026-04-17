import { auth } from "@/auth";
import { logout } from "../actions";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const session = await auth();

  // Manual guard: if no session, kick them back to home
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome, {session.user?.name}</h1>
        <p className="text-zinc-400">{session.user?.email}</p>
      </div>

      <form action={logout}>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg">
          Logout
        </button>
      </form>
    </div>
  );
}
