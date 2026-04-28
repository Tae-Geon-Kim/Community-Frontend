import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutAPI } from "@/api/auth";
import { my_infoAPI } from "@/api/user";
import "@/styles/components/Header.css"; 

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await my_infoAPI();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await logoutAPI(); 
        
        alert("로그아웃 되었습니다.");
        window.location.href = "/"; 
        
      } catch (error) {
        console.error("로그아웃 에러:", error);
        alert("로그아웃 처리 중 에러가 발생했습니다.");
      }
    }
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to="/">Community</Link>
      </div>
      <nav className="header-nav">
        <Link to="/board" className="header-link">게시판</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className="header-link">마이페이지</Link>
            <button onClick={handleLogout} className="header-logout-btn">
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="header-link">로그인</Link>
        )}
      </nav>
    </header>
  );
}
