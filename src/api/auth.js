import axiosInstance from "./axiosInstance";

// 1. 로그인 요청 (POST /users/login)
export const loginApi = async (id, password) => {
  try {
    const response = await axiosInstance.post("users/login", {
      id: id,
      password: password
    }); // 프론트엔드가 백엔드로 보내는 입력 데이터
    
    return response.data.data; // 백엔드가 처리를 마치고 돌려준 결과물
  } catch (error) {
    console.error("로그인 API 에러:", error);
    throw error;
  }
};

// 2. 토큰 재발급 (POST/users/refresh)
export const refreshAPI = async (refresh_token) => {
  try {
    const response = await axiosInstance.post("users/refresh",{
      refresh_token: refresh_token
    }); // 프론트엔드가 백엔드로 보내는 입력 데이터

    return response.data // 백엔드가 처리를 마치고 돌려준 결과물
  } catch(error) {
    console.error("토큰 재발급 API 에러", error);
    throw error;
  }
};

// 3. 회원가입 요청 (POST /users)
export const register_userApi = async (id, password) => {
  try {
    const response = await axiosInstance.post("users", {
      id: id,
      password: password
    }); // 프론트엔드가 백엔드로 보내는 입력 데이터
    return response.data; // 백엔드가 처리를 마치고 돌려준 결과물
  } catch (error) {
    console.error("회원가입 API 에러:", error);
    throw error;
  }
};