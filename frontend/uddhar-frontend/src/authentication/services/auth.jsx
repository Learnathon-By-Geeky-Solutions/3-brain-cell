import axios from "axios";

export const handleLogin = async (email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const isSuccess =
      [200].includes(response.status) || response.data.status === "success";
    if (isSuccess) {
      const data = response.data;
      const token = data.data.loginToken;
      storeToken(token);
      return data;
    }
    return {
      status: false,
      message: response.data.message || "Login failed",
    };
  } catch (error) {
    return {
      status: false,
      message:
        error?.response?.data?.message || "An error occurred while logging in.",
    };
  }
};

export const setHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const storeToken = (token) => {
  localStorage.setItem("token", token);
  setHeader(token);
};

export const handleSendCode = async (email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred while sending reset code:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while sending reset code.",
    };
  }
};

export const handleResetPassword = async (
  email,
  resetCode,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
      { email, resetCode, newPassword, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const isSuccess =
      [200, 201].includes(response.status) ||
      response.data.status === "success";
    if (isSuccess) {
      return {
        status: true,
        message: "Password reset successfully",
      };
    }
    return {
      status: false,
      message: response.data?.message || "Password reset failed",
    };
  } catch (error) {
    console.error("Error occurred while resetting password:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while resetting password.",
    };
  }
};

export const signOut = () => {
  localStorage.removeItem("token");
  setHeader(null);
};

export const isLogged = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      status: true,
      token: token,
    };
  } else {
    return {
      status: false,
      token: null,
    };
  }
};
