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
        
        <Route path="/board" element={<BoardList />} /> 
        <Route path="/board/write" element={<BoardCreate />} /> 
        <Route path="/board/:id" element={<BoardDetail />} /> 
      </Routes>
    </BrowserRouter>
  );
}