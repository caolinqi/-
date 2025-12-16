import request from './request'
import type { ApiResponse } from './types'
import type { Quote } from '@/types'

/**
 * 获取所有名言
 */
export const getQuotes = async (): Promise<ApiResponse<Quote[]>> => {
    return request.get('/quotes')
}
