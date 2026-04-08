"use client";

import LoginCard from "@/components/auth/LoginCard";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <LoginCard />
      </div>
    </div>
  );
}
