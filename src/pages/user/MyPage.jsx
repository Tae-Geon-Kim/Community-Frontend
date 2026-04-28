import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { my_infoAPI, update_idAPI, update_passwordAPI, delete_meAPI } from "@/api/user";
import { user_board_infoAPI } from "@/api/board";
import "@/styles/user/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  
  // 내 정보 & 게시글 상태
  const [userInfo, setUserInfo] = useState(null);
  const [myBoards, setMyBoards] = useState([]);
  
  // 계정 관리 탭 상태
  const [activeTab, setActiveTab] = useState(""); 
  const [password, setPassword] = useState("");
  const [newId, setNewId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // 1. 내 정보 가져오기
        const userRes = await my_infoAPI();
        const userData = userRes.data || userRes;
        setUserInfo(userData); 

        // 2. 내 아이디로 내가 쓴 글 목록 가져오기
        try {
          const boardRes = await user_board_infoAPI(userData.id);
          const boardsData = boardRes.data?.posts || boardRes.data || [];
          setMyBoards(boardsData);
        } catch (boardError) {
          console.error("게시글 불러오기 실패:", boardError);
          setMyBoards([]); // 게시글이 없거나 에러나면 빈 배열
        }

      } catch (error) {
        alert("로그인이 필요하거나 정보 조회에 실패했습니다.");
        navigate("/login");
      }
    };
    
    fetchMyData();
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

  if (!userInfo) return <div className="mypage-container">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>
      
      {/* 1. 내 정보 섹션 */}
      <div className="info-section">
        <p><strong>현재 아이디:</strong> {userInfo.id}</p>
        {userInfo.reg_date && (
          <p><strong>가입일:</strong> {new Date(userInfo.reg_date).toLocaleDateString()}</p>
        )}
      </div>

      {/* 2. 내가 쓴 글 섹션 */}
      <div className="my-boards-section">
        <h3>📝 내가 쓴 글</h3>
        {myBoards.length === 0 ? (
          <p className="no-boards">아직 작성한 글이 없습니다.</p>
        ) : (
          <ul className="my-board-list">
            {myBoards.map((board) => (
              <li key={board.index || board.board_index} className="my-board-item">
                <Link 
                  to={`/board/${board.index || board.board_index}`} 
                  state={{ fromMyPage: true }} 
                  className="board-link"
                >
                  <span className="board-title">{board.title}</span>
                  <span className="board-date">
                    {new Date(board.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="divider" />

      {/* 3. 계정 관리 섹션 */}
      <h3 className="account-manage-title">⚙️ 계정 관리</h3>
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