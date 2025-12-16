import request from './request'
import type { ApiResponse } from './types'
import type { Architect } from '@/types'

/**
 * 获取所有建筑师
 */
export const getArchitects = async (): Promise<ApiResponse<Architect[]>> => {
    return request.get('/architects')
}

/**
 * 获取特定建筑师详情
 */
export const getArchitectById = async (id: number): Promise<ApiResponse<Architect>> => {
    return request.get(`/architects/${id}`)
}
