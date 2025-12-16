import request from './request'
import type { ApiResponse } from './types'
import type { Building } from '@/types'

export const getBuildings = async (): Promise<ApiResponse<Building[]>> => {
    return request.get('/buildings')
}

export const getBuildingById = async (id: number): Promise<ApiResponse<Building>> => {
    return request.get(`/buildings/${id}`)
}

export const createBuilding = async (data: Partial<Building>): Promise<ApiResponse<Building>> => {
    return request.post('/buildings', data)
}

export const updateBuilding = async (id: number, data: Partial<Building>): Promise<ApiResponse<Building>> => {
    return request.put(`/buildings/${id}`, data)
}

export const deleteBuilding = async (id: number): Promise<ApiResponse<void>> => {
    return request.delete(`/buildings/${id}`)
}

// NOTE: Favorites are user-specific. 
// Real implementation: POST /users/favorites or POST /buildings/:id/favorite
export const toggleFavorite = async (buildingId: number): Promise<ApiResponse<number[]>> => {
    // TODO: implement backend favorite toggle
    // For now we keep the mock or rely on store to handle it optimistically until backend is ready for this specific part
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ code: 200, message: 'Toggled', data: [] })
        }, 200)
    })
}
