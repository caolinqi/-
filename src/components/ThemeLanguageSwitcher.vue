<template>
  <div class="theme-language-switcher">
    <!-- Language Selector -->
    <div class="language-selector">
      <button class="ghost-btn" @click="showLanguages = !showLanguages">
        <span class="current-lang">{{ currentLangLabel }}</span>
      </button>
      
      <div v-if="showLanguages" class="language-dropdown">
        <button 
          v-for="lang in languages" 
          :key="lang.value"
          class="language-option"
          :class="{ active: locale === lang.value }"
          @click="changeLanguage(lang.value)"
        >
          <span class="lang-code">{{ lang.value.split('-')[0].toUpperCase() }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showLanguages = ref(false)

const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' }
]

const currentLangLabel = computed(() => {
  return locale.value.split('-')[0].toUpperCase()
})

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  showLanguages.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.language-selector')) {
    showLanguages.value = false
  }
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('click', handleClickOutside)
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickOutside)
    }
})
</script>

<style scoped lang="scss">
.theme-language-switcher {
  display: flex;
  align-items: center;
  gap: 16px;

  .ghost-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    color: #9ca3af; /* text-gray-400 */
    font-size: 0.75rem; /* text-xs matches Navbar */
    font-weight: 500;
    letter-spacing: 0.2em; /* Wide spacing */
    transition: color 0.3s;
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;

    &:hover {
      color: #fff;
    }
  }

  .language-selector {
    position: relative;

    .language-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 12px;
      background: rgba(0,0,0,0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 60px;
      z-index: 50;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(4px);

      .language-option {
        background: transparent;
        border: none;
        width: 100%;
        padding: 12px 16px;
        text-align: center;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        font-weight: 700;
        transition: all 0.2s;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        &.active {
          color: #fff;
        }
      }
    }
  }
}
</style>
