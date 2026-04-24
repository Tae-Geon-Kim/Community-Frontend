// src/pages/BoardListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { all_board_infoAPI } from "@/api/board";
import "@/styles/board/BoardList.css";

export default function BoardList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const responseData = await all_board_infoAPI();
        console.log("원본 백엔드 데이터:", responseData); 
        
        const rawData = responseData.data || [];
        
        // 사용자별로 묶인 데이터를 다 풀어서 하나의 리스트로
        const flatPosts = rawData.flatMap((userGroup) => {
          const userPosts = userGroup.posts || []; // 안쪽의 게시글 배열을 꺼냅니다.
          return userPosts.map((post) => ({
            ...post, // 기존 게시글 정보(번호, 제목 등)는 그대로 유지
            author: userGroup.author // 겉 폴더에 있던 작성자 이름표를 게시글 안쪽에 붙인다
          }));
        });

        // 글 번호(index)를 기준으로 내림차순 정렬 -> 최신 글이 항상 위로
        flatPosts.sort((a, b) => b.index - a.index);

        console.log(" 화면용으로 변환된 데이터:", flatPosts); 
        setPosts(flatPosts); // 합쳐진 데이터를 리액트

      } catch (error) {
        console.error("게시글 목록을 불러오는 중 에러 발생:", error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>자유 게시판</h2>
        <button onClick={() => navigate("/board/write")} className="write-button">
          글쓰기
        </button>
      </div>
      
      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "50%" }}>제목</th>
            <th style={{ width: "20%" }}>작성자</th>
            <th style={{ width: "20%" }}>작성일</th>
          </tr>
        </thead>
        <tbody>

          {Array.isArray(posts) && posts.map((post) => (
            <tr key={post.index}>
              <td>{post.index}</td>
              <td style={{ textAlign: "left" }}>
                <span 
                  className="post-title"
                  onClick={() => navigate(`/board/${post.index}`)}
                >
                  {post.title}
                </span>
              </td>
              <td>{post.author}</td>
              <td>
                {post.reg_date ? post.reg_date.substring(0, 10) : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}