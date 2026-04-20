import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 화면 이동을 위한 훅
import { loginApi } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate(); // 페이지 이동 함수
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 표시용

  const handleLogin = async () => {
    // 1. 빈 값 체크
    if (!userId || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 2. API 호출
      const data = await loginApi(userId, password);
      
      // 3. 토큰 저장 (백엔드 TokenResponse의 access_token, refresh_token 저장)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      
      alert("로그인에 성공하였습니다.");
      
      // 4. 로그인 성공 후 게시판 목록 등 원하는 페이지로 이동
      navigate("/board"); 
      
    } catch (error) {
      // 백엔드에서 내려준 HTTPException 디테일 메시지를 화면에 표시
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("서버와 통신할 수 없습니다.");
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>커뮤니티 로그인</h2>
      
      {/* 백엔드 제약조건 안내문 */}
      <p style={{ fontSize: "12px", color: "gray" }}>
        * 아이디: 영문, 숫자 포함 5~30자<br/>
        * 비밀번호: 영문, 숫자, 특수문자 포함 8~30자
      </p>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
      </div>

      {/* 에러가 있을 때만 빨간색 글씨로 출력 */}
      {errorMessage && (
        <p style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>
          {errorMessage}
        </p>
      )}
      
      <button 
        onClick={handleLogin}
        style={{ width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        로그인
      </button>

      {/* 회원가입 페이지 이동 버튼 추가 */}
      <div style={{ marginTop: "20px" }}>
        <span style={{ fontSize: "14px", color: "gray" }}>아직 회원이 아니신가요? </span>
        <button 
          onClick={() => navigate("/register")}
          style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}