import axiosInstance from "./axiosInstance";

// 1. 특정 게시글에 파일 업로드 (POST/boards/{board_index})
export const upload_fileAPI = async (file, board_index) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(`/files/boards/${board_index}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    return response.data
    } catch(error) {
        console.error("파일 업로드 에러: ", error);
        throw error;
    }
};

// 2. 특정 게시글의 단일 파일 삭제 (DELETE/boards/{board_index}/{file_index})
export const delete_single_fileAPI = async (password, board_index, file_index) => {
    try {
        const response = await axiosInstance.delete(`/files/boards/${board_index}/${file_index}`, {
            data: {password: password}
        });
    return response.data
    } catch(error) {
        console.error("파일 삭제 에러: ", error);
        throw error;
    }
};

// 3. 특정 게시글에 첨부된 모든 파일 일괄 삭제 (DELETE/boards/{board_index})
export const delete_all_fileAPI = async (password, board_index) => {
    try {
        const response = await axiosInstance.delete(`/files/boards/${board_index}`, {
            data: {password: password}
        });
    return response.data
    } catch(error) {
        console.error("게시글 파일 전체 삭제 에러: ", error);
        throw error;
    }
};

// 4, 특정 게시글의 삭제 처리된 단일 파일 복구 (POST/boards/{board_index}/{file_index}/restore)
export const restore_single_fileAPI = async (password, board_index, file_index) => {
    try {
        const response = await axiosInstance.post(`/files/boards/${board_index}/${file_index}/restore`, {
            password: password
        });
    return response.data
    } catch(error) {
        console.error("단일 파일 복구 에러: ", error);
        throw error;
    }
};

// 5. 특정 게시글의 삭제 처리된 전체 파일 일괄 복구 (POST/boards/{board_index}/restore)
export const restore_all_fileAPI = async (password, board_index) => {
    try {
        const response = await axiosInstance.post(`/files/boards/${board_index}/restore`, {
            password: password
        });
    return response.data
    } catch(error) {
        console.error("파일 일괄 복구 에러: ", error);
        throw error;
    }
};