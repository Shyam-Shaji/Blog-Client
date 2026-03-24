import axiosInstance from "@/api/axios";
import type { LoginPayload, RegisterPayload } from "./authTypes";

export const loginUser = async (data: LoginPayload) => {
  const res = await axiosInstance.post("/auth/login", data);

  return {
    user: res.data.user,
    token: res.data.accessToken,
  };
};

export const registerUser = async (data: RegisterPayload) => {
  const res = await axiosInstance.post("/auth/register", data);
  console.log(res);
  return {
    user: res.data.user,
    token: res.data.accessToken,
  };
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/users/current");
  return res.data;
};
