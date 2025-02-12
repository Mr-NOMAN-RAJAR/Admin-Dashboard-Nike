"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Protectroute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");
    }
  }, [router]);

  return <div>{children}</div>;
}
