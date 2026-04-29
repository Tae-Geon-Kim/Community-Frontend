import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  single_board_infoAPI, 
  update_board_titleAPI, 
  update_board_contentAPI, 
  delete_boardAPI 
} from "@/api/board";
import { 
  upload_fileAPI, 
  delete_single_fileAPI,
  restore_single_fileAPI
} from "@/api/file";
import "@/styles/board/BoardDetail.css";

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isMyPost = location.state?.fromMyPage === true; 
  
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [password, setPassword] = useState("");
  
  const [newFiles, setNewFiles] = useState([]); 
  const [filesToDelete, setFilesToDelete] = useState([]); 

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const fetchDetail = async () => {
    try {
      const res = await single_board_infoAPI(id);
      const data = res.data || res;
      setBoard(data);
      setEditTitle(data.title);
      setEditContent(data.content);
    } catch (error) {
      alert("게시글을 불러올 수 없습니다.");
      navigate("/board");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // ---------------- 저장 로직 ----------------
  const handleSaveEdit = async () => {
    if (!password) {
      alert("수정을 위해 비밀번호를 입력해주세요.");
      return;
    }
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      if (editTitle !== board.title) {
        await update_board_titleAPI(password, editTitle, id);
      }
      
      if (editContent !== board.content) {
        await update_board_contentAPI(password, editContent, id);
      }

      if (filesToDelete.length > 0) {
        for (const fileIndex of filesToDelete) {
          await delete_single_fileAPI(password, id, fileIndex);
        }
      }

      if (newFiles.length > 0) {
        for (const file of newFiles) {
          await upload_fileAPI(file, id);
        }
      }

      alert("게시글이 성공적으로 수정되었습니다!");
      
      setIsEditing(false);
      setPassword("");
      setNewFiles([]);
      setFilesToDelete([]);
      fetchDetail(); 

    } catch (error) {
      console.error("수정 에러:", error);
      const errMsg = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || "수정에 실패했습니다. 비밀번호를 확인해주세요.";
      alert(errMsg);
    }
  };

  // ---------------- 파일 삭제 대기 ----------------
  const handleMarkFileForDelete = (fileIndex) => {
    if(window.confirm("이 파일을 삭제하시겠습니까? (저장 버튼을 눌러야 완전히 삭제됩니다)")) {
      setFilesToDelete(prev => [...prev, fileIndex]);
    }
  };

  // ---------------- 파일 복구 로직 ----------------
  const handleRestoreFile = async (fileIndex) => {
    if (!password) {
      alert("복구 권한 확인을 위해 상단에 비밀번호를 먼저 입력해주세요!");
      return;
    }
    if(window.confirm("이 파일을 다시 복구하시겠습니까?")) {
      try {
        await restore_single_fileAPI(password, id, fileIndex);
        alert("파일이 성공적으로 복구되었습니다!");
        fetchDetail(); // 복구 완료 후 화면 최신화
      } catch (error) {
        console.error("복구 에러:", error);
        const errMsg = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || "복구에 실패했습니다. 용량 초과 또는 비밀번호를 확인해주세요.";
        alert(errMsg);
      }
    }
  };

  const handleNewFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  // ---------------- 게시글 삭제 ----------------
  const onClickDeleteButton = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBoard = async () => {
    if (!deletePassword) return alert("비밀번호를 입력해주세요.");

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까? (첨부된 파일도 모두 삭제됩니다)")) {
      try {
        await delete_boardAPI(deletePassword, id);
        alert("게시글이 삭제되었습니다.");
        navigate("/board");
      } catch (error) {
        alert("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
      } finally {
        setIsDeleteModalOpen(false);
        setDeletePassword("");
      }
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!board) return null;

  // 렌더링 전 파일을 두 그룹(정상/삭제됨)으로 나눕니다
  const activeFiles = board.files?.filter(f => !f.deleted_at) || [];
  const deletedFiles = board.files?.filter(f => f.deleted_at) || [];

  return (
    <div className="board-detail-container">
      {isEditing ? (
        <div className="edit-mode-container">
          <div className="edit-header">
            <h3>📝 게시글 수정</h3>
            <div className="edit-actions">
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="edit-password-input" 
              />
              <button onClick={handleSaveEdit} className="btn-save">저장</button>
              <button onClick={() => {
                setIsEditing(false);
                setFilesToDelete([]);
                setNewFiles([]);
                setPassword("");
              }} className="btn-cancel">취소</button>
            </div>
          </div>

          <input 
            type="text" 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            className="edit-input-title" 
          />

          <div className="edit-files-section">
            {/* 1. 현재 정상적인 파일 목록 */}
            <h4>📎 기존 첨부 파일 (삭제: ❌ 클릭)</h4>
            {activeFiles.length > 0 ? (
              <ul className="file-list">
                {activeFiles.map((file) => {
                  if (filesToDelete.includes(file.index || file.file_index)) return null;
                  return (
                    <li key={file.index || file.file_index} className="file-item">
                      <span>💾 {file.original_name}</span>
                      <button 
                        onClick={() => handleMarkFileForDelete(file.index || file.file_index)}
                        className="btn-file-delete"
                      >
                        ❌
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="no-files">정상 파일이 없습니다.</p>}

            {/* 2. 휴지통 (삭제된 파일 목록) */}
            {deletedFiles.length > 0 && (
              <div className="deleted-files-wrapper" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fdf0f0', borderRadius: '8px' }}>
                <h4 style={{ color: '#d9534f', margin: '0 0 10px 0' }}>휴지통 (복구 가능 파일)</h4>
                <ul className="file-list">
                  {deletedFiles.map((file) => (
                    <li key={file.index || file.file_index} className="file-item">
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>💾 {file.original_name}</span>
                      <button 
                        onClick={() => handleRestoreFile(file.index || file.file_index)}
                        className="btn-save"
                        style={{ padding: '4px 8px', fontSize: '12px', marginLeft: '10px' }}
                      >
                        복구
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. 새 파일 업로드 */}
            <div className="new-file-upload" style={{ marginTop: '20px' }}>
              <label htmlFor="edit-file-input" className="file-label">➕ 새 파일 추가하기</label>
              <input 
                id="edit-file-input"
                type="file" 
                multiple 
                onChange={handleNewFileChange}
                className="file-hidden-input"
              />
              <div className="file-list-preview">
                {newFiles.map((f, idx) => (
                  <div key={idx} className="file-name-tag">{f.name}</div>
                ))}
              </div>
            </div>
          </div>

          <textarea 
            value={editContent} 
            onChange={(e) => setEditContent(e.target.value)} 
            className="edit-textarea-content" 
          />
        </div>
      ) : (
        /* 일반 조회 모드 (activeFiles만 보여줌) */
        <>
          <div className="detail-header">
            <div className="title-row">
              <h2 className="detail-title">{board.title}</h2>
              {isMyPost && (
                <div className="post-actions">
                  <button onClick={() => setIsEditing(true)} className="btn-edit">수정</button>
                  <button onClick={onClickDeleteButton} className="btn-delete">삭제</button>
                </div>
              )}
            </div>
            <div className="detail-meta">
              <span>작성자: {board.author || board.id}</span>
              <span>작성일: {new Date(board.reg_date || Date.now()).toLocaleString()}</span>
            </div>
          </div>

          <hr className="detail-divider" />

          <div className="detail-files">
            <h4>📎 첨부 파일 ({activeFiles.length})</h4>
            {activeFiles.length > 0 ? (
              <ul className="file-list">
                {activeFiles.map((file, idx) => (
                  <li key={idx} className="file-item">
                    <span className="file-icon">💾</span>
                    <span className="file-name">{file.original_name}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="no-files">첨부 파일 없음</p>}
          </div>

          <div className="detail-body">
            <p className="content-text">{board.content}</p>
          </div>

          <div className="detail-footer">
            <button onClick={() => navigate("/board")} className="btn-back-list">목록으로</button>
          </div>
        </>
      )}

      {/* 모달 UI */}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>게시글 삭제</h3>
            <p>삭제를 완료하려면 비밀번호를 입력해주세요.</p>
            <input
              type="password"
              placeholder="비밀번호"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="edit-password-input"
              autoFocus
            />
            <div className="delete-modal-actions">
              <button onClick={confirmDeleteBoard} className="btn-delete">삭제 확인</button>
              <button onClick={() => { setIsDeleteModalOpen(false); setDeletePassword(""); }} className="btn-cancel">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}