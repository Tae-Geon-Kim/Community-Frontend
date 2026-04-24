// src/pages/BoardCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_board_API } from "@/api/board"; 
import "@/styles/board/BoardCreate.css";

export default function BoardCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }

    try {
      await register_board_API(title, content);
      alert("게시글이 성공적으로 등록되었습니다!");
      navigate("/board"); 
    } catch (error) {
      console.error("게시글 작성 에러:", error);
      alert("게시글 작성에 실패했습니다. (로그인이 되어있는지 확인해주세요!)");
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
          placeholder="제목을 입력하세요" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="board-input"
        />
        <textarea 
          placeholder="내용을 입력하세요" 
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