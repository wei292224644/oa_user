"use client";

import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation } from "@tanstack/react-query";

export function UserPanel() {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.auth.me.queryOptions());

  const logout = useMutation(trpc.auth.logout.mutationOptions({
    onSuccess: () => {
      authClient.clearToken();
      router.refresh();
    },
  }));

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-bold">{user.name ?? user.phone}</h2>
        <p className="text-muted-foreground text-sm">{user.phone}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.role === "ADMIN"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          {user.role}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        {logout.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
