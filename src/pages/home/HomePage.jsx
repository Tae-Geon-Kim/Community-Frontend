// src/pages/home/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 나중에 복구 API를 만들면 여기에 import 하세요!
// import { restoreAccountApi } from "@/api/auth";
import "@/styles/home/Home.css";

export default function HomePage() {
  const navigate = useNavigate();
  
  // 복구 폼을 보여줄지 말지 결정하는 스위치
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoverId, setRecoverId] = useState("");
  const [recoverPassword, setRecoverPassword] = useState("");

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    if (!recoverId || !recoverPassword) {
      alert("복구할 아이디와 비밀번호를 모두 입력해주세요!");
      return;
    }

    try {
      // 🌟 나중에 백엔드 API가 완성되면 이 주석을 풀고 연결하세요!
      // await restoreAccountApi(recoverId, recoverPassword);
      
      console.log("복구 요청 데이터:", { id: recoverId, password: recoverPassword });
      alert("계정 복구가 성공적으로 완료되었습니다! 다시 로그인해주세요.");
      setShowRecovery(false); // 폼 닫기
      navigate("/login"); // 로그인 창으로 보내기
      
    } catch (error) {
      console.error("복구 실패:", error);
      alert("일치하는 탈퇴 정보가 없거나 복구에 실패했습니다.");
    }
  };

  return (
    <div className="home-container">
      {/* 1. 커뮤니티 소개 (Hero) */}
      <div className="hero-section">
        <h1 className="hero-title">자유로운 소통 공간</h1>
        <p className="hero-subtitle">
          지금 가입하고 다양한 사람들과 이야기를 나눠보세요! <br/>
          로그인 없이도 자유 게시판을 구경할 수 있습니다.
        </p>
      </div>

      {/* 2. 메인 액션 버튼들 */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          로그인
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/register")}>
          회원가입
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/board")}>
          게시판 구경하기
        </button>
      </div>

      {/* 3. 숨겨진 계정 복구 섹션 */}
      {!showRecovery ? (
        <span className="recovery-toggle-text" onClick={() => setShowRecovery(true)}>
          혹시 계정을 삭제하셨나요? (계정 복구)
        </span>
      ) : (
        <div className="recovery-wrapper">
          <h3>계정 복구</h3>
          <p style={{ fontSize: "12px", color: "#666" }}>
            탈퇴 시 사용했던 아이디와 비밀번호를 입력해주세요.
          </p>
          <form className="recovery-form" onSubmit={handleRecoverySubmit}>
            <input
              type="text"
              placeholder="아이디"
              className="recovery-input"
              value={recoverId}
              onChange={(e) => setRecoverId(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="recovery-input"
              value={recoverPassword}
              onChange={(e) => setRecoverPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }}>
              복구하기
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ marginTop: "5px" }}
              onClick={() => setShowRecovery(false)}
            >
              취소
            </button>
          </form>
        </div>
      )}
    </div>
  );
}