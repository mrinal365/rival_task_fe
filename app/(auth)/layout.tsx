"use client";

import React, { useEffect, useState } from "react";
import { getMeService } from "@/services/auth.service";
import { getToken, removeToken } from "@/utils/token";
import { useRouter, usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(true);

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getMeService()
      .then(() => {
        setIsChecking(false);
      })
      .catch(() => {
        removeToken();
        router.push("/login");
      });
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="p-5">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
