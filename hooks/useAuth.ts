"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    setAuth(res.accessToken, res.user);
    router.push("/");
  };

  const logout = async () => {
    // await authService.logout();
    clearAuth();
    router.push("/login");
  };

  return { login, logout };
};
