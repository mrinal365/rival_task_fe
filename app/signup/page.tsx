"use client";

import React, { useEffect, useState } from "react";
import { signupService, getMeService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getToken, setToken, removeToken } from "@/utils/token";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMeService()
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          removeToken();
          setIsChecking(false);
        });
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    signupService({ name, email, password })
      .then((res) => {
        const token = res?.data?.token || res?.token;
        if (token) {
          setToken(token);
          toast.success("Signed up successfully! please login now");
        }
      })
      .catch((err) => {
        toast.error(err || "Signup failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isChecking) {
    return (
      <div className="p-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-[300px]">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="px-3 py-1 bg-black text-white rounded cursor-pointer disabled:opacity-50">
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}