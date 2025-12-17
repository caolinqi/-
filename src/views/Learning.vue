<template>
  <div class="learning-dashboard">
    <div class="dashboard-container">
      
      <!-- HERO HUD SECTION -->
      <section class="hud-section">
          <!-- ID CARD (LEFT) -->
          <div class="holo-id-card">
              <div class="scan-line"></div>
              <div class="id-header">
                  <span class="id-label">OPERATOR_ID</span>
                  <span class="id-value">#{{ padZero(gameStore.userLevel) }}85-{{ gameStore.userLevel * 34 }}</span>
              </div>
              <div class="id-body">
                  <div class="avatar-frame">
                      <div class="avatar-placeholder">{{ gameStore.userLevel }}</div>
                  </div>
                  <div class="id-info">
                      <h1 class="glitch-title" :data-text="$t(gameStore.userTitleKey)">{{ $t(gameStore.userTitleKey) }}</h1>
                      <div class="level-indicator">
                          <span class="lvl-label">CLEARANCE LEVEL</span>
                          <span class="lvl-num">{{ padZero(gameStore.userLevel) }}</span>
                      </div>
                  </div>
              </div>
              <div class="exp-bar-wrapper">
                  <div class="exp-fill" :style="{ width: gameStore.progressPercentage + '%' }"></div>
                  <div class="exp-text">EXP: <span class="ticker">{{ displayedExp }}</span> / {{ gameStore.nextLevelExp }}</div>
              </div>
          </div>

          <!-- RADAR CHART (CENTER) -->
          <div class="radar-hud">
              <div class="radar-wrapper">
                <svg viewBox="0 0 100 100" class="radar-svg">
                    <polygon points="50,10 90,40 75,90 25,90 10,40" class="radar-grid" />
                    <polygon points="50,30 70,45 62,70 38,70 30,45" class="radar-grid inner" />
                    <polygon :points="animatedPoints" class="radar-data" />
                </svg>
                <div class="radar-scan-effect"></div>
              </div>
              <div class="stat-readout">
                  <div class="stat-row">STR: {{ gameStore.userStats?.structure || 0 }}</div>
                  <div class="stat-row">HST: {{ gameStore.userStats?.history || 0 }}</div>
                  <div class="stat-row">OBS: {{ gameStore.userStats?.observation || 0 }}</div>
              </div>
          </div>

          <!-- SYSTEM STATUS (RIGHT) -->
          <div class="system-hud">
              <div class="system-header">SYSTEM STATUS</div>
              <div class="status-grid">
                  <div class="status-item">
                      <span class="label">MODULES</span>
                      <span class="value ok">ONLINE</span>
                  </div>
                  <div class="status-item">
                      <span class="label">SYNC</span>
                      <span class="value ok">STABLE</span>
                  </div>
                  <div class="status-item">
                      <span class="label">BADGES</span>
                      <span class="value">{{ gameStore.unlockedBadges.length }} ACQUIRED</span>
                  </div>
              </div>
              <div class="active-badge-preview">
                  <div v-if="gameStore.unlockedBadges.length" class="badge-icon">★</div>
                  <div v-else class="badge-none">NO DATA</div>
              </div>
          </div>
      </section>

      <!-- BENTO GRID MODULES -->
      <section class="modules-grid">
          
          <!-- 1. ARCHITECT'S EYE (2x2) -->
          <div class="bento-card x2-y2 eye-module" @click="openModule('eye')" style="animation-delay: 0.1s">
              <div class="card-bg"></div>
              <div class="card-content">
                  <div class="card-top">
                      <div class="module-id">MOD_01</div>
                      <div class="icon-lg">👁</div>
                  </div>
                  <div class="card-btm">
                      <h2 class="mod-title glitch-hover" :data-text="$t('learning.modulesList.eye.title')">{{ $t('learning.modulesList.eye.title') }}</h2>
                      <p class="mod-desc">{{ $t('learning.modulesList.eye.desc') }}</p>
                      <button class="action-btn">INITIATE_SCAN</button>
                  </div>
              </div>
          </div>

          <!-- 2. DAILY CHALLENGE (1x2) -->
          <div class="bento-card x1-y2 daily-module" @click="openModule('quiz')" style="animation-delay: 0.2s">
               <div class="card-content centered">
                   <div class="daily-tag">Daily 2X</div>
                   <div class="timer-display">08:00:00</div>
                   <div class="icon-md">⚡</div>
                   <h3 class="mod-title-v">{{ $t('learning.modulesList.daily.title') }}</h3>
               </div>
          </div>

          <!-- 3. MATERIAL MATCH (2x1) -->
          <div class="bento-card x2-y1 puzzle-module" @click="openModule('puzzle')" style="animation-delay: 0.3s">
              <div class="card-content flex-row">
                  <div class="icon-md">⚒</div>
                  <div class="text-group">
                      <h3 class="mod-title">{{ $t('learning.modulesList.match.title') }}</h3>
                      <span class="mod-sub">{{ $t('learning.modulesList.match.desc') }}</span>
                  </div>
                  <div class="action-arrow">→</div>
              </div>
          </div>

          <!-- 4. CHRONO SORT (1x1) -->
          <div class="bento-card x1-y1 chrono-module" @click="openModule('chrono')" style="animation-delay: 0.4s">
              <div class="card-content centered">
                  <div class="icon-sm">⏳</div>
                  <div class="mod-title-xs">{{ $t('learning.modulesList.chrono.title') }}</div>
                  <div class="status-tag">ACTIVE</div>
              </div>
          </div>

          <!-- 5. BLUEPRINT DECODER (1x1) -->
          <div class="bento-card x1-y1 blueprint-module" @click="openModule('blueprint')" style="animation-delay: 0.5s">
               <div class="card-content centered">
                  <div class="icon-sm">📐</div>
                  <div class="mod-title-xs">{{ $t('learning.modulesList.blueprint.title') }}</div>
                  <div class="status-tag">ACTIVE</div>
              </div>
          </div>

          <!-- 6. AI TUTOR (DEEPSEEK) (2x2) -->
          <div class="bento-card x2-y2 ai-launch-module" @click="openModule('ai')" style="animation-delay: 0.6s">
              <div class="matrix-bg"></div>
              <div class="card-content">
                  <div class="card-top">
                      <div class="module-id">AI_CORE</div>
                      <div class="icon-lg">🤖</div>
                  </div>
                  <div class="card-btm">
                      <h2 class="mod-title glitch-hover" data-text="AI TUTOR">AI TUTOR</h2>
                      <p class="mod-desc">{{ locale === 'zh-CN' ? '接入 ARCH-MIND 神经网络' : 'Access ARCH-MIND Neural Net' }}</p>
                      <button class="action-btn">CONNECT</button>
                  </div>
              </div>
          </div>

      </section>

    </div>

    <!-- MODAL CONTAINER -->
    <Transition name="modal-fade">
        <div v-if="activeModule" class="module-overlay">
            <div class="module-window">
                <button class="win-close-btn" @click="closeModule">×</button>
                <QuizModule v-if="activeModule === 'quiz'" @close="closeModule" />
                <EyeModule v-if="activeModule === 'eye'" @close="closeModule" />
                <PuzzleGame v-if="activeModule === 'puzzle'" @close="closeModule" />
                <ChronoGame v-if="activeModule === 'chrono'" @close="closeModule" />
                <BlueprintGame v-if="activeModule === 'blueprint'" @close="closeModule" />
                <AITutorModule v-if="activeModule === 'ai'" />
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useI18n } from 'vue-i18n'
import QuizModule from '@/components/learning/QuizModule.vue'
import PuzzleGame from '@/components/learning/PuzzleGame.vue'
import EyeModule from '@/components/learning/EyeModule.vue'
import AITutorModule from '@/components/learning/AITutorModule.vue'
import ChronoGame from '@/components/learning/ChronoGame.vue'
import BlueprintGame from '@/components/learning/BlueprintGame.vue'

// Use raw requestAnimationFrame for number ticker to avoid dependency issues if gsap not present
const gameStore = useGameStore()
const { locale } = useI18n()
const activeModule = ref<string | null>(null)
const displayedExp = ref(0)
const radarProgress = ref(0)

const openModule = (type: string) => {
    // Play sound placeholder
    // playSound('open')
    activeModule.value = type
}

const closeModule = () => {
    activeModule.value = null
}

const padZero = (num: number) => num.toString().padStart(2, '0')

// --- ANIMATION: NUMBER TICKER ---
onMounted(() => {
    // Animate EXP from 0 to current
    const target = gameStore.currentExp
    const duration = 1500 // ms
    const startTime = performance.now()

    const tick = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease Out Quart
        const ease = 1 - Math.pow(1 - progress, 4)
        
        displayedExp.value = Math.floor(target * ease)

        if (progress < 1) {
            requestAnimationFrame(tick)
        }
    }
    requestAnimationFrame(tick)

    // Animate Radar Expansion
    setTimeout(() => {
        radarProgress.value = 1
    }, 500)
})

// --- ANIMATION: RADAR CHART ---
const animatedPoints = computed(() => {
    const stats = gameStore.userStats || {}
    const c = 50 
    const r = 40 
    
    // Scale current stats by the expansion progress (0 to 1)
    const p = radarProgress.value

    const sStructure = ((stats.structure || 0) / 100) * p
    const sHistory = ((stats.history || 0) / 100) * p
    const sObservation = ((stats.observation || 0) / 100) * p
    const sMaterial = ((stats.material || 0) / 100) * p
    const sAesthetic = ((stats.aesthetic || 0) / 100) * p

    const getX = (angle: number, val: number) => c + Math.cos(angle * Math.PI / 180) * (r * val)
    const getY = (angle: number, val: number) => c + Math.sin(angle * Math.PI / 180) * (r * val)

    const p1 = `${getX(-90, sStructure)},${getY(-90, sStructure)}`
    const p2 = `${getX(-18, sHistory)},${getY(-18, sHistory)}`
    const p3 = `${getX(54, sObservation)},${getY(54, sObservation)}`
    const p4 = `${getX(126, sMaterial)},${getY(126, sMaterial)}`
    const p5 = `${getX(198, sAesthetic)},${getY(198, sAesthetic)}`

    return `${p1} ${p2} ${p3} ${p4} ${p5}`
})

</script>

<style scoped lang="scss">
/* --- CORE LAYOUT --- */
.learning-dashboard {
    min-height: 100vh;
    background: #030303;
    color: #e0e0e0;
    font-family: 'JetBrains Mono', monospace;
    padding: 100px 20px 40px;
    background-image: 
        radial-gradient(circle at 50% 50%, #111 0%, #030303 60%),
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
}

.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
}

/* --- HUD HERO SECTION --- */
.hud-section {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 30px;
    margin-bottom: 60px;
    padding-bottom: 30px;
    border-bottom: 2px solid #222;
}

/* 1. HOLOGRAPHIC ID CARD */
.holo-id-card {
    background: rgba(10, 10, 10, 0.8);
    border: 1px solid #333;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    padding: 24px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: rgba(0, 255, 204, 0.5);
        box-shadow: 0 0 10px #00ffcc;
        animation: scanline 4s linear infinite;
        z-index: 10;
        opacity: 0.5;
    }
}

.id-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: #666;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

.id-body {
    display: flex;
    gap: 24px;
}

.avatar-frame {
    width: 80px;
    height: 80px;
    border: 2px solid #444;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    
    .avatar-placeholder {
        font-size: 2rem;
        font-weight: 800;
        color: #fff;
    }
}

.id-info {
    flex: 1;
    .glitch-title {
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        font-size: 2rem;
        line-height: 1;
        margin: 0 0 10px;
        text-transform: uppercase;
        color: #fff;
        letter-spacing: -0.02em;
    }
    
    .level-indicator {
        font-size: 0.8rem;
        color: #888;
        display: flex;
        gap: 12px;
        align-items: center;
        .lvl-label { letter-spacing: 1px; font-size: 0.7rem; }
        .lvl-num { color: #00ffcc; font-weight: 700; font-size: 1rem; }
    }
}

.exp-bar-wrapper {
    margin-top: 24px;
    height: 6px;
    background: #1a1a1a;
    position: relative;
    border: 1px solid #333;
    
    .exp-fill {
        height: 100%;
        background: #fff;
        transition: width 0.5s ease-out;
    }
    
    .exp-text {
        position: absolute;
        right: 0;
        top: -18px;
        font-size: 0.7rem;
        color: #888;
        font-weight: bold;
    }
}

/* 2. RADAR HUD */
.radar-hud {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    background: rgba(10, 10, 10, 0.5);
    border: 1px solid #222;
    padding: 0 20px;
}

.radar-wrapper {
    width: 140px;
    height: 140px;
    position: relative;
    
    .radar-svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 5px rgba(0, 255, 204, 0.2));
        
        .radar-grid {
            fill: none;
            stroke: #444;
            stroke-width: 1;
        }
        .inner { stroke-dasharray: 2 2; opacity: 0.5; }
        
        .radar-data {
            fill: rgba(0, 255, 204, 0.1);
            stroke: #00ffcc;
            stroke-width: 1.5;
            transition: all 0.3s;
        }
    }
    
    .radar-scan-effect {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 1px solid transparent;
        border-top-color: rgba(0, 255, 204, 0.5);
        animation: spin 3s linear infinite;
    }
}

.stat-readout {
    font-size: 0.8rem;
    color: #888;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .stat-row { 
        border-left: 2px solid #444; 
        padding-left: 10px; 
        font-family: 'JetBrains Mono', monospace;
    }
}

/* 3. SYSTEM HUD */
.system-hud {
    border: 1px solid #222;
    padding: 24px;
    background: rgba(10, 10, 10, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.system-header {
    font-size: 0.7rem;
    color: #666;
    letter-spacing: 2px;
    border-bottom: 2px solid #222;
    padding-bottom: 10px;
    margin-bottom: 15px;
    font-weight: bold;
}

.status-grid {
    display: grid;
    gap: 12px;
    font-size: 0.8rem;
    
    .status-item {
        display: flex;
        justify-content: space-between;
        .label { color: #555; font-weight: bold; }
        .value.ok { color: #00ffcc; text-shadow: 0 0 5px rgba(0, 255, 204, 0.5); }
        .value { color: #fff; }
    }
}
.active-badge-preview {
    margin-top: 10px;
    display: flex; justify-content: flex-end;
    .badge-icon { font-size: 1.5rem; color: gold; filter: drop-shadow(0 0 5px gold); }
    .badge-none { font-size: 0.7rem; color: #333; }
}

/* --- BENTO GRID MODULES --- */
.modules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 240px; /* Taller Base height */
    gap: 24px;
}

.bento-card {
    background: #0a0a0a;
    border: 1px solid #222;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    opacity: 0; /* For staggered entry */
    animation: slideUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;

    &:hover:not(.locked-module) {
        border-color: #555;
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        z-index: 10;

        .card-bg { opacity: 0.3; transform: scale(1.05); }
        .action-arrow { padding-left: 10px; color: #fff; }
    }
}

/* Grid Spans */
.x2-y2 { grid-column: span 2; grid-row: span 2; }
.x2-y1 { grid-column: span 2; row-gap: span 1; }
.x1-y2 { grid-column: span 1; grid-row: span 2; }
.x1-y1 { grid-column: span 1; grid-row: span 1; }

/* MODULE STYLES */
.card-content {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    &.centered { justify-content: center; align-items: center; text-align: center; }
    &.flex-row { flex-direction: row; align-items: center; gap: 20px; }
}

.eye-module {
    .card-bg {
        position: absolute;
        inset: 0;
        background: url('@/assets/images/Naiku_04.jpg') center/cover;
        filter: grayscale(100%) contrast(1.2);
        opacity: 0.1;
        transition: all 0.5s;
    }
    
    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .module-id { color: #555; font-size: 0.7rem; letter-spacing: 1px; font-weight: bold; border: 1px solid #333; padding: 2px 6px; }
        .icon-lg { font-size: 3rem; opacity: 1; color: #fff; }
    }

    .mod-title {
        font-family: 'Inter', sans-serif;
        font-size: 2.5rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        margin-bottom: 10px;
        line-height: 0.9;
        color: #fff;
    }
    .mod-desc { color: #888; font-size: 0.9rem; max-width: 80%; }

    .action-btn {
        margin-top: 20px;
        background: #fff;
        color: #000;
        border: none;
        padding: 10px 20px;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 1px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s;
    }

    &:hover .action-btn { opacity: 1; transform: translateY(0); }
}

.daily-module {
    border: 1px solid rgba(0, 255, 204, 0.3);
    background: rgba(0, 255, 204, 0.02);
    
    .daily-tag {
        background: #00ffcc;
        color: #000;
        padding: 4px 8px;
        font-size: 0.7rem;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: auto;
    }
    .timer-display { font-size: 1.8rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; margin: 20px 0; }
    .icon-md { font-size: 2rem; margin-bottom: 20px; color: #00ffcc; filter: drop-shadow(0 0 5px rgba(0,255,204,0.5)); }
    .mod-title-v {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 1.2rem;
        letter-spacing: 6px;
        margin-top: auto;
        color: #888;
        font-weight: bold;
    }
}

.puzzle-module {
    background: linear-gradient(135deg, #111 0%, #050505 100%);
    .icon-md { font-size: 3rem; color: #333; transition: color 0.3s; }
    .text-group { flex: 1; margin-left: 20px; }
    .mod-title { font-size: 1.5rem; margin: 0; font-weight: 800; }
    .mod-sub { color: #555; font-size: 0.8rem; }
    .action-arrow { color: #333; font-size: 1.5rem; transition: all 0.3s; margin-left: auto; }
    
    &:hover {
        .icon-md { color: #fff; }
        .action-arrow { color: #fff; padding-left: 10px; }
    }
}

.ai-launch-module {
    background: #000;
    border: 1px solid #00ff00;
    
    .matrix-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(0deg, rgba(0,255,0,0.1) 0%, transparent 50%),
                    repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,255,0,0.1) 3px);
        background-size: 100% 100%, 100% 4px;
        opacity: 0.3;
    }

    .card-top {
        display: flex; justify-content: space-between; align-items: flex-start;
        .module-id { color: #00ff00; font-size: 0.7rem; border: 1px solid #00ff00; padding: 2px 6px; }
        .icon-lg { font-size: 3rem; color: #00ff00; text-shadow: 0 0 10px #00ff00; }
    }

    .mod-title {
        color: #00ff00; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 2rem;
        text-shadow: 0 0 5px rgba(0,255,0,0.5);
        margin-bottom: 10px;
    }
    
    .mod-desc { color: #008800; font-size: 0.8rem; font-family: 'JetBrains Mono'; }

    .action-btn {
        margin-top: 20px; background: #00ff00; color: #000; border: none; padding: 10px 20px;
        font-weight: 700; font-family: 'JetBrains Mono'; letter-spacing: 1px; cursor: pointer;
        opacity: 0; transform: translateY(10px); transition: all 0.3s;
        
        &:hover { box-shadow: 0 0 15px #00ff00; }
    }

    &:hover .action-btn { opacity: 1; transform: translateY(0); }
}

.locked-module {
    opacity: 0.6;
    cursor: not-allowed;
    background: repeating-linear-gradient(45deg, #050505, #050505 10px, #0a0a0a 10px, #0a0a0a 20px);
    border: 1px solid #1a1a1a;
    
    .lock-overlay {
        position: absolute;
        top: 15px; right: 15px;
        background: #000;
        border: 1px solid #333;
        padding: 4px 8px;
        font-size: 0.7rem;
        color: #555;
        font-weight: bold;
    }
    .icon-sm { font-size: 2.5rem; margin-bottom: 10px; opacity: 0.3; }
    .mod-title-xs { font-size: 0.9rem; color: #444; font-weight: bold;}
}

.chrono-module, .blueprint-module {
    background: #111;
    border: 1px solid #333;
    transition: 0.3s;
    .icon-sm { font-size: 2.5rem; margin-bottom: 10px; color: #aaa; transition: 0.3s; }
    .mod-title-xs { font-size: 0.9rem; color: #fff; font-weight: bold; letter-spacing: 1px; }
    .status-tag { margin-top: 10px; font-size: 0.6rem; color: #00ffcc; border: 1px solid #00ffcc; padding: 2px 6px; }

    &:hover {
        border-color: #00ffcc;
        .icon-sm { color: #00ffcc; transform: scale(1.1); }
    }
}


/* --- ANIMATIONS --- */
@keyframes scanline {
    0% { top: -20%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { top: 120%; opacity: 0; }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes slideUp {
    from { transform: translateY(60px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* --- MODAL --- */
.module-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(16px);
}

.module-window {
    width: 100%;
    height: 100%;
    position: relative;
    background: #050505;
}

.win-close-btn {
    position: absolute;
    top: 50px; right: 5px;
    background: none;
    border: 1px solid #333;
    padding: 10px 20px;
    color: #fff;
    font-size: 1rem;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.2s;
    &:hover { background: #fff; color: #000; }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 1024px) {
    .modules-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .hud-section { grid-template-columns: 1fr; gap: 20px; }
    .learning-dashboard { padding: 80px 15px 30px; }
}
@media (max-width: 600px) {
    .modules-grid { grid-template-columns: 1fr; }
    .bento-card { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 200px; }
    .id-body { gap: 15px; } 
    .radar-hud, .system-hud { display: none; } /* Focus on content on mobile */
}
</style>
