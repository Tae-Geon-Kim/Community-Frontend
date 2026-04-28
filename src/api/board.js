import axiosInstance from "./axiosInstance";

// 1. 신규 게시글 작성 (POST/)
export const register_board_API = async (title, content) => {
    try {
        const response = await axiosInstance.post("/boards", {
            title: title,
            content: content
        });
    return response.data
    } catch(error) {
        console.error("게시판 생성 API 에러: ", error);
        throw error;
    }
};

// 2. 특정 게시글 하나 조회 - 로그인 x (GET/{board_index})
export const single_board_infoAPI = async(board_index) => {
    try {
        const response = await axiosInstance.get(`/boards/${board_index}`)
        return response.data
    } catch(error) {
        console.error("특정 게시글 하나 조회 에러: ", error);
        throw error;
    }
};

// 3. 특정 유저의 게시글 조회 - 로그인 x (GET/users/{user_id})
export const user_board_infoAPI = async (user_id) => {
    try {
        const response = await axiosInstance.get(`/boards/users/${user_id}`)
        return response.data
    } catch(error) {
        console.error("유저 게시글 조회 에러: ", error);
        throw error;
    }
};

// 4. 전체 게시글 조회 - 로그인 x (GET/)
export const all_board_infoAPI = async () => {
    try {
        const response = await axiosInstance.get("/boards")
        return response.data
    } catch(error) {
        console.error("전체 게시글 조회 에러: ", error);
        throw error;
    }
};

// 5. 특정 게시글 제목 수정 (PATCH/{board_index}/title)
export const update_board_titleAPI = async (password, new_title, board_index) => {
    try {
        const response = await axiosInstance.patch(`/boards/${board_index}/title`, {
            password: password,
            new_title: new_title
        });
        return response.data
    } catch(error) {
        console.error("유저 게시글 제목 수정 에러: ", error);
        throw error;
    }
};

// 6. 특정 게시글 내용 수정 (PATCH/{board_index}/content)
export const update_board_contentAPI = async (password, new_content, board_index) => {
    try {
        const response = await axiosInstance.patch(`/boards/${board_index}/content`, {
            password: password,
            new_content: new_content
        });
        return response.data
    } catch(error) {
        console.error(" 유저 게시글 내용 수정 에러: ", error);
        throw error;
    }
};

// 7. 특정 게시글 삭제 (DELETE/{board_index})
export const delete_boardAPI = async (password, board_index) => {
    try {
        const response = await axiosInstance.delete(`/boards/${board_index}`, {
            data: {password: password}
        });
        return response.data
    } catch(error) {
        console.error("유저 게시글 삭제 에러: ", error);
        throw error;
    }
};

// 8. 특정 게시글 복구 (POST/{board_index}/restore)
export const restore_boardAPI = async (password, board_index) => {
    try {
        const response = await axiosInstance.post(`/boards/${board_index}/restore`, {
            password: password
        });
        return response.data
    } catch(error) {
        console.error("게시판 복구 에러: ", error);
        throw error;
    }
};