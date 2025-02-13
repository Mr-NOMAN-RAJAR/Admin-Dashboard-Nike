"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected page.</p>
    </div>
  );
}
