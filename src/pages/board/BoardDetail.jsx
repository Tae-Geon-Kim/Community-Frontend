// src/pages/BoardDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { all_board_infoAPI } from "@/api/board"; 
import "@/styles/board/BoardDetail.css";

export default function BoardDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const responseData = await all_board_infoAPI();
        const rawData = responseData.data || [];
        
        const flatPosts = rawData.flatMap((userGroup) => {
          const userPosts = userGroup.posts || [];
          return userPosts.map((p) => ({
            ...p,
            author: userGroup.author
          }));
        });

        const foundPost = flatPosts.find((p) => String(p.index) === id);
        setPost(foundPost);

      } catch (error) {
        console.error("게시글 상세 조회 에러:", error);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (!post) {
    return <div className="loading-container">게시글을 불러오는 중입니다...</div>;
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>{post.title}</h2>
        <button onClick={() => navigate("/board")} className="write-button btn-primary">
          목록
        </button>
      </div>
      
      <div className="post-info">
        <span><strong>작성자:</strong> {post.author}</span>
        <span><strong>작성일:</strong> {post.reg_date ? post.reg_date.substring(0, 16).replace("T", " ") : ""}</span>
      </div>

      <div className="post-content">
        {post.content}
      </div>
    </div>
  );
}