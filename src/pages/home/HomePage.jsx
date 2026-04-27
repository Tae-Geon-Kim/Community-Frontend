// src/pages/home/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { my_infoAPI } from "@/api/user"; // 🌟 로그인 상태 확인용 API 추가
// import { restoreAccountApi } from "@/api/auth";
import "@/styles/home/Home.css";

export default function HomePage() {
  const navigate = useNavigate();
  
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoverId, setRecoverId] = useState("");
  const [recoverPassword, setRecoverPassword] = useState("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 홈페이지 켜질 때 쿠키로 로그인 상태 체크
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const data = await my_infoAPI();
        setIsLoggedIn(true);
        setUserName(data.data?.id || data.id); // 로그인된 아이디 저장
      } catch (error) {
        setIsLoggedIn(false); // 쿠키가 없거나 만료되면 미로그인 상태로 둠
      }
    };
    checkLoginStatus();
  }, []);

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    if (!recoverId || !recoverPassword) {
      alert("복구할 아이디와 비밀번호를 모두 입력해주세요!");
      return;
    }

    try {
      // await restoreAccountApi(recoverId, recoverPassword);
      console.log("복구 요청 데이터:", { id: recoverId, password: recoverPassword });
      alert("계정 복구가 성공적으로 완료되었습니다! 다시 로그인해주세요.");
      setShowRecovery(false); 
      navigate("/login"); 
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

      {/* 2. 메인 액션 버튼들 (로그인 상태에 따라 다르게 보임) */}
      <div className="action-buttons">
        {isLoggedIn ? (
          <>
            <h3 style={{ width: "100%", textAlign: "center", marginBottom: "15px", color: "#333" }}>
              환영합니다, {userName}님! 👋
            </h3>
            <button className="btn btn-primary" onClick={() => navigate("/mypage")}>
              마이페이지
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/board")}>
              게시판 가기
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/register")}>
              회원가입
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/board")}>
              게시판 구경하기
            </button>
          </>
        )}
      </div>

      {/* 3. 숨겨진 계정 복구 섹션 (미로그인 상태일 때만 보임) */}
      {!isLoggedIn && (
        !showRecovery ? (
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
        )
      )}
    </div>
  );
}