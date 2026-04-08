"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { setCredentials } from "@/redux/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [loginMutation] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && token) {
      router.replace("/dashboard");
    }
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setSubmitting(true);

      const res = await loginMutation({ email, password }).unwrap();

      dispatch(
        setCredentials({
          user: res.user,
          token: res.access_token,
        }),
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Invalid credentials. Check your email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (user && token) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-card-foreground">Task Flow</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@taskflow.com"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="rounded-md bg-muted p-3 text-xs space-y-1">
            <p className="font-medium text-foreground">Demo Credentials:</p>
            <p>
              <span className="text-muted-foreground">Admin:</span>{" "}
              admin@taskflow.com / password123
            </p>
            <p>
              <span className="text-muted-foreground">User:</span>{" "}
              bob@taskflow.com
              {" / "}password123
            </p>
            <p>
              <span className="text-muted-foreground">User:</span>{" "}
              carol@taskflow.com / password123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
