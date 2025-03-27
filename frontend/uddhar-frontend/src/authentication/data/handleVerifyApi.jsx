import axios from "axios";

export const verify = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/verify-email",
      data
    );
    // console.log(data);
    // console.log("logging from handleverifyapi : ",response);
    if(response.status === 200 || response.status === 201) {
      localStorage.setItem("token", response.data.emailVerificationToken);
      return {
        status: "true",
        data: response.data,
      }
    }
    else {
      return {
        status: "false",
        message: response.message,
      }
    }
  } catch (error) {
    return error.response.data;
  }
};
