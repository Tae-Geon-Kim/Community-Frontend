import axiosInstance from "./axiosInstance";

// 1. 아이디 중복 검사 (GET/users/check-id/{user_id})
export const check_idAPI = async (user_id) => {
    try {
        const response = await axiosInstance.get(`/users/check-id/${user_id}`)
        return response.data
    } catch(error) {
        console.error("아이디 검사 API 에러: ", error);
        throw error;
    }
};


// 2. 내 정보 조회 (GET/users/me)
export const my_infoAPI = async () => {
    try {
        const response = await axiosInstance.get("/users/me")
        return response.data
    } catch(error) {
        console.error("내 정보 조회 애러: ", error);
        throw error;
    }
};


// 3. 아이디 변경 (PATCH/users/me/id)
export const update_idAPI = async (password, new_id) => {
    try {
        const response = await axiosInstance.patch("/users/me/id", {
            password: password,
            new_id: new_id
        });
    return response.data
    } catch(error) {
        console.error("내 아이디 변경 API 에러: ", error);
        throw error;
    }
};

// 4. 비밀번호 변경 (PATCH/users/me/password) - password, new_password
export const update_passwordAPI = async (password, new_password) => {
    try {
        const response = await axiosInstance.patch("/users/me/password", {
            password: password,
            new_password: new_password
        });
    return response.data
    } catch(error) {
        console.error("내 비밀번호 변경 API 에러: ", error);
        throw error;
    }
};

// 5. 회원탈퇴 (DELETE/users/me)
export const delete_meAPI = async (password) => {
    try {
        const response = await axiosInstance.delete("users/me", {
            data: {password: password}
        });
    return response.data
    } catch(error) {
        console.error("내 계정 삭제 API 에러: ", error);
        throw error;
    }
};

// 6. 계정 복구 (POST/users/me/restore)
export const restore_meAPI = async (id, password) => {
    try {
        const response = await axiosInstance.post("users/me/restore", {
            id: id,
            password: password
        });
    return response.data
    } catch (error) {
        console.error("내 계정 복구 API 에러: ", error);
        throw error;
    }
};