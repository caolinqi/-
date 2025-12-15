import request from './request'
import type { ApiResponse } from './types'
import type { Building } from '@/types'
import { buildings as staticBuildings } from '@/data/buildings'

// In a real app, favorites might be a separate API or part of User API.
// For now, we put it here as 'BuildingService.toggleFavorite' or similar.

export const getBuildings = async (): Promise<ApiResponse<Building[]>> => {
    // TODO: return request.get('/buildings')
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate fetching all buildings
            // Also merge "userBuildings" from localStorage if we want to keep that feature intact during migration
            const savedCustom = localStorage.getItem("japanese-architecture-user-buildings");
            let custom: Building[] = []
            if (savedCustom) {
                try { custom = JSON.parse(savedCustom) } catch (e) { }
            }
            const all = [...staticBuildings, ...custom]
            resolve({ code: 200, message: 'Success', data: all })
        }, 300)
    })
}

export const getBuildingById = async (id: number): Promise<ApiResponse<Building | undefined>> => {
    // TODO: return request.get(`/buildings/${id}`)
    return new Promise((resolve) => {
        setTimeout(() => {
            const savedCustom = localStorage.getItem("japanese-architecture-user-buildings");
            let custom: Building[] = []
            if (savedCustom) {
                try { custom = JSON.parse(savedCustom) } catch (e) { }
            }
            const all = [...staticBuildings, ...custom]
            const b = all.find(x => x.id === id)
            resolve({ code: 200, message: 'Success', data: b })
        }, 200)
    })
}

// NOTE: Favorites are user-specific. 
// Real implementation: POST /users/favorites or POST /buildings/:id/favorite
export const toggleFavorite = async (buildingId: number): Promise<ApiResponse<number[]>> => {
    // TODO: return request.post(`/buildings/${buildingId}/favorite`)
    // Mock: update localStorage "favorites" and return new list
    return new Promise((resolve) => {
        setTimeout(() => {
            // We need to access the current session's favorites.
            // This logic is currently tightly coupled with UserStore's session object.
            // We will simulate it by reading/writing the 'arch_user_session' directly or 
            // just returning success and letting Store update local state.
            // Let's just return success.
            resolve({ code: 200, message: 'Toggled', data: [] })
        }, 200)
    })
}
