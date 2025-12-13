<template>
  <div class="puzzle-game">
      <!-- STATE: START SCREEN -->
      <div v-if="gameState === 'START'" class="start-screen">
          <h1 class="game-title">构造重组</h1>
          <p class="game-subtitle">选择挑战难度</p>
          
          <div class="difficulty-options">
              <button class="diff-btn" @click="startGame(3)">
                  <span class="level">LV.1</span>
                  <span class="label">直觉 (3x3)</span>
              </button>
              <button class="diff-btn" @click="startGame(4)">
                  <span class="level">LV.2</span>
                  <span class="label">逻辑 (4x4)</span>
              </button>
              <button class="diff-btn" @click="startGame(5)">
                  <span class="level">LV.3</span>
                  <span class="label">精通 (5x5)</span>
              </button>
          </div>

          <button class="close-btn-lg" @click="$emit('close')">返回档案库</button>
      </div>

      <!-- STATE: PLAYING -->
      <div v-else-if="gameState === 'PLAYING'" class="game-container">
          <!-- HEADER -->
          <div class="game-header">
              <div class="header-info">
                  <span class="info-label">目标:</span>
                  <span class="info-value">{{ selectedPuzzle?.name }}</span>
              </div>
              <div class="header-timer">{{ formattedTime }}</div>
              <button class="abort-btn" @click="resetGame">放弃</button>
          </div>

          <!-- BOARD -->
          <div class="game-board-wrapper">
            <div class="game-board" :style="boardStyle">
                <div 
                  v-for="(tile, index) in tiles" 
                  :key="tile.id"
                  class="puzzle-tile"
                  :class="{ 'correct': tile.currentPos === tile.correctPos, 'dragging': draggedIndex === index }"
                  :draggable="true"
                  @dragstart="handleDragStart($event, index)"
                  @dragover.prevent
                  @drop="handleDrop($event, index)"
                  :style="getTileStyle(tile)"
                >
                  <div class="tile-number">{{ tile.currentPos + 1 }}</div>
                </div>
            </div>
          </div>
      </div>

      <!-- STATE: WON -->
      <div v-if="gameState === 'WON'" class="win-overlay">
          <div class="win-content">
              <div class="restored-image" :style="{ backgroundImage: `url(${selectedPuzzle?.image})` }"></div>
              
              <div class="win-details">
                  <h2 class="win-title">蓝图复原</h2>
                  <div class="detail-row">
                      <span class="label">建筑师</span>
                      <span class="value">{{ selectedPuzzle?.architect }}</span>
                  </div>
                  <div class="detail-row">
                      <span class="label">建筑名</span>
                      <span class="value">{{ selectedPuzzle?.name }}</span>
                  </div>
                  <div class="detail-row">
                      <span class="label">年代</span>
                      <span class="value">{{ selectedPuzzle?.year }}</span>
                  </div>
                  
                  <div class="stat-box">
                      <div class="stat">耗时: {{ formattedTime }}</div>
                      <div class="stat">经验: +{{ xpReward }}</div>
                  </div>
              </div>

              <button class="claim-btn" @click="claimReward">归档数据并退出</button>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { message } from 'ant-design-vue'

const emit = defineEmits(['close'])
const gameStore = useGameStore()

// --- DATA SOURCES ---
interface PuzzleSource {
    id: number;
    name: string;
    architect: string;
    year: string;
    image: string;
}

const puzzleSources: PuzzleSource[] = [
    { 
        id: 1, 
        name: '伊势神宫 (内宫)', 
        architect: '宫大工', 
        year: '上古', 
        image: new URL('@/assets/images/Naiku_04.jpg', import.meta.url).href 
    },
    { 
        id: 2, 
        name: '银阁寺', 
        architect: '足利义政', 
        year: '1482年', 
        image: new URL('@/assets/images/Ginkaku-ji-Temple.jpg', import.meta.url).href 
    },
    { 
        id: 3, 
        name: '鬼门 (表鬼门)', 
        architect: '传统样式', 
        year: '江户时代', 
        image: new URL('@/assets/images/5804_01.jpg', import.meta.url).href 
    },
    { 
        id: 4, 
        name: '现代都市', 
        architect: '城市集合体', 
        year: '2025年', 
        image: new URL('@/assets/images/tokyo_dark_map.png', import.meta.url).href 
    }
]

// --- GAME STATE ---
type GameState = 'START' | 'PLAYING' | 'WON'
const gameState = ref<GameState>('START')
const selectedPuzzle = ref<PuzzleSource | null>(null)
const difficulty = ref(3)
const tiles = ref<any[]>([])
const boardSize = 500

// --- TIMER ---
const startTime = ref(0)
const currentTime = ref(0)
const timerInterval = ref<any>(null)

// --- DRAG STATE ---
const draggedIndex = ref<number | null>(null)

// --- ACTIONS ---

const startGame = (level: number) => {
    difficulty.value = level
    // Select random puzzle
    const randomIndex = Math.floor(Math.random() * puzzleSources.length)
    selectedPuzzle.value = puzzleSources[randomIndex]
    
    initBoard()
    gameState.value = 'PLAYING'
    startTimer()
}

const initBoard = () => {
    const totalTiles = difficulty.value * difficulty.value
    const tempTiles = []

    for (let i = 0; i < totalTiles; i++) {
        tempTiles.push({
            id: i,
            correctPos: i,
            currentPos: i 
        })
    }
    
    // Custom Shuffle Logic (Fisher-Yates) on the array itself
    tiles.value = shuffleArray(tempTiles)
}

const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const resetGame = () => {
    clearInterval(timerInterval.value)
    gameState.value = 'START'
    selectedPuzzle.value = null
}

// --- LOGIC ---

const boardStyle = computed(() => ({
    width: `${boardSize}px`,
    height: `${boardSize}px`,
    gridTemplateColumns: `repeat(${difficulty.value}, 1fr)`,
    gridTemplateRows: `repeat(${difficulty.value}, 1fr)`
}))

const getTileStyle = (tile: any) => {
    if (!selectedPuzzle.value) return {}
    
    const tileSize = boardSize / difficulty.value
    const row = Math.floor(tile.correctPos / difficulty.value)
    const col = tile.correctPos % difficulty.value
    
    return {
        backgroundImage: `url(${selectedPuzzle.value.image})`,
        backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
        backgroundSize: `${boardSize}px ${boardSize}px`,
        width: `${tileSize}px`,
        height: `${tileSize}px`
    }
}

// --- DRAG & DROP ---

const handleDragStart = (e: DragEvent, index: number) => {
    draggedIndex.value = index
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
    }
}

const handleDrop = (e: DragEvent, dropIndex: number) => {
    if (draggedIndex.value === null) return
    
    // Swap tiles in array
    const temp = tiles.value[draggedIndex.value]
    tiles.value[draggedIndex.value] = tiles.value[dropIndex]
    tiles.value[dropIndex] = temp
    
    draggedIndex.value = null
    checkWin()
}

const checkWin = () => {
    // Win if confirmed every tile is at the index matching its correctPos
    const isWin = tiles.value.every((tile, index) => tile.correctPos === index)
    if (isWin) {
        clearInterval(timerInterval.value)
        gameState.value = 'WON'
    }
}

// --- REWARDS ---

const xpReward = computed(() => difficulty.value * 50)

const claimReward = () => {
    gameStore.completeModule('structure_puzzle', xpReward.value)
    // Unlock basic badge if hard mode
    if (difficulty.value >= 5) {
        gameStore.unlockBadge('structure_master') 
    }
    
    message.success({
        content: `已归档 // +${xpReward.value} 经验`,
        class: 'brutalist-message'
    })
    emit('close')
}

// --- TIMER UTIL ---

const startTimer = () => {
    startTime.value = Date.now()
    timerInterval.value = setInterval(() => {
        currentTime.value = Date.now() - startTime.value
    }, 100)
}

const formattedTime = computed(() => {
    const totalSeconds = Math.floor(currentTime.value / 1000)
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    const ms = Math.floor((currentTime.value % 1000) / 10).toString().padStart(2, '0')
    return `${m}:${s}:${ms}`
})

onUnmounted(() => {
    clearInterval(timerInterval.value)
})

</script>

<style scoped lang="scss">
/* REMOVED BROKEN IMPORT */

.puzzle-game {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    overflow: hidden;
}

/* START SCREEN */
.start-screen {
    text-align: center;
    animation: fadeIn 0.5s ease-out;
}

.game-title {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -2px;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #fff, #666);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.game-subtitle {
    color: #666;
    margin-bottom: 3rem;
    letter-spacing: 2px;
}

.difficulty-options {
    display: flex;
    gap: 20px;
    margin-bottom: 4rem;
}

.diff-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    background: #111;
    border: 1px solid #333;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
        background: #00ffcc;
        color: #000;
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 255, 204, 0.2);
        
        .level { color: #000; }
    }

    .level {
        font-size: 3rem;
        font-weight: 800;
        color: #333;
        margin-bottom: 1rem;
        transition: color 0.3s;
    }

    .label {
        font-size: 0.8rem;
        letter-spacing: 1px;
    }
}

.close-btn-lg {
    background: transparent;
    border: 1px solid #ff4d4f;
    color: #ff4d4f;
    padding: 1rem 3rem;
    cursor: pointer;
    font-family: inherit;
    font-weight: 700;
    transition: all 0.3s;

    &:hover {
        background: #ff4d4f;
        color: #000;
    }
}

/* GAMEPLAY */
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: zoomIn 0.4s;
}

.game-header {
    width: 500px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
}

.info-label {
    color: #666;
    margin-right: 10px;
    font-size: 0.8rem;
}

.info-value {
    color: #00ffcc;
    font-weight: 700;
}

.header-timer {
    font-variant-numeric: tabular-nums;
    font-size: 1.2rem;
    font-weight: 300;
}

.abort-btn {
    background: transparent;
    border: none;
    color: #444;
    cursor: pointer;
    padding: 5px;
    &:hover { color: #ff4d4f; }
}

.game-board-wrapper {
    padding: 10px;
    border: 1px solid #333;
    background: #050505;
}

.game-board {
    display: grid;
    /* Dimensions & grid set by inline style */
    background: #111;
}

.puzzle-tile {
    /* Dimensions set by inline style */
    position: relative;
    cursor: grab;
    transition: transform 0.2s, z-index 0s;
    box-sizing: border-box;

    border: 1px solid rgba(0,0,0,0.8); /* Slight grid line */

    &.dragging {
        opacity: 0.5;
        z-index: 100;
    }

    &:hover {
        z-index: 10;
        transform: scale(0.96);
        box-shadow: 0 0 15px rgba(0, 255, 204, 0.4);
        border: 1px solid #00ffcc;
    }
    
    &.correct {
        border: none;
        /* Optional: visuals for correct placement? */
    }
}

.tile-number {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 10px;
    color: rgba(255,255,255,0.3);
    pointer-events: none;
}

/* WIN OVERLAY */
.win-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    animation: fadeIn 0.8s;
}

.win-content {
    display: flex;
    background: #050505;
    border: 1px solid #333;
    padding: 0;
    box-shadow: 0 0 50px rgba(0, 255, 204, 0.1);
}

.restored-image {
    width: 300px;
    height: 400px; /* Portrait aspect generic */
    background-size: cover;
    background-position: center;
    border-right: 1px solid #333;
}

.win-details {
    width: 300px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.win-title {
    color: #00ffcc;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.2;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #222;
    padding: 10px 0;
    margin-bottom: 5px;
}

.stat-box {
    margin-top: 2rem;
    background: #111;
    padding: 15px;
    display: flex;
    justify-content: space-between;
}

.stat {
    color: #888;
    font-size: 0.9rem;
}

.claim-btn {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    
    background: #00ffcc;
    color: #000;
    border: none;
    padding: 15px 40px;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,255,204,0.3);
    transition: all 0.3s;

    &:hover {
        background: #fff;
        transform: translateX(-50%) translateY(-2px);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes zoomIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
</style>
