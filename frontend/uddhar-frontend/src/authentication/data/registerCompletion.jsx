import axios from "axios";

export const registerCompletion = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/profile/complete`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const isSuccess =
      [200, 201].includes(response.status) ||
      response.data.status === "success";

    if (isSuccess) {
      return {
        status: true,
        data: response.data,
      };
    }
    return {
      status: false,
      message: response.message,
    };
  } catch (error) {
    return {
      message: "An error occured when completing registration",
      error: error,
      status: false,
    };
  }
};

export const volunteerRegistration = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/profile/complete`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const isSuccess =
      [200, 201].includes(response.status) ||
      response.data.status === "success";
      
    if (isSuccess) {
      return {
        status: true,
        message: "Registration completed successfully",
        data: response.data,
      };
    }
    return {
      status: false,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error during volunteer registration:", error);
    return {
      status: false,
      message: "An error occurred during registration",
    };
  }
};
