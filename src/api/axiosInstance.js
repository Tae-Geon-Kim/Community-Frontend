import axios from "axios";

// 공통 API 클라이언트 생성
const axiosInstance = axios.create({
  // .env 파일에 적어둔 주소를 가져옵니다.
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 5000, // 5초 이상 응답 없으면 에러 처리
});

// (선택) 나중에 로그인을 위해 토큰을 헤더에 자동 포함시키는 설정
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;