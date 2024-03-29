import axios from "axios";
import { BASE_URL } from "common";
const instance = axios.create({
  baseURL: BASE_URL,
});

const login = async (loginRequestModel) => {
  try {
    const response = await instance.post("/login", loginRequestModel);
    return { token: response.data.token };
  } catch (error) {
    return { error: error.message };
  }
};

const signup = async (signupRequestModel) => {
  try {
    const response = await instance.post("/register", signupRequestModel);
    return { message: response.data.message };
  } catch (error) {
    return { error: error.message };
  }
};

const createMeeting = async (createMeetingRequestModel) => {
  try {
    const response = await instance.post(
      "/createMeeting",
      createMeetingRequestModel
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.message };
  }
};

export { login, signup, createMeeting };
