import axios from "axios";

export const registerCompletion = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post( 
      `http://localhost:3000/profile/complete`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      return {
        status: "true",
        data: response.data,
      };
    } else {
      return {
        status: "false",
        message: response.message,
      };
    }
  } catch (error) {
    return {
      message: "An error occured when completing registration",
    }
  }
};
