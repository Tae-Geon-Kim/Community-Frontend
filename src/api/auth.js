import axiosInstance from "./axiosInstance";

// 1. 로그인 요청 (백엔드: @router.post("/login"))
export const loginApi = async (id, password) => {
  try {
    // 백엔드의 UserLogin Pydantic 모델(id, password) 형식에 맞춰 JSON으로 전송
    const response = await axiosInstance.post("/login", {
      id: id,
      password: password
    });
    
    // 백엔드의 CommonResponse 구조에 맞춰 실제 데이터(TokenResponse)만 반환
    return response.data.data; 
  } catch (error) {
    console.error("로그인 API 에러:", error);
    throw error;
  }
};

// 2. 회원가입 요청 (백엔드: @router.post("/uRegister"))
export const registerApi = async (id, password) => {
  try {
    const response = await axiosInstance.post("/uRegister", {
      id: id,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 API 에러:", error);
    throw error;
  }
};