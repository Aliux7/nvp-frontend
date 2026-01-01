import api from "@/lib/axios";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post("/auth/login", payload);
    console.log(data)
    return data;
  },
};