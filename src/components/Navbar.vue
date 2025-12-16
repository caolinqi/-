<template>
  <nav class="navbar" :class="{ 'navbar-visible': isVisible, 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      
      <!-- LOGO -->
      <div class="logo">
        <router-link to="/">
          ARCH·TRACE&nbsp;·筑迹
        </router-link>
      </div>

      <!-- NAVIGATION LINKS -->
      <div class="nav-links">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-item">
          {{ $t(link.labelKey) }}
        </router-link>
      </div>

      <!-- ACTIONS -->
      <div class="nav-actions">
        <!-- Vben Style Auth Link -->
        <router-link v-if="!userStore.isLoggedIn" to="/login" class="login-link">
            Log in
        </router-link>
        <div v-else class="user-info">
            <router-link to="/profile" class="avatar-circle-link">
                <span class="avatar-circle">
                    <img v-if="userStore.user && userStore.user.avatar" :src="userStore.user.avatar" alt="User" />
                    <span v-else>{{ userStore.user?.username?.charAt(0) }}</span>
                </span>
            </router-link>
            <span class="username">{{ userStore.user?.username }}</span>
        </div>

        <ThemeLanguageSwitcher />
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeLanguageSwitcher from './ThemeLanguageSwitcher.vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
const router = useRouter()
const isScrolled = ref(false)
const isVisible = ref(true)

const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}

const navLinks = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/timeline', labelKey: 'nav.timeline' },

  { path: '/map', labelKey: 'nav.map' },
  { path: '/lineage', labelKey: 'nav.lineage' },
  { path: '/archive', labelKey: 'nav.archive' },

  { path: '/dialogue', labelKey: 'nav.dialogue' },
  { path: '/learning', labelKey: 'nav.learning' },

  // Statistics and Quiz removed
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleMouseMove = (e: MouseEvent) => {
    // Show if mouse is near top (allowance 80px)
    if (e.clientY < 80) {
        isVisible.value = true;
    } else {
        // If not near top and scrolled down, hide
        if (window.scrollY > 50) {
            isVisible.value = false;
        } else {
            // If at top of page, always show
            isVisible.value = true;
        }
    }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;900&display=swap');

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px; /* h-16 */
  z-index: 2000; /* High z-index to ensure visibility over Map layers */
  background-color: rgba(0, 0, 0, 0.8); /* bg-black/80 */
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* border-white/10 */
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, background 0.3s;
  transform: translateY(-100%); /* Default Hidden */
  
  &.navbar-visible {
      transform: translateY(0);
  }
}

.navbar-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-family: 'Inter', sans-serif;
  font-weight: 900; /* font-black */
  font-size: 1.25rem; /* text-xl */
  text-transform: uppercase;
  letter-spacing: -0.05em; /* tracking-tighter */
  color: #fff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-item {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  text-transform: uppercase;
  letter-spacing: 0.2em; /* tracking-[0.2em] */
  color: #9ca3af; /* text-gray-400 */
  text-decoration: none;
  transition: color 0.3s;
  position: relative;

  &:hover {
    color: #fff;
  }

  &.router-link-active {
    color: #fff;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #fff;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
}

/* Vben Style Nav Actions */
.login-link {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    padding: 6px 16px;
    border-radius: 4px;
    background: #0960bd; /* Vben Blue */
    transition: background 0.2s;
    
    &:hover { background: #0050b3; }
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: #fff;
}

.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #333;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.2);
    
    img { width: 100%; height: 100%; object-fit: cover; }
}

.logout-link {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 0.8rem;
    margin-left: 10px;
    
    &:hover { color: #fff; text-decoration: underline; }
}

/* Responsive Hide/Show */
@media (max-width: 900px) {
  .nav-links {
    display: none; 
  }
}
</style>
