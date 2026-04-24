// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_userApi } from "@/api/auth"; 
import "@/styles/user/Register.css"; 

export default function Register() {
  const navigate = useNavigate();
  
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. 빈칸 검사
    if (!id || !password || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    // 2. 비밀번호 일치 검사
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 3. 백엔드로 데이터 전송
    try {
      await register_userApi(id, password);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); 
    } catch (error) {
      console.error("회원가입 에러:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        const detailError = error.response.data.detail;
        if (Array.isArray(detailError)) {
          setErrorMessage(detailError[0].msg);
        } else {
          setErrorMessage(detailError);
        }
      } else {
        setErrorMessage("회원가입에 실패했습니다. 아이디 중복 및 형식을 확인해주세요.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">커뮤니티 회원가입</h2>
        
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="아이디 (영문, 숫자 포함 5~30자)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="비밀번호 (영문, 숫자, 특수문자 포함 8~30자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="register-input"
          />
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <button type="submit" className="register-button">
            가입하기
          </button>
        </form>

        <div className="go-login-link">
          이미 회원이신가요? 
          <span onClick={() => navigate("/login")}>로그인하러 가기</span>
        </div>
      </div>
    </div>
  );
}