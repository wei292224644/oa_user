"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";

export function LoginForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const login = useMutation(trpc.auth.login.mutationOptions({
    onSuccess: async (data) => {
      await authClient.setToken(data.token);
      router.refresh();
      router.push("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("Invalid phone number");
      return;
    }
    login.mutate({ phone, code });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="13800138000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="code">Verification Code</Label>
        <Input
          id="code"
          type="text"
          placeholder="1234"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <p className="text-muted-foreground text-xs">Demo code: 1234</p>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={login.isPending} className="w-full">
        {login.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
