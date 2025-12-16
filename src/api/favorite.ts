import request from './request'
import type { ApiResponse } from './types'

/**
 * 获取当前用户的所有收藏 (返回建筑 ID 列表)
 */
export const getFavorites = async (): Promise<ApiResponse<number[]>> => {
    return request.get('/favorites')
}

/**
 * 添加收藏
 */
export const addFavorite = async (buildingId: number): Promise<ApiResponse<any>> => {
    return request.post(`/favorites/${buildingId}`)
}

/**
 * 取消收藏
 */
export const removeFavorite = async (buildingId: number): Promise<ApiResponse<any>> => {
    return request.delete(`/favorites/${buildingId}`)
}
