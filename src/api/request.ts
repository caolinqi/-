import axios from 'axios'

// 1. Create axios instance
const service = axios.create({
    // Base URL for API - change VITE_API_BASE_URL in .env
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000
})

// 2. Request Interceptor
service.interceptors.request.use(
    (config) => {
        // Retrieve token from storage specifically to avoid circular dependency with Pinia Store
        const session = localStorage.getItem('arch_user_session')
        if (session) {
            try {
                const data = JSON.parse(session)
                if (data.token) {
                    config.headers.Authorization = `Bearer ${data.token}`
                }
            } catch (e) { }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 3. Response Interceptor
service.interceptors.response.use(
    (response) => {
        // Return the response data directly
        const res = response.data
        // You can handle standard error codes here (e.g., if (res.code !== 200))
        return res
    },
    (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)

export default service
