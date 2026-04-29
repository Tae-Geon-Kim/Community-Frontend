import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import HomePage from "@/pages/home/HomePage";
import Login from "@/pages/user/Login"; 
import Register from "@/pages/user/Register";
import BoardList from "@/pages/board/BoardList";
import BoardCreate from "@/pages/board/BoardCreate";
import BoardDetail from "@/pages/board/BoardDetail";
import MyPage from "@/pages/user/MyPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />   
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/mypage" element={<MyPage />} />
        
        {/* 게시판 관련 라우터 순서 조정 완료 */}
        <Route path="/board" element={<BoardList />} /> 
        <Route path="/board/create" element={<BoardCreate />} />
        <Route path="/board/:id" element={<BoardDetail />} /> 
      </Routes>
    </BrowserRouter>
  );
}