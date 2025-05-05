import axios from "axios";

export const joinInDisaster = async (disasterId, userId) => {
  const body = {
    disaster_id: disasterId,
    user_id: userId,
  };
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/organizations/disasters/${disasterId}/join`, body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200 || response.data.status === "success") {
      return { status: true, message: "Successfully joined in the disaster" };
    } else {
      return { status: false, message: "Failed to join disaster" };
    }
  } catch (error) {
    console.error("Error joining disaster:", error);
    return { status: false, message: "Error joining disaster" };
  }
};

export const getCurrentDisasters = async () => {
  try {
    const resposnse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/disasters`);
    if (resposnse.status === 200 || resposnse.data.status === "success") {
      return {
        status: true,
        data: resposnse.data.data.disasters,
      };
    } 
    return {
      status: false,
      message: "Failed to fetch current disasters",
    };
  } catch (error) {
    console.error("Error fetching current disasters:", error);
    return {
      status: false,
      message:
        error.resposnse.data.message ||
        "An error occurred while fetching current disasters",
    };
  }
};
