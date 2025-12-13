import { defineStore } from 'pinia'
import { ref } from 'vue'

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

    // Internal Mock DB
    const registeredUsers = ref<{ username: string, password: string, avatarId: string, bio: string }[]>([])

    // Load registered users from local storage on init
    const loadRegisteredUsers = () => {
        const data = localStorage.getItem('arch_registered_users')
        if (data) {
            try { registeredUsers.value = JSON.parse(data) } catch (e) { }
        }
    }
    const saveRegisteredUsers = () => localStorage.setItem('arch_registered_users', JSON.stringify(registeredUsers.value))

    // Actions
    const register = async (username: string, password: string): Promise<void> => {
        isLoading.value = true
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                isLoading.value = false

                if (registeredUsers.value.find(u => u.username === username)) {
                    reject(new Error('User already exists'))
                    return
                }

                // Register new user
                const newUser = {
                    username,
                    password,
                    avatarId: '1',
                    bio: 'New architect in the void.'
                }
                registeredUsers.value.push(newUser)
                saveRegisteredUsers()

                // Auto login
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

                let foundUser: UserProfile | null = null;

                // 1. Default Admin Check
                if (username === 'admin' && password === '123456') {
                    foundUser = {
                        username: 'admin',
                        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=admin',
                        avatarId: 'admin',
                        bio: 'System Administrator'
                    }
                }
                // 2. Mock Registered Check
                else {
                    const reg = registeredUsers.value.find(u => u.username === username && u.password === password)
                    if (reg) {
                        foundUser = {
                            username: reg.username,
                            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${reg.username}`, // Use username as seed base or ID
                            avatarId: reg.avatarId,
                            bio: reg.bio
                        }
                    }
                }

                if (foundUser) {
                    token.value = 'mock-token-' + Date.now()
                    user.value = foundUser
                    isLoggedIn.value = true

                    // Load mock activities if empty
                    if (recentActivities.value.length === 0) {
                        recentActivities.value = [
                            { id: 'init_1', action: 'SYSTEM_INIT', target: 'Arch-OS v2.0', timestamp: new Date().toLocaleString() }
                        ]
                    }
                    saveSession()
                    resolve()
                } else {
                    reject(new Error('Invalid credentials'))
                }
            }, 1000)
        })
    }

    const logout = () => {
        user.value = null
        token.value = null
        isLoggedIn.value = false
        recentActivities.value = []
        localStorage.removeItem('arch_user_session')
    }

    const updateProfile = (data: { name?: string, bio?: string, avatarId?: string | number }) => {
        if (!user.value) return

        if (data.name) user.value.username = data.name
        if (data.bio) user.value.bio = data.bio
        if (data.avatarId) user.value.avatarId = data.avatarId

        // Update URL if avatar changed
        if (user.value.username) {
            // We use avatarId as seed if provided, else username
            const seed = data.avatarId || user.value.username
            user.value.avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`
        }

        // Update in registeredUsers list if applicable
        const regIndex = registeredUsers.value.findIndex(u => u.username === user.value?.username)
        if (regIndex >= 0 && user.value) {
            registeredUsers.value[regIndex].bio = user.value.bio || ''
            registeredUsers.value[regIndex].avatarId = String(user.value.avatarId || '1')
            saveRegisteredUsers()
        }

        saveSession()
    }

    const changePassword = async (oldPw: string, newPw: string): Promise<void> => {
        isLoading.value = true
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                isLoading.value = false

                // Allow admin to always change? Or restrict default admin?
                // Let's assume default admin password acts as "oldPw" check
                if (user.value?.username === 'admin') {
                    // For admin, we don't persist password change in this simple mock unless we want to
                    // But user asked for "others need register", implying admin is fixed or special.
                    // Let's just allow it for the session.
                    if (oldPw === '123456') {
                        logActivity('PASSWORD_UPDATE', 'SECURITY_OPS')
                        resolve()
                    } else {
                        reject(new Error('Invalid old password'))
                    }
                    return;
                }

                const regIndex = registeredUsers.value.findIndex(u => u.username === user.value?.username)
                if (regIndex >= 0) {
                    if (registeredUsers.value[regIndex].password === oldPw) {
                        registeredUsers.value[regIndex].password = newPw
                        saveRegisteredUsers()
                        logActivity('PASSWORD_UPDATE', 'SECURITY_OPS')
                        resolve()
                    } else {
                        reject(new Error('Invalid old password'))
                    }
                } else {
                    reject(new Error('User not found in registry'))
                }
            }, 1000)
        })
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
                recentActivities: recentActivities.value
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
            } catch (e) {
                console.error('Failed to restore session', e)
                logout()
            }
        }
        loadRegisteredUsers()
    }

    // Initialize
    restoreSession()

    return {
        user,
        token,
        isLoggedIn,
        isLoading,
        recentActivities,
        login,
        register,
        logout,
        updateProfile,
        logActivity,
        changePassword
    }
})
