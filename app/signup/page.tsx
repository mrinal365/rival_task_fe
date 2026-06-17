"use client";

import React, { useEffect, useState } from "react";
import { signupService, getMeService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getToken, setToken, removeToken } from "@/utils/token";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({})
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate password length
    if (formData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long" });
      return;
    }
    if (!formData.name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (formData.name.length < 3) {
      setErrors({ name: "Name must be at least 3 characters long" });
      return;
    }
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setIsSubmitting(true);

    signupService(formData)
      .then((res) => {
        const token = res?.data?.token || res?.token;
        if (token) {
          setToken(token);
          toast.success("Signed up successfully!");
          router.push('/dashboard');
        } else {
          toast.warning("Something went wrong, please try again!");
        }
      })
      .catch((err) => {
        const errMessage = typeof err === "string" ? err : "Signup failed";
        toast.error(errMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isChecking) {
    return (
      <div className="flex space-x-3 justify-center items-center bg-white min-h-screen">
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-up"></div>
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-down"></div>
        <div className="h-3.5 w-3.5 bg-[#2957ff] rounded-full animate-slow-up"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffffff] text-[#0f172a] px-4">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tighter text-[#0f172a]">Rival.io</h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#6b7890] mt-1">Task Dashboard</p>
      </div>

      <div className="w-full max-w-md bg-white border border-[#e5e8ef] p-8 rounded-2xl shadow-[0_1px_2px_rgba(10,21,48,0.04),0_12px_32px_-16px_rgba(10,21,48,0.12)]">
        <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">Create an account</h2>
        <p className="text-sm text-[#6b7890] mb-6">Sign up to start creating tasks</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="John Doe"
            error={errors.name}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="name@example.com"
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="••••••••"
            error={errors.password}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Continue
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#6b7890]">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#2957ff] font-semibold hover:underline cursor-pointer ml-1"
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}