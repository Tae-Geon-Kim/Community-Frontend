import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { single_board_infoAPI, update_board_titleAPI, update_board_contentAPI, delete_boardAPI } from "@/api/board";
import "@/styles/board/BoardDetail.css";

export default function BoardDetail() {
  const { id } = useParams(); // Router에서 :id로 설정했으므로 id 사용
  const navigate = useNavigate();
  const location = useLocation();
  const isMyPost = location.state?.fromMyPage === true;
  
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await single_board_infoAPI(id);
        setBoard(res.data);
        setNewTitle(res.data.title);
        setNewContent(res.data.content);
      } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
        navigate("/board");
      } finally { setLoading(false); }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!board) return null;

  return (
    <div className="board-detail-container">
      <div className="detail-header">
        {isEditTitle ? (
          <div className="edit-box">
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="edit-input-title" />
            <div className="edit-controls">
              <input type="password" placeholder="비번" value={password} onChange={(e) => setPassword(e.target.value)} className="detail-password-input" />
              <button onClick={() => {/*수정로직*/}} className="btn-save">확인</button>
              <button onClick={() => setIsEditTitle(false)} className="btn-cancel">취소</button>
            </div>
          </div>
        ) : (
          <h2 className="detail-title">{board.title} {isMyPost && <button onClick={() => setIsEditTitle(true)}>📝</button>}</h2>
        )}
        <div className="detail-meta">
          <span>작성자: {board.author || board.id}</span>
          <span>작성일: {new Date(board.reg_date).toLocaleString()}</span>
        </div>
      </div>

      <hr className="detail-divider" />

      {/* 📎 파일 표시 영역 추가 */}
      <div className="detail-files">
        <h4>📎 첨부 파일 ({board.files?.length || 0})</h4>
        {board.files && board.files.length > 0 ? (
          <ul className="file-list">
            {board.files.map((file, idx) => (
              <li key={idx} className="file-item">
                <span className="file-icon">💾</span>
                <span className="file-name">{file.original_name}</span>
                <span className="file-size">({file.file_size})</span>
              </li>
            ))}
          </ul>
        ) : <p className="no-files">첨부 파일 없음</p>}
      </div>

      <div className="detail-body">
        {isEditContent ? <textarea value={newContent} onChange={(e)=>setNewContent(e.target.value)} className="edit-textarea-content" /> 
        : <p className="content-text">{board.content}</p>}
      </div>

      <div className="detail-footer">
        <button onClick={() => navigate("/board")} className="btn-back-list">목록으로</button>
      </div>
    </div>
  );
}