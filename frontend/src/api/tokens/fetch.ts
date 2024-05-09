import axiosInstance from "@/api/axiosInstance";
import { REFRESH_TOKEN } from "@/constants/constants";

export async function refreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  try {
    const res = await axiosInstance.post("api/token/refresh", {
      refresh: refreshToken,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Request Failed");
    }
  } catch (error) {
    throw new Error("An  error occurred");
  }
}
