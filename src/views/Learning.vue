<template>
  <div class="arch-lab-page">
    <div class="lab-container">
      
      <!-- SECTION 1: HUD (HEADS UP DISPLAY) -->
      <div class="hud-panel">
        <div class="hud-left">
            <div class="user-level-box">
                <span class="label">SEC.LEVEL</span>
                <span class="value">{{ padZero(gameStore.userLevel) }}</span>
            </div>
            <div class="user-title-box">
                <h1 class="glitch-text" :data-text="$t(gameStore.userTitleKey)">{{ $t(gameStore.userTitleKey) }}</h1>
                <div class="exp-line-container">
                    <div class="exp-line-fill" :style="{ width: gameStore.progressPercentage + '%' }"></div>
                </div>
                <div class="exp-text">{{ gameStore.currentExp }} / {{ gameStore.nextLevelExp }} EXP</div>
            </div>
        </div>

        <div class="hud-center">
            <!-- RADAR CHART -->
            <div class="radar-container">
                <svg viewBox="0 0 100 100" class="radar-svg">
                    <!-- Background Grid -->
                    <polygon points="50,10 90,40 75,90 25,90 10,40" class="radar-bg-grid" />
                    <polygon points="50,30 70,45 62,70 38,70 30,45" class="radar-bg-grid inner" />
                    
                    <!-- Data Shape -->
                    <polygon :points="radarPoints" class="radar-shape" />
                    
                    <!-- Axis Lines -->
                    <line x1="50" y1="50" x2="50" y2="10" class="axis-line" />
                    <line x1="50" y1="50" x2="90" y2="40" class="axis-line" />
                    <line x1="50" y1="50" x2="75" y2="90" class="axis-line" />
                    <line x1="50" y1="50" x2="25" y2="90" class="axis-line" />
                    <line x1="50" y1="50" x2="10" y2="40" class="axis-line" />
                </svg>
                <div class="stat-label top">{{ $t('learning.stats.structure') }}</div>
                <div class="stat-label right-top">{{ $t('learning.stats.history') }}</div>
                <div class="stat-label right-bot">{{ $t('learning.stats.observation') }}</div>
                <div class="stat-label left-bot">{{ $t('learning.stats.material') }}</div>
                <div class="stat-label left-top">{{ $t('learning.stats.aesthetic') }}</div>
            </div>
        </div>

        <div class="hud-right">
            <div class="system-status">
                <div class="status-row">
                    <span>SYSTEM:</span>
                    <span class="status-ok">ONLINE</span>
                </div>
                <div class="status-row">
                    <span>MODULES:</span>
                    <span>5/5</span>
                </div>
                <div class="badge-preview">
                    <span>LATEST BADGE:</span>
                    <div class="mini-badge" v-if="gameStore.unlockedBadges.length > 0">
                        {{ gameStore.unlockedBadges[gameStore.unlockedBadges.length - 1] }}
                    </div>
                    <div class="mini-badge locked" v-else>NONE</div>
                </div>
            </div>
        </div>
      </div>

      <!-- SECTION 2: BENTO TRAINING GRID -->
      <div class="training-grid">
        
        <!-- CARD 1: ARCHITECT'S EYE (2x2) -->
        <div class="grid-card card-2x2 eye-module" @click="openModule('eye')">
            <div class="card-bg"></div>
            <div class="card-content">
                <div class="module-icon">👁</div>
                <h2 class="module-title">{{ $t('learning.modulesList.eye.title') }}</h2>
                <div class="module-desc">{{ $t('learning.modulesList.eye.desc') }}</div>
                <button class="start-btn">INITIATE</button>
            </div>
            <div class="card-corner-decor"></div>
        </div>

        <!-- CARD 2: MATERIAL MATCH (2x1) -->
        <div class="grid-card card-2x1 material-module" @click="openModule('puzzle')">
             <div class="card-content">
                <div class="module-header">
                    <div class="module-icon">⚒</div>
                    <h2 class="module-title">{{ $t('learning.modulesList.match.title') }}</h2>
                </div>
                 <div class="module-desc">{{ $t('learning.modulesList.match.desc') }}</div>
            </div>
        </div>

        <!-- CARD 3: CHRONO SORT (1x1) -->
        <div class="grid-card card-1x1 chrono-module locked">
             <div class="card-content">
                 <div class="lock-overlay"><span class="lock-icon">🔒</span> <br> LV.2 REQ</div>
                <div class="module-icon">⏳</div>
                <h3 class="module-title-sm">{{ $t('learning.modulesList.chrono.title') }}</h3>
            </div>
        </div>

        <!-- CARD 4: BLUEPRINT DECODER (1x1) -->
        <div class="grid-card card-1x1 blueprint-module locked">
             <div class="card-content">
                 <div class="lock-overlay"><span class="lock-icon">🔒</span> <br> LV.5 REQ</div>
                <div class="module-icon">📐</div>
                <h3 class="module-title-sm">{{ $t('learning.modulesList.blueprint.title') }}</h3>
            </div>
        </div>

        <!-- CARD 5: DAILY CHALLENGE (1x2) -->
        <div class="grid-card card-1x2 daily-module" @click="openModule('quiz')">
            <div class="card-content">
                <div class="daily-tag">2X EXP</div>
                <div class="module-icon">⚡</div>
                <div class="timer">08:00:21</div>
                <h2 class="module-title vertical-text">{{ $t('learning.modulesList.daily.title') }}</h2>
            </div>
        </div>

      </div>

    </div>

    <!-- MODALS -->
    <div v-if="activeModule" class="module-modal-overlay">
        <div class="module-modal-content">
            <button class="close-modal-btn" @click="closeModule">
                [CLOSE_TERMINAL]
            </button>
            <QuizModule v-if="activeModule === 'quiz' || activeModule === 'eye'" @close="closeModule" />
            <PuzzleModule v-if="activeModule === 'puzzle'" @close="closeModule" />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import QuizModule from '@/components/learning/QuizModule.vue'
import PuzzleModule from '@/components/learning/PuzzleModule.vue'

const gameStore = useGameStore()
const activeModule = ref<string | null>(null)

const openModule = (type: string) => {
    activeModule.value = type
}

const closeModule = () => {
    activeModule.value = null
}

const padZero = (num: number) => num.toString().padStart(2, '0')

// Radar Chart Calculation
const radarPoints = computed(() => {
    const stats = gameStore.userStats
    const c = 50 // Center
    const r = 40 // Radius
    
    // 5 Axis: Top (Structure), Right-Top (History), Right-Bot (Observation), Left-Bot (Material), Left-Top (Aesthetic)
    // Angles: -90, -18, 54, 126, 198 (Standard Pentagon angles rotated)
    
    // Normalize stats 0-100 to 0-1
    const sStructure = (stats.structure || 0) / 100
    const sHistory = (stats.history || 0) / 100
    const sObservation = (stats.observation || 0) / 100
    const sMaterial = (stats.material || 0) / 100
    const sAesthetic = (stats.aesthetic || 0) / 100

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
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

.arch-lab-page {
    min-height: 100vh;
    background-color: #050505;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    padding-top: 80px;
    padding-bottom: 40px;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
}

.lab-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

/* --- HUD --- */
.hud-panel {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 30px;
    margin-bottom: 40px;
}

.hud-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.user-level-box {
    display: flex;
    align-items: baseline;
    gap: 10px;
    color: #888;
    
    .label { font-size: 0.8rem; letter-spacing: 2px; }
    .value { font-size: 3rem; font-weight: 800; line-height: 1; color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
}

.user-title-box {
    h1 {
        font-size: 2.5rem;
        margin: 10px 0;
        text-transform: uppercase;
        letter-spacing: -2px;
    }
}

.exp-line-container {
    width: 100%;
    height: 2px;
    background: #333;
    margin: 10px 0;
    position: relative;
    
    .exp-line-fill {
        height: 100%;
        background: #00ffcc;
        box-shadow: 0 0 10px #00ffcc;
        transition: width 0.3s;
    }
}

.exp-text {
    font-size: 0.8rem;
    color: #666;
    text-align: right;
}

.hud-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.radar-container {
    width: 200px;
    height: 200px;
    position: relative;
}

.radar-svg {
    width: 100%;
    height: 100%;
    
    .radar-bg-grid {
        fill: none;
        stroke: #333;
        stroke-width: 0.5;
    }
    .inner {
        stroke: #222;
        stroke-dasharray: 2 2;
    }
    .axis-line {
        stroke: #222;
        stroke-width: 0.5;
    }
    .radar-shape {
        fill: rgba(0, 255, 204, 0.2);
        stroke: #00ffcc;
        stroke-width: 1;
        filter: drop-shadow(0 0 5px rgba(0, 255, 204, 0.5));
        transition: points 0.5s ease;
    }
}

.stat-label {
    position: absolute;
    font-size: 0.6rem;
    color: #666;
    text-transform: uppercase;
    
    &.top { top: 0; left: 50%; transform: translateX(-50%); }
    &.right-top { top: 25%; right: 0; }
    &.right-bot { bottom: 20%; right: 0; }
    &.left-bot { bottom: 20%; left: 0; }
    &.left-top { top: 25%; left: 0; }
}

.hud-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.system-status {
    border: 1px solid #333;
    padding: 20px;
    min-width: 200px;
    font-size: 0.8rem;
    background: rgba(0,0,0,0.5);
    
    .status-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #888;
        
        .status-ok { color: #00ffcc; }
    }
}

.mini-badge {
    border: 1px solid #fff;
    padding: 5px;
    text-align: center;
    margin-top: 5px;
    
    &.locked { border-color: #333; color: #333; }
}

/* --- BENTO GRID --- */
.training-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 20px;
}

.grid-card {
    background: #111;
    border: 1px solid #333;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px;
    
    &:hover:not(.locked) {
        border-color: #fff;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        
        .module-icon { transform: scale(1.1); }
    }
    
    &.locked {
        cursor: not-allowed;
        opacity: 0.5;
        
        .lock-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
            color: #888;
            font-size: 0.8rem;
            text-align: center;
        }
    }
}

/* Spans */
.card-2x2 { grid-column: span 2; grid-row: span 2; }
.card-2x1 { grid-column: span 2; grid-row: span 1; }
.card-1x2 { grid-column: span 1; grid-row: span 2; }
.card-1x1 { grid-column: span 1; grid-row: span 1; }

.module-icon {
    font-size: 2rem;
    margin-bottom: 16px;
    transition: transform 0.3s;
}

.module-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    line-height: 1.2;
}

.module-title-sm {
    font-size: 1rem;
    margin: 0;
    color: #888;
}

.module-desc {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.start-btn {
    align-self: flex-start;
    background: #fff;
    color: #000;
    border: none;
    padding: 10px 20px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    
    &:hover {
        background: #00ffcc;
    }
}

/* Specific Card Styles */
.eye-module {
    .card-bg {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500') center/cover;
        opacity: 0.2;
        transition: opacity 0.3s;
    }
    &:hover .card-bg { opacity: 0.4; }
    .card-content { position: relative; z-index: 1; }
}

.material-module {
    background: linear-gradient(45deg, #111 0%, #1a1a1a 100%);
}

.daily-module {
    border-color: #00ffcc;
    align-items: center;
    text-align: center;
    
    .daily-tag {
        background: #00ffcc;
        color: #000;
        padding: 4px 8px;
        font-size: 0.7rem;
        font-weight: 800;
        margin-bottom: 20px;
    }
    
    .timer {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 20px;
        font-variant-numeric: tabular-nums;
    }
    
    .vertical-text {
        text-orientation: mixed;
        writing-mode: vertical-rl;
        margin: 0;
    }
}

/* --- MODAL --- */
.module-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.module-modal-content {
    background: #0a0a0a;
    width: 100%;
    height: 100%;
    max-width: none;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.close-modal-btn {
    position: absolute;
    top: 30px;
    right: 30px;
    background: transparent;
    border: 1px solid #333;
    color: #666;
    padding: 10px 20px;
    cursor: pointer;
    font-family: inherit;
    
    &:hover { border-color: #fff; color: #fff; }
}

@media (max-width: 1024px) {
    .training-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .hud-panel {
        grid-template-columns: 1fr;
        gap: 40px;
    }
}

@media (max-width: 600px) {
    .training-grid {
        grid-template-columns: 1fr;
    }
    .card-2x2, .card-2x1, .card-1x2, .card-1x1 {
        grid-column: span 1;
        grid-row: span 1;
    }
}
</style>
