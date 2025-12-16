import request from './request'
import type { ApiResponse } from './types'
// --- 认证相关 API ---

/**
 * 登录接口
 * @param username 用户名
 * @param password 密码
 */
export const login = async (username: string, password: string): Promise<ApiResponse<UserProfile & { token: string }>> => {
    // 发送 POST 请求到后端 /auth/login
    return request.post('/auth/login', { username, password })
}

/**
 * 注册接口
 */
export const register = async (username: string, password: string): Promise<ApiResponse<void>> => {
    return request.post('/auth/register', { username, password })
}

/**
 * 更新个人资料 (后端开发中)
 */
export const updateProfile = async (data: { name?: string, bio?: string, avatarId?: string, avatar?: string }): Promise<ApiResponse<void>> => {
    // 这里调用 PUT /auth/profile
    return request.put('/auth/profile', data)
}

/**
 * 修改密码 (后端开发中)
 */
export const changePassword = async (username: string, oldPw: string, newPw: string): Promise<ApiResponse<void>> => {
    return request.put('/auth/password', { username, oldPassword: oldPw, newPassword: newPw })
}

