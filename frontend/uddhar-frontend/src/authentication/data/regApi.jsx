import axios from "axios";

export const register = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/register",
      data
    );
    if(response.status === 200 || response.status === 201) {
      return {
        status: "true",
        data: response.data,
      }
    }
    else {
      return {
        status: "false",
        message: response.message.message,
      }
    }
  } catch (error) {
    console.log("logging from register", error);
    return error.response.data;
  }
};
