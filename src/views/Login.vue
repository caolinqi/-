<template>
  <div class="login-wrapper">
    <!-- BACKGROUND (Fixed Texture) -->
    <div class="login-bg"></div>

    <!-- CENTERED CARD -->
    <div class="login-card">
        
      <div class="card-content-wrapper">
        <transition name="fade" mode="out-in">
            <div :key="isRegisterMode ? 'register' : 'login'" class="form-container">
              <!-- HEADER -->
              <div class="card-header">
                <div class="brand-small">
                    <span class="brand-text">ARCH·TRACE</span>
                </div>
                <h1 class="welcome-title">{{ isRegisterMode ? '注册建筑师账号' : '欢迎回来' }}</h1>
                <p class="welcome-sub">{{ isRegisterMode ? '加入我们的工作室' : '输入您的详细信息以访问账户' }}</p>
              </div>

              <!-- FORM -->
              <form @submit.prevent="handleSubmit" class="login-form">
                
                <!-- Username -->
                <div class="input-group">
                    <label>用户名</label>
                    <div class="input-field">
                        <UserOutlined class="field-icon" />
                        <input 
                            v-model="form.username" 
                            type="text" 
                            class="custom-input"
                            :class="{ 'has-error': errors.username }"
                        />
                    </div>
                    <div class="error-msg" v-if="errors.username">{{ errors.username }}</div>
                </div>

                <!-- Password -->
                <div class="input-group">
                    <label>密码</label>
                     <div class="input-field">
                        <LockOutlined class="field-icon" />
                        <input 
                            v-model="form.password" 
                            type="password" 
                            class="custom-input"
                            :class="{ 'has-error': errors.password }"
                        />
                    </div>
                    <div class="error-msg" v-if="errors.password">{{ errors.password }}</div>
                </div>

                <!-- Confirm Password (Register Only) -->
                 <div class="input-group" v-if="isRegisterMode">
                    <label>确认密码</label>
                     <div class="input-field">
                        <LockOutlined class="field-icon" />
                        <input 
                            v-model="form.confirmPassword" 
                            type="password" 
                            class="custom-input"
                            :class="{ 'has-error': errors.confirmPassword }"
                        />
                    </div>
                    <div class="error-msg" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
                </div>

                <!-- Actions (Login Only) -->
                <div class="form-row" v-if="!isRegisterMode">
                    <label class="checkbox-label">
                        <input type="checkbox" /> 
                        <span>记住我</span>
                    </label>
                    <a href="#" class="forgot-link">忘记密码？</a>
                </div>

                <!-- Button -->
                <button 
                    type="submit" 
                    class="submit-btn" 
                    :disabled="userStore.isLoading"
                    :style="{ marginTop: isRegisterMode ? '20px' : '0' }"
                >
                    <span v-if="userStore.isLoading" class="spinner"></span>
                    <span v-else>{{ isRegisterMode ? '创建档案' : '登录' }}</span>
                </button>

              </form>
            </div>
        </transition>

        <!-- FOOTER -->
        <div class="card-footer">
            <span>{{ isRegisterMode ? '已有账号？' : '还没有账号？' }} </span>
            <a href="#" class="register-link" @click.prevent="toggleMode">
                {{ isRegisterMode ? '立即登录' : '加入工作室' }}
            </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()

const isRegisterMode = ref(false)

const form = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})

const errors = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})

const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value
    // Reset form and errors
    form.username = ''
    form.password = ''
    form.confirmPassword = ''
    errors.username = ''
    errors.password = ''
    errors.confirmPassword = ''
}

const handleSubmit = async () => {
    errors.username = ''
    errors.password = ''
    errors.confirmPassword = ''

    if (!form.username) errors.username = '请输入用户名'
    if (!form.password) errors.password = '请输入密码'
    
    if (isRegisterMode.value) {
        if (!form.confirmPassword) errors.confirmPassword = '请确认密码'
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            errors.confirmPassword = '两次输入的密码不一致'
        }
    }
    
    if (errors.username || errors.password || errors.confirmPassword) return

    try {
        if (isRegisterMode.value) {
            await userStore.register(form.username, form.password)
            message.success({ 
                content: '恭喜你，注册成功', 
                class: 'brutalist-message' 
            })
        } else {
            await userStore.login(form.username, form.password)
            message.success({ 
                content: '恭喜你，登录成功', 
                class: 'brutalist-message' 
            })
        }
        router.push('/')
    } catch (e: any) {
        errors.password = e.message || (isRegisterMode.value ? '注册失败' : '登录失败')
        message.error({ 
            content: `ERROR: ${errors.password}`, 
            class: 'brutalist-message' 
        })
    }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.login-wrapper {
    position: relative;
    min-height: calc(100vh - 80px); /* Subtract approximate nav height if needed, OR just min-h-screen and let flex center it */
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 120px 20px 60px; /* Top padding for Navbar visibility */
    font-family: 'Inter', sans-serif;
    color: #fff;
    overflow: hidden;
}

.login-bg {
    position: absolute;
    inset: 0;
    /* Dark concrete/noisy texture or blurred architecture */
    background-image: url('https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=2000&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    filter: brightness(0.4) blur(4px);
    z-index: 0;
    transform: scale(1.1); /* Reduce blurred edge artifacts */
}

/* Glassmorphism Card */
.login-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px; /* Medium width */
    background: rgba(0, 0, 0, 0.6); /* bg-black/60 */
    backdrop-filter: blur(20px); /* backdrop-blur-xl */
    border: 1px solid rgba(255, 255, 255, 0.1); /* border-white/10 */
    border-radius: 12px;
    padding: 40px 50px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); /* Shadow 2xl */
    display: flex;
    flex-direction: column;
}

.card-header {
    text-align: center;
    margin-bottom: 30px;
}

.brand-small {
    display: inline-flex;
    margin-bottom: 20px;
}

.brand-text {
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
}

.welcome-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 5px 0;
}

.welcome-sub {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
}

.input-group {
    margin-bottom: 20px;
    
    label {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.8);
    }
}

.input-field {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    transition: all 0.2s;
    
    &:focus-within {
        border-color: #0960bd;
        background: rgba(0, 0, 0, 0.4);
    }
    
    .field-icon {
        padding: 0 12px;
        color: #666;
    }
}

.custom-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 12px 12px 12px 0;
    color: #fff;
    outline: none;
    
    &::placeholder { color: #444; }
}

.has-error {
    border-color: #ff4d4f;
}

.error-msg {
    color: #ff4d4f;
    font-size: 0.8rem;
    margin-top: 4px;
}

.form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size: 0.85rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #aaa;
    
    input { accent-color: #0960bd; }
}

.forgot-link {
    color: #fff;
    text-decoration: underline;
    opacity: 0.7;
    &:hover { opacity: 1; }
}

.submit-btn {
    width: 100%;
    padding: 14px;
    background: #fff; /* High contrast white */
    color: #000;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.1s, background 0.2s;
    
    &:hover {
        background: #eee;
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
}

.card-footer {
    margin-top: 30px;
    text-align: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
}

.register-link {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    margin-left: 5px;
    &:hover { text-decoration: underline; }
}

/* Spinner */
.spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(0,0,0,0.3);
    border-radius: 50%;
    border-top-color: #000;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
    .login-card {
        padding: 30px;
        width: 100%;
    }
}
</style>
