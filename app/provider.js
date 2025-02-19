"use client"
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, ReactNode } from "react";



export default function EnsureUserInDB({ children }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.firstName || "Unknown",
          imageUrl: user.imageUrl,
        }),
      });
    }
  }, [isSignedIn, user]);

  return <>{children}</>;
}
