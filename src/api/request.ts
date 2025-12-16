import axios from 'axios'

// 1. 创建 Axios 实例
const service = axios.create({
    // 基础 URL：所有请求都会加上这个前缀
    // 在 vite.config.ts 中配置了 '/api' 代理转发到 localhost:3000
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000 // 请求超时时间
})

// 2. 请求拦截器 (Refquest Interceptor)
// 在发送请求之前执行，常用于自动携带 Token
service.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取用户 Session
        // 注意：这里直接读取 localStorage 是为了避免与 Pinia Store 产生循环依赖
        const session = localStorage.getItem('arch_user_session')
        if (session) {
            try {
                const data = JSON.parse(session)
                // 如果 Token 存在，则添加到请求头
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

// 3. 响应拦截器 (Response Interceptor)
// 在收到后端响应后执行，常用于统一处理数据格式或错误
service.interceptors.response.use(
    (response) => {
        // 直接返回后端数据的 data 字段，简化前端调用
        const res = response.data
        // 这里可以进行全局错误码判断，例如 if (res.code !== 200) ...
        return res
    },
    (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)

export default service
