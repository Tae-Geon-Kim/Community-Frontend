import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_userApi } from "@/api/auth"; 
import { check_idAPI } from "@/api/user";
import "@/styles/user/Register.css"; 

export default function Register() {
  const navigate = useNavigate();
  
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  
  // 중복 확인을 위한 상태들
  const [isIdChecked, setIsIdChecked] = useState(false); 
  const [idCheckMessage, setIdCheckMessage] = useState(""); 

  // 아이디 입력창 글자가 바뀔 때마다 실행 (중복 확인 초기화)
  const handleIdChange = (e) => {
    setId(e.target.value);
    setIsIdChecked(false); // 글자가 바뀌면 다시 확인받도록 false로 초기화
    setIdCheckMessage(""); // 메시지도 초기화
  };

  // 중복 확인 버튼 눌렀을 때 실행되는 함수
  const handleIdCheck = async () => {
    if (!id.trim()) {
      setIdCheckMessage("아이디를 입력해주세요.");
      return;
    }

    try {
      await check_idAPI(id);
      // 에러 안 나고 통과하면 성공!
      setIsIdChecked(true);
      setIdCheckMessage("사용 가능한 아이디입니다.");
    } catch (error) {
      setIsIdChecked(false);
      if (error.response?.data?.detail) {
        const detailError = error.response.data.detail;
        setIdCheckMessage(`${Array.isArray(detailError) ? detailError[0].msg : detailError}`);
      } else {
        setIdCheckMessage("이미 사용 중이거나 사용할 수 없는 아이디입니다.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. 빈칸 검사
    if (!id || !password || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    //  2. 아이디 중복 확인했는지 검사
    if (!isIdChecked) {
      setErrorMessage("아이디 중복 확인을 완료해주세요.");
      return;
    }

    // 3. 비밀번호 일치 검사
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 4. 백엔드로 데이터 전송
    try {
      await register_userApi(id, password);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); 
    } catch (error) {
      console.error("회원가입 에러:", error);
      if (error.response?.data?.detail) {
        const detailError = error.response.data.detail;
        setErrorMessage(Array.isArray(detailError) ? detailError[0].msg : detailError);
      } else {
        setErrorMessage("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">커뮤니티 회원가입</h2>
        
        <form onSubmit={handleRegister} className="register-form">
          
          {/* 아이디 입력창과 중복확인 버튼을 한 줄에 배치 */}
          <div className="id-input-group">
            <input
              type="text"
              placeholder="아이디 (영문, 숫자 포함 5~30자)"
              value={id}
              onChange={handleIdChange}
              className="register-input id-input"
            />
            <button 
              type="button" 
              onClick={handleIdCheck} 
              className={`check-button ${isIdChecked ? 'checked' : ''}`}
            >
              중복 확인
            </button>
          </div>
          {/* 중복 확인 결과 메시지 */}
          {idCheckMessage && (
            <div className={`id-check-message ${isIdChecked ? 'success' : 'error'}`}>
              {idCheckMessage}
            </div>
          )}

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