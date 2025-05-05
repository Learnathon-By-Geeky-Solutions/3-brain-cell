import axios from "axios";

export const verify = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`,
      data
    );
    if(response.status === 200 || response.data.status === "success") {
      localStorage.setItem("token", response.data.data.emailVerificationToken);
      return {
        status: true,
        data: response.data,
      }
    }
    return {
      status: false,
      message: response.data.message || "Verification failed",
    }
  } catch (error) {
    return {
      status: false,
      message: error.response ? error.response.data.message : error.message,
    };
  }
};
