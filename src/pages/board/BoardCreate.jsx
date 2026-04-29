import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_board_API } from "@/api/board"; 
import { upload_fileAPI } from "@/api/file";
import "@/styles/board/BoardCreate.css";

export default function BoardCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  // 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    // 선택된 여러 개의 파일을 배열로 변환해서 상태에 저장
    setFiles(Array.from(e.target.files));
  };

const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }

    try {
      // 게시글 생성
      const res = await register_board_API(title, content);
      
      console.log("백엔드 응답 데이터:", res); 

      const newBoardIndex = 
        res?.data?.board_index || 
        res?.board_index || 
        res?.data?.data?.board_index || 
        res?.detail?.board_index; 

      if (!newBoardIndex) {
        throw new Error(`게시글은 생성되었으나 번호를 받아오지 못했습니다. (응답값: ${JSON.stringify(res)})`);
      }

      // 첨부할 파일 전송
      if (files.length > 0) {
        await Promise.all(
          files.map(file => upload_fileAPI(file, newBoardIndex))
        );
      }

      alert("게시글이 성공적으로 등록되었습니다!");
      navigate("/board"); 
    } catch (error) {
      console.error("작성 에러:", error);
      const errMsg = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || error.message || "글 작성 또는 파일 업로드에 실패했습니다.";
      alert(errMsg);
    }
  };


  return (
    <div className="board-container">
      <div className="board-header">
        <h2>새 게시글 작성</h2>
        <button onClick={() => navigate("/board")} className="write-button btn-secondary">
          목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} className="board-form">
        <input 
          type="text" 
          placeholder="제목을 입력하세요 (2~50자)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="board-input"
        />

        {/* 파일 첨부 UI 섹션 */}
        <div className="file-upload-section">
          <label htmlFor="file-input" className="file-label">📎 파일 첨부하기</label>
          <input 
            id="file-input"
            type="file" 
            multiple 
            onChange={handleFileChange}
            className="file-hidden-input"
          />
          {/* 선택한 파일 이름들을 보여주는 미리보기 영역 */}
          <div className="file-list-preview">
            {files.length > 0 && files.map((f, idx) => (
              <div key={idx} className="file-name-tag">{f.name}</div>
            ))}
          </div>
        </div>

        <textarea 
          placeholder="내용을 입력하세요 (30~2000자)" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="board-textarea"
        />
        
        <button type="submit" className="write-button submit-button">
          등록하기
        </button>
      </form>
    </div>
  );
}