import request from './request'
import type { ApiResponse } from './types'
import type { UserProfile } from '@/stores/useUserStore' // We might move types later, but import for now

// Mock Data (Moved from Store)
const mockRegisteredUsers: { username: string, password: string, avatarId: string, bio: string }[] = []

// Load initial mock users
const loadMockUsers = () => {
    const data = localStorage.getItem('arch_registered_users')
    if (data) {
        try {
            const parsed = JSON.parse(data);
            mockRegisteredUsers.push(...parsed);
        } catch (e) { }
    }
}
loadMockUsers();
const saveMockUsers = () => localStorage.setItem('arch_registered_users', JSON.stringify(mockRegisteredUsers))


// --- Auth API Definition ---

export const login = async (username: string, password: string): Promise<ApiResponse<UserProfile & { token: string }>> => {
    // TODO: Replace with real API call
    // return request.post('/auth/login', { username, password })

    return new Promise((resolve, reject) => {
        setTimeout(() => {
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
            // 2. Mock DB Check
            else {
                const reg = mockRegisteredUsers.find(u => u.username === username && u.password === password)
                if (reg) {
                    foundUser = {
                        username: reg.username,
                        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${reg.username}`,
                        avatarId: reg.avatarId,
                        bio: reg.bio
                    }
                }
            }

            if (foundUser) {
                resolve({
                    code: 200,
                    message: 'Login successful',
                    data: {
                        ...foundUser,
                        token: 'mock-token-' + Date.now()
                    }
                })
            } else {
                reject(new Error('Invalid credentials'))
            }
        }, 800)
    })
}

export const register = async (username: string, password: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with real API call
    // return request.post('/auth/register', { username, password })

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockRegisteredUsers.find(u => u.username === username)) {
                reject(new Error('User already exists'))
                return
            }
            const newUser = {
                username,
                password,
                avatarId: '1',
                bio: 'New architect in the void.'
            }
            mockRegisteredUsers.push(newUser)
            saveMockUsers()
            resolve({ code: 200, message: 'Registered', data: undefined })
        }, 800)
    })
}

export const updateProfile = async (data: { name?: string, bio?: string, avatarId?: string, avatar?: string }): Promise<ApiResponse<void>> => {
    // TODO: Replace with real API call
    // return request.put('/auth/profile', data)

    return new Promise((resolve) => {
        // In local mock, we just resolve. The Store will update local state.
        // But to be consistent with "DB", we should update mockRegisteredUsers here too if possible.
        // For simplicity, we just simulate network success.
        setTimeout(() => {
            // Update logic is complicated to replicate fully here without duplicating Store state understanding.
            // We'll rely on the Store to update the "DB" (localStorage) for now, 
            // OR we iterate mockRegisteredUsers here.
            // Let's iterate here to be distinct.
            const idx = mockRegisteredUsers.findIndex(u => u.username === data.name || (data.name && u.username === 'admin')); // Admin check tricky
            if (idx >= 0) {
                if (data.bio) mockRegisteredUsers[idx].bio = data.bio
                if (data.avatarId) mockRegisteredUsers[idx].avatarId = data.avatarId
                saveMockUsers()
            }
            resolve({ code: 200, message: 'Profile Updated', data: undefined })
        }, 500)
    })
}

export const changePassword = async (username: string, oldPw: string, newPw: string): Promise<ApiResponse<void>> => {
    // TODO: Real API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin') {
                if (oldPw === '123456') resolve({ code: 200, message: 'Password Updated', data: undefined })
                else reject(new Error('Invalid old password'))
                return
            }

            const idx = mockRegisteredUsers.findIndex(u => u.username === username)
            if (idx >= 0) {
                if (mockRegisteredUsers[idx].password === oldPw) {
                    mockRegisteredUsers[idx].password = newPw
                    saveMockUsers()
                    resolve({ code: 200, message: 'Password Updated', data: undefined })
                } else {
                    reject(new Error('Invalid old password'))
                }
            } else {
                reject(new Error('User not found'))
            }
        }, 800)
    })
}
