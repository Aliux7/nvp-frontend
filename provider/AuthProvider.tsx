"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });
        setAuth(data.accessToken, data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  
  }

  return <>{children}</>;
}
