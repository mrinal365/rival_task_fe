"use client";

import React, { useEffect, useState } from "react";
import { getMeService } from "@/services/auth.service";
import { getToken, removeToken } from "@/utils/token";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth.slice";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(true);

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getMeService()
      .then((user) => {
        dispatch(setUser(user));
        setIsChecking(false);
      })
      .catch(() => {
        removeToken();
        router.push("/login");
      });
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex space-x-3 justify-center items-center bg-white min-h-screen">
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-up"></div>
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-down"></div>
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-up"></div>
      </div>
    );
  }

  return <>{children}</>;
}
