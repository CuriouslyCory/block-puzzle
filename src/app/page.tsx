import Link from "next/link";
import { Game } from "./_components/game";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-end gap-1 bg-white py-2 md:mx-4">
        <span className="">
          {session && <span>Logged in as {session.user?.name}</span>}
        </span>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-lg px-2 py-1 font-semibold no-underline transition hover:bg-blue-900/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </header>
      {!session && (
        <h2 className="text-center text-3xl">
          Please{" "}
          <Link
            href="/api/auth/signin"
            className="rounded-lg transition hover:bg-blue-900/20"
          >
            Sign-In
          </Link>{" "}
          To Begin
        </h2>
      )}
      {session && <Game />}
    </main>
  );
}
