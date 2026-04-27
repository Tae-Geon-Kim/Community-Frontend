import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/auth";
import "@/styles/user/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await loginApi(userId, password);
      
      alert("로그인에 성공하였습니다.");
      navigate("/"); 
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        const detailError = error.response.data.detail;

        if(Array.isArray(detailError)) {
          setErrorMessage(detailError[0].msg);
        }
        else {
          setErrorMessage(detailError);
        }
      }
    }
  }
  return (
    <div className="login-container">
      <h2>커뮤니티 로그인</h2>
      
      <p className="login-guide">
        * 아이디: 영문, 숫자 포함 5~30자<br/>
        * 비밀번호: 영문, 숫자, 특수문자 포함 8~30자
      </p>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="login-input"
        />
      </div>
      
      <div className="input-wrapper">
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
      </div>

      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}
      
      <button onClick={handleLogin} className="login-button">
        로그인
      </button>

      <div className="register-wrapper">
        <span className="register-text">아직 회원이 아니신가요? </span>
        <button onClick={() => navigate("/register")} className="register-button">
          회원가입
        </button>
      </div>
    </div>
  );
}