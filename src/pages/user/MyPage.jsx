import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { my_infoAPI, update_idAPI, update_passwordAPI, delete_meAPI } from "@/api/user";
import "@/styles/user/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(""); 
  const [password, setPassword] = useState("");
  const [newId, setNewId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await my_infoAPI();
        setUserInfo(data.data || data); 
      } catch (error) {
        alert("로그인이 필요하거나 정보 조회에 실패했습니다.");
        navigate("/login");
      }
    };
    fetchMyInfo();
  }, [navigate]);

  const resetForms = () => {
    setPassword("");
    setNewId("");
    setNewPassword("");
    setMessage("");
  };

  const handleTabChange = (tabName) => {
    setActiveTab(activeTab === tabName ? "" : tabName);
    resetForms();
  };

  const handleError = (error) => {
    if (error.response?.data?.detail) {
      const detailError = error.response.data.detail;
      setMessage(Array.isArray(detailError) ? detailError[0].msg : detailError);
    } else {
      setMessage("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleUpdateId = async () => {
    if (!password || !newId) return setMessage("현재 비밀번호와 새 아이디를 입력해주세요.");
    try {
      await update_idAPI(password, newId);
      alert("아이디가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      navigate("/login"); 
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !newPassword) return setMessage("현재 비밀번호와 새 비밀번호를 입력해주세요.");
    try {
      await update_passwordAPI(password, newPassword);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setActiveTab("");
      resetForms();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) return setMessage("탈퇴를 위해 현재 비밀번호를 입력해주세요.");
    
    if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
      try {
        await delete_meAPI(password);
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/"); 
      } catch (error) {
        handleError(error);
      }
    }
  };

  if (!userInfo) return <div className="mypage-container">로딩 중...</div>;

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>
      
      <div className="info-section">
        <p><strong>현재 아이디:</strong> {userInfo.id}</p>
      </div>

      <div className="button-group">
        <button onClick={() => handleTabChange("id")} className="login-button btn-tab">아이디 변경</button>
        <button onClick={() => handleTabChange("password")} className="login-button btn-tab">비밀번호 변경</button>
        <button onClick={() => handleTabChange("delete")} className="register-button btn-tab btn-delete">회원 탈퇴</button>
      </div>

      {activeTab && (
        <div className="action-section">
          <h3 className="action-title">
            {activeTab === "id" && "새 아이디로 변경"}
            {activeTab === "password" && "새 비밀번호로 변경"}
            {activeTab === "delete" && "계정 탈퇴 확인"}
          </h3>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {activeTab === "id" && (
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="새로운 아이디를 입력하세요"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="login-input"
              />
            </div>
          )}

          {activeTab === "password" && (
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="새로운 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="login-input"
              />
            </div>
          )}

          {message && <p className="error-message">{message}</p>}

          <button 
            onClick={
              activeTab === "id" ? handleUpdateId :
              activeTab === "password" ? handleUpdatePassword :
              handleDeleteAccount
            } 
            className="login-button btn-save"
          >
            {activeTab === "delete" ? "탈퇴하기" : "변경사항 저장"}
          </button>
        </div>
      )}
    </div>
  );
}