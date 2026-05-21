import { cookies } from "next/headers";

import { verifyToken } from "@acme/auth";

import { HydrateClient } from "~/trpc/server";
import { LoginForm } from "./_components/login-form";
import { UserPanel } from "./_components/user-panel";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">OA System</h1>
          <p className="text-muted-foreground">Phone + OTP Login</p>
        </div>
        <LoginForm />
      </main>
    );
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">OA System</h1>
          <p className="text-muted-foreground">Dashboard</p>
        </div>
        <UserPanel />
      </main>
    </HydrateClient>
  );
}
