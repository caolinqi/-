import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export interface UserActivity {
    id: string;
    action: string;
    target: string;
    timestamp: string;
}

export interface UserProfile {
    username: string;
    avatar?: string;
    avatarId?: string | number;
    bio?: string;
}

export const useUserStore = defineStore('user', () => {
    // State
    const user = ref<UserProfile | null>(null)
    const token = ref<string | null>(null)
    const isLoggedIn = ref(false)
    const isLoading = ref(false)
    const recentActivities = ref<UserActivity[]>([])

    // Internal Mock DB - REMOVED (Moved to API layer)
    // const registeredUsers = ref(...) 

    // Actions
    const register = async (username: string, password: string): Promise<void> => {
        isLoading.value = true
        try {
            await api.auth.register(username, password)
            // Auto login after register
            await login(username, password)
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || '注册失败'
            throw new Error(msg)
        } finally {
            isLoading.value = false
        }
    }

    const login = async (username: string, password: string): Promise<void> => {
        isLoading.value = true
        try {
            const res = await api.auth.login(username, password)
            if (res.code === 200 && res.data) {
                // Fix: Access nested 'user' object from API response
                user.value = res.data.user
                token.value = res.data.token
                isLoggedIn.value = true

                // Initialize activities if empty
                if (recentActivities.value.length === 0) {
                    recentActivities.value = [
                        { id: 'init_1', action: 'SYSTEM_INIT', target: 'Arch-OS v2.0', timestamp: new Date().toLocaleString() }
                    ]
                }
                saveSession()
                fetchFavorites() // Sync favorites
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || '登录失败'
            throw new Error(msg)
        } finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        isLoggedIn.value = false
        recentActivities.value = []
        favorites.value = [] // Clear favorites
        localStorage.removeItem('arch_user_session')
    }

    const updateProfile = async (data: { name?: string, bio?: string, avatarId?: string | number, avatar?: string }) => {
        if (!user.value) return

        try {
            // Call API
            await api.auth.updateProfile({
                name: data.name,
                bio: data.bio,
                avatarId: data.avatarId?.toString(),
                avatar: data.avatar
            })

            // Update local state on success
            if (data.name) user.value.username = data.name
            if (data.bio) user.value.bio = data.bio
            if (data.avatarId) user.value.avatarId = data.avatarId

            if (data.avatar) {
                user.value.avatar = data.avatar
            } else if (data.avatarId || user.value.username) {
                // If we didn't provide a direct avatar string, regenerate specific URL
                const seed = data.avatarId || user.value.username
                user.value.avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`
            }
            saveSession()
        } catch (e: any) {
            console.error('Update profile failed', e)
            throw e
        }
    }

    const changePassword = async (oldPw: string, newPw: string): Promise<void> => {
        if (!user.value) return
        isLoading.value = true
        try {
            await api.auth.changePassword(user.value.username, oldPw, newPw)
            logActivity('PASSWORD_UPDATE', 'SECURITY_OPS')
        } catch (e: any) {
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const logActivity = (action: string, target: string) => {
        const newActivity: UserActivity = {
            id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            action,
            target,
            timestamp: new Date().toLocaleString()
        }
        recentActivities.value.unshift(newActivity)
        if (recentActivities.value.length > 50) recentActivities.value.pop()
        saveSession()
    }

    const saveSession = () => {
        if (token.value && user.value) {
            localStorage.setItem('arch_user_session', JSON.stringify({
                token: token.value,
                user: user.value,
                isLoggedIn: isLoggedIn.value,
                recentActivities: recentActivities.value,
                // favorites: favorites.value // Don't save favorites strictly to local storage anymore? Or keep as cache?
                // Keeping as cache is fine, but fetchFavorites will overwrite.
                favorites: favorites.value
            }))
        }
    }

    const restoreSession = () => {
        const session = localStorage.getItem('arch_user_session')
        if (session) {
            try {
                const data = JSON.parse(session)
                token.value = data.token
                user.value = data.user
                isLoggedIn.value = data.isLoggedIn || false
                recentActivities.value = data.recentActivities || []
                favorites.value = data.favorites || []

                // Fetch latest from backend
                if (token.value) {
                    fetchFavorites()
                }
            } catch (e) {
                console.error('Failed to restore session', e)
                logout()
            }
        }
    }

    // Favorites
    const favorites = ref<number[]>([])

    const fetchFavorites = async () => {
        if (!token.value) return
        try {
            const { getFavorites } = await import('@/api/favorite')
            const res = await getFavorites()
            if (res.code === 200 && res.data) {
                favorites.value = res.data
            }
        } catch (e) {
            console.error('Failed to fetch favorites', e)
        }
    }

    const toggleFavorite = async (id: number) => {
        const { addFavorite, removeFavorite } = await import('@/api/favorite')

        // Optimistic update
        const index = favorites.value.indexOf(id)
        const isFav = index !== -1

        if (isFav) {
            favorites.value.splice(index, 1)
            try {
                await removeFavorite(id)
            } catch (e) {
                favorites.value.push(id) // Rollback
            }
        } else {
            favorites.value.push(id)
            try {
                await addFavorite(id)
            } catch (e) {
                const idx = favorites.value.indexOf(id)
                if (idx !== -1) favorites.value.splice(idx, 1) // Rollback
            }
        }
        // Don't save to session/localStorage, rely on backend
        // saveSession() 
    }

    // Initialize
    restoreSession()

    return {
        user,
        token,
        isLoggedIn,
        isLoading,
        recentActivities,
        favorites,
        login,
        register,
        logout,
        updateProfile,
        logActivity,
        changePassword,
        toggleFavorite
    }
})
