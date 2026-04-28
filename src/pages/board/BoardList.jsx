import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_board_infoAPI, user_board_infoAPI } from "@/api/board";
import "@/styles/board/BoardList.css";

export default function BoardList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchId, setSearchId] = useState(""); 
  const [isFiltered, setIsFiltered] = useState(false); 

  const fetchPosts = async (userId = "") => {
    setLoading(true);
    try {
      if (userId) {
        // 1. 특정 유저 검색 시 데이터 처리
        const response = await user_board_infoAPI(userId);
        const data = response.data || {};
        
        let userPosts = Array.isArray(data) ? data : (data.posts || []);
        
        userPosts = userPosts.map(post => ({
          ...post,
          user_id: userId
        }));

        setPosts(userPosts);
        setIsFiltered(true);
      } else {
        // 🌟 2. 전체 목록 조회 시 데이터 평탄화 (작성자 이름 버그 완벽 해결!)
        const response = await all_board_infoAPI();
        const allData = response.data || [];
        
        const flatPosts = allData.flatMap(userGroup => {
          const groupPosts = userGroup.posts || [];
          // 💡 백엔드 스키마에 정의된 정확한 이름인 'author'를 사용합니다!
          const authorId = userGroup.author || "알 수 없음";

          return groupPosts.map(post => ({
            ...post,
            // 프론트엔드 테이블에서 user_id로 렌더링하도록 통일
            user_id: authorId
          }));
        });
        
        // 최신 글이 맨 위로 오게 정렬
        flatPosts.sort((a, b) => {
          const indexA = a.index || a.board_index || 0;
          const indexB = b.index || b.board_index || 0;
          return indexB - indexA; 
        });

        setPosts(flatPosts);
        setIsFiltered(false);
      }
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  const handleSearch = () => {
    if (!searchId.trim()) {
      alert("검색할 아이디를 입력해주세요!");
      return;
    }
    fetchPosts(searchId.trim());
  };

  const handleReset = () => {
    setSearchId("");
    fetchPosts();
  };

  return (
    <div className="board-list-container">
      <h2>자유 게시판</h2>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="유저 아이디로 검색..." 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">검색</button>
        {isFiltered && (
          <button onClick={handleReset} className="reset-button">전체 보기</button>
        )}
      </div>

      {loading ? (
        <div className="loading">데이터를 불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">
          {isFiltered ? "해당 유저가 작성한 게시글이 없습니다." : "작성된 게시글이 없습니다."}
        </div>
      ) : (
        <table className="board-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.index || post.board_index}>
                <td>{post.index || post.board_index}</td>
                <td className="post-title">
                  <Link to={`/board/${post.index || post.board_index}`}>{post.title}</Link>
                </td>
                {/* 작성자 정상 출력 */}
                <td>{post.user_id}</td> 
                {/* 💡 날짜 버그 수정: 백엔드 스키마에 맞춰 reg_date 로 변경! */}
                <td>{new Date(post.reg_date || Date.now()).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}