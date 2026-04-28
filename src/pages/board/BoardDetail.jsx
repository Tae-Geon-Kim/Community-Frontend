import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  single_board_infoAPI,
  update_board_titleAPI, 
  update_board_contentAPI, 
  delete_boardAPI 
} from "@/api/board";
import "@/styles/board/BoardDetail.css";

export default function BoardDetail() {
  const params = useParams();
  const boardIndex = params.boardIndex || params.id || params.index || Object.values(params)[0]; 
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 마이페이지에서 넘어온 '내 글'인지 확인!
  const isMyPost = location.state?.fromMyPage === true;
  
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [password, setPassword] = useState("");

  // 에러 해결을 위한 공통 에러 처리기
  const showErrorAlert = (error, defaultMsg) => {
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      // Pydantic 형식 에러 (배열 형태) -> 첫 번째 에러 메시지만
      alert(detail[0].msg);
    } else if (typeof detail === "string") {
      // 일반 HTTP 에러 (문자열 형태) -> 비밀번호 틀림 같은 에러
      alert(detail);
    } else {
      alert(defaultMsg);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!boardIndex) {
        alert("잘못된 접근입니다 (게시글 번호를 찾을 수 없습니다).");
        navigate("/board");
        return;
      }
      try {
        const res = await single_board_infoAPI(boardIndex);
        const data = res.data || res;
        
        setBoard(data);
        setNewTitle(data.title || "");
        setNewContent(data.content || "");
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
        alert("게시글을 불러올 수 없거나 삭제된 게시글입니다.");
        navigate("/board");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [boardIndex, navigate]);

  const handleUpdateTitle = async () => {
    if (!password) return alert("수정을 위해 비밀번호를 입력해주세요.");
    try {
      await update_board_titleAPI(password, newTitle, boardIndex);
      alert("제목이 수정되었습니다.");
      setIsEditTitle(false);
      setPassword("");
      window.location.reload(); 
    } catch (error) {
      showErrorAlert(error, "수정 권한이 없거나 실패했습니다.");
    }
  };

  const handleUpdateContent = async () => {
    if (!password) return alert("수정을 위해 비밀번호를 입력해주세요.");
    try {
      await update_board_contentAPI(password, newContent, boardIndex);
      alert("내용이 수정되었습니다.");
      setIsEditContent(false);
      setPassword("");
      window.location.reload();
    } catch (error) {
      showErrorAlert(error, "수정 권한이 없거나 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!password) return alert("삭제를 위해 비밀번호를 입력해주세요.");
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await delete_boardAPI(password, boardIndex);
        alert("게시글이 삭제되었습니다.");
        navigate("/board");
      } catch (error) {
        showErrorAlert(error, "삭제 권한이 없거나 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="loading">데이터 로딩 중...</div>;
  if (!board) return <div className="no-posts">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="board-detail-container">
      <div className="detail-header">
        {isEditTitle ? (
          <div className="edit-box">
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              className="edit-input-title"
            />
            <div className="edit-controls">
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="detail-password-input"
              />
              <button onClick={handleUpdateTitle} className="btn-save">확인</button>
              <button onClick={() => {setIsEditTitle(false); setPassword("");}} className="btn-cancel">취소</button>
            </div>
          </div>
        ) : (
          <h2 className="detail-title">
            {board.title}
            {/* isMyPost가 true일 때만 수정 펜 아이콘 보이기 */}
            {isMyPost && (
              <button onClick={() => setIsEditTitle(true)} className="btn-icon-edit" title="제목 수정">📝</button>
            )}
          </h2>
        )}
        
        <div className="detail-meta">
          <span><strong>작성자:</strong> {board.author || board.id}</span>
          <span><strong>작성일:</strong> {new Date(board.reg_date).toLocaleString()}</span>
        </div>
      </div>

      <hr className="detail-divider" />

      <div className="detail-body">
        {isEditContent ? (
          <div className="edit-box">
            <textarea 
              value={newContent} 
              onChange={(e) => setNewContent(e.target.value)} 
              className="edit-textarea-content"
            />
            <div className="edit-controls">
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="detail-password-input"
              />
              <button onClick={handleUpdateContent} className="btn-save">내용 저장</button>
              <button onClick={() => {setIsEditContent(false); setPassword("");}} className="btn-cancel">취소</button>
            </div>
          </div>
        ) : (
          <div className="content-view">
            <p className="content-text">{board.content}</p>
            {/* isMyPost가 true일 때만 내용 수정 버튼 보이기 */}
            {isMyPost && (
              <button onClick={() => setIsEditContent(true)} className="btn-text-edit">내용 수정하기</button>
            )}
          </div>
        )}
      </div>

      <div className="detail-footer">
        <button onClick={() => navigate("/board")} className="btn-back-list">목록으로 돌아가기</button>
        
        {/* isMyPost가 true일 때만 삭제 구역 보이기 */}
        {isMyPost && !isEditTitle && !isEditContent && (
          <div className="delete-section">
            <input 
              type="password" 
              placeholder="삭제용 비밀번호" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="detail-password-input"
            />
            <button onClick={handleDelete} className="btn-delete-post">게시글 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
}