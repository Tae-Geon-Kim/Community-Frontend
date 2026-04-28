import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { all_board_infoAPI, user_board_infoAPI } from "@/api/board";
import "@/styles/board/BoardList.css";

export default function BoardList() {
  const navigate = useNavigate(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchId, setSearchId] = useState(""); 
  const [isFiltered, setIsFiltered] = useState(false); 

  // 로컬 스토리지 토큰 유무로 로그인 상태 확인
  const isLogin = !!(localStorage.getItem("token") || localStorage.getItem("access_token"));

  const fetchPosts = async (userId = "") => {
    setLoading(true);
    try {
      if (userId) {
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
        const response = await all_board_infoAPI();
        const allData = response.data || [];
        
        const flatPosts = allData.flatMap(userGroup => {
          const groupPosts = userGroup.posts || [];
          const authorId = userGroup.author || "알 수 없음";

          return groupPosts.map(post => ({
            ...post,
            user_id: authorId
          }));
        });
        
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
      {/* 타이틀과 글쓰기 버튼 영역 */}
      <div className="board-title-header">
        <h2>자유 게시판</h2>
        {isLogin && (
          <button onClick={() => navigate("/board/create")} className="btn-write-post">
            📝 새 글 쓰기
          </button>
        )}
      </div>

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
                <td>{post.user_id}</td> 
                <td>{new Date(post.reg_date || Date.now()).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}