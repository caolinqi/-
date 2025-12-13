import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    // State
    const user = ref<{ username: string, avatar?: string } | null>(null)
    const token = ref<string | null>(null)
    const isLoggedIn = ref(false)
    const isLoading = ref(false)

    // Actions
    const register = async (username: string, password: string): Promise<void> => {
        isLoading.value = true
        return new Promise((resolve) => {
            setTimeout(() => {
                isLoading.value = false
                // Auto login after register
                login(username, password)
                resolve()
            }, 1000)
        })
    }

    const login = async (username: string, password: string): Promise<void> => {
        isLoading.value = true
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                isLoading.value = false
                if (username && password) {
                    // Mock Success
                    token.value = 'mock-token-' + Date.now()
                    user.value = {
                        username: username,
                        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + username
                    }
                    isLoggedIn.value = true
                    saveSession()
                    resolve()
                } else {
                    reject(new Error('请输入用户名和密码'))
                }
            }, 1000)
        })
    }

    const logout = () => {
        user.value = null
        token.value = null
        isLoggedIn.value = false
        localStorage.removeItem('arch_user_session')
        // We will handle redirect in the component (or let router guard handle it on navigation)
    }

    const saveSession = () => {
        if (token.value && user.value) {
            localStorage.setItem('arch_user_session', JSON.stringify({
                token: token.value,
                user: user.value,
                isLoggedIn: isLoggedIn.value
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
            } catch (e) {
                console.error('Failed to restore session', e)
                logout()
            }
        }
    }

    // Initialize
    restoreSession()

    return {
        user,
        token,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout
    }
})
