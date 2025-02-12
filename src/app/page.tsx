"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {}, []);

  return <>{children}</>;
}
