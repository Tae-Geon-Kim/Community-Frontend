import axios from "axios";

// 공통 API 클라이언트 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 5000, // 5초 이상 응답 없으면 에러 처리
});

export default axiosInstance;