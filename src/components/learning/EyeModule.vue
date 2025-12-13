<template>
  <div class="eye-module">
    
    <!-- STATE: START SCREEN -->
    <div v-if="gameState === 'START'" class="start-screen">
      <div class="hud-circle"></div>
      <h2 class="module-title">视觉识别特训</h2>
      <div class="scan-line"></div>
      <p class="module-desc">通过碎片化视觉数据，快速识别目标建筑与关联建筑师。</p>
      <div class="stat-row">
        <span>目标数量:</span>
        <span class="highlight">5</span>
      </div>
      <div class="stat-row">
        <span>时间限制:</span>
        <span class="highlight">10秒 / 图</span>
      </div>
      
      <button class="action-btn glitch-btn" @click="startGame">
        [ 启动扫描 ]
      </button>
    </div>

    <!-- STATE: GAMEPLAY -->
    <div v-else-if="gameState === 'PLAYING'" class="game-interface">
      <!-- HUD HEADER -->
      <div class="hud-header">
        <div class="target-counter">目标: {{ currentIndex + 1 }} / {{ totalQuestions }}</div>
        <div class="timer-bar">
          <div class="timer-fill" :style="{ width: (timeLeft / 10) * 100 + '%' }"></div>
        </div>
        <div class="score-display">命中: {{ score }}</div>
      </div>

      <!-- MAIN VISUAL AREA -->
      <div class="visual-container">
        <div class="crosshair tl"></div>
        <div class="crosshair tr"></div>
        <div class="crosshair bl"></div>
        <div class="crosshair br"></div>
        
        <div class="scan-overlay"></div>
        
        <!-- IMAGE -->
        <div 
          v-if="currentQuestion"
          class="target-image"
          :style="{ backgroundImage: `url(${currentQuestion.imageUrl})` }"
        ></div>

        <!-- FEEDBACK OVERLAY -->
        <div v-if="showFeedback" class="feedback-overlay" :class="isLastCorrect ? 'correct' : 'wrong'">
            <div class="feedback-text">{{ isLastCorrect ? '匹配确认 (MATCH)' : '匹配失败 (MISMATCH)' }}</div>
        </div>
      </div>

      <!-- QUESTION & OPTIONS -->
      <div class="interaction-area" v-if="currentQuestion">
        <h3 class="question-text">{{ currentQuestion.questionText }}</h3>
        
        <div class="options-grid">
          <button 
            v-for="opt in currentQuestion.options" 
            :key="opt.id"
            class="option-btn"
            :class="{ 
                'correct': showFeedback && opt.isCorrect,
                'wrong': showFeedback && selectedOptionId === opt.id && !opt.isCorrect,
                'dimmed': showFeedback && !opt.isCorrect
            }"
            :disabled="showFeedback"
            @click="handleAnswer(opt)"
          >
            <span class="opt-marker">>></span> {{ opt.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- STATE: REPORT (END) -->
    <div v-else class="report-screen">
      <h2 class="module-title">扫描完成</h2>
      
      <div class="report-card">
        <div class="report-row">
          <span>准确率:</span>
          <span class="val">{{ Math.round((score / totalQuestions) * 100) }}%</span>
        </div>
        <div class="report-row">
          <span>评级:</span>
          <span class="val" :class="ratingClass">{{ ratingText }}</span>
        </div>
        <div class="report-row">
          <span>奖励:</span>
          <span class="val highlight">+{{ xpReward }} 经验</span>
        </div>
      </div>

      <button class="action-btn" @click="closeModule">
        [ 归档数据 ]
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { architects } from '@/data/architects'
import { buildings } from '@/data/buildings' 
import { useGameStore } from '@/stores/useGameStore'
import { message } from 'ant-design-vue'

const emit = defineEmits(['close'])
const gameStore = useGameStore()

// --- TYPES ---
type GameState = 'START' | 'PLAYING' | 'END'
type QuestionType = 'WHO_ARCHITECT' | 'WHAT_BUILDING' | 'WHO_BUILT_THIS'

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    imageUrl: string;
    questionText: string;
    options: Option[];
}

// --- STATE ---
const gameState = ref<GameState>('START')
const currentIndex = ref(0)
const score = ref(0)
const timeLeft = ref(10)
const showFeedback = ref(false)
const isLastCorrect = ref(false)
const selectedOptionId = ref<string | null>(null)
const timerInterval = ref<any>(null)

const questions = ref<Question[]>([])
const totalQuestions = 5

// --- GAME LOGIC ---

const startGame = () => {
    try {
        generateQuestions()
        gameState.value = 'PLAYING'
        currentIndex.value = 0
        score.value = 0
        startTurn()
    } catch (e) {
        console.error("Failed to start game:", e)
        message.error("初始化视觉数据失败，请检查控制台")
    }
}

const generateQuestions = () => {
    const newQuestions: Question[] = []
    
    // Safety check
    if (!architects.length && !buildings.length) {
        throw new Error("No data available")
    }

    for (let i = 0; i < totalQuestions; i++) {
        // Randomly pick a question type
        // 0: Identify Architect (from Architect Image)
        // 1: Identify Building (from Building Image)
        // 2: Identify Architect (from Building Image)
        const typeRoll = Math.random()
        
        let q: Question | null = null

        if (typeRoll < 0.3) {
            q = createArchitectIdentityQuestion(i)
        } else if (typeRoll < 0.6) {
            q = createBuildingIdentityQuestion(i)
        } else {
            q = createBuildingToArchitectQuestion(i)
        }

        if (q) newQuestions.push(q)
    }

    questions.value = newQuestions
}

// TYPE 1: Show Architect Image -> Who is this?
const createArchitectIdentityQuestion = (id: number): Question => {
    // Filter architects with valid images
    const validArchitects = architects.filter(a => a.image && a.image.length > 5)
    if (validArchitects.length === 0) return createBuildingIdentityQuestion(id) // Fallback

    const target = validArchitects[Math.floor(Math.random() * validArchitects.length)]
    
    // Distractors
    const others = architects
        .filter(a => a.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    
    const options = [
        { id: 'A', text: target.name, isCorrect: true },
        ...others.map((a, idx) => ({ id: String(idx), text: a.name, isCorrect: false }))
    ].sort(() => 0.5 - Math.random())

    return {
        id,
        imageUrl: target.image,
        questionText: "识别目标建筑师", // Identify Target Architect
        options
    }
}

// TYPE 2: Show Building Image -> What building is this?
const createBuildingIdentityQuestion = (id: number): Question => {
    const validBuildings = buildings.filter(b => b.image && b.image.length > 5)
    if (validBuildings.length === 0) return createArchitectIdentityQuestion(id) // Fallback

    const target = validBuildings[Math.floor(Math.random() * validBuildings.length)]
    
    const others = buildings
        .filter(b => b.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    
    const options = [
        { id: 'A', text: target.name, isCorrect: true },
        ...others.map((b, idx) => ({ id: String(idx), text: b.name, isCorrect: false }))
    ].sort(() => 0.5 - Math.random())

    return {
        id,
        imageUrl: target.image,
        questionText: "识别目标建筑结构", // Identify Structure
        options
    }
}

// TYPE 3: Show Building Image -> Who built this?
const createBuildingToArchitectQuestion = (id: number): Question => {
    const validBuildings = buildings.filter(b => b.image && b.image.length > 5 && b.architect)
    if (validBuildings.length === 0) return createArchitectIdentityQuestion(id)

    const target = validBuildings[Math.floor(Math.random() * validBuildings.length)]
    const targetArchitectName = target.architect || "Unknown"

    // Distractors: Random other architects
    const others = architects
        .filter(a => a.name !== targetArchitectName)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    
    // Fallback if not enough architects
    while (others.length < 3) {
        others.push({ name: "未知建筑师" } as any)
    }

    const options = [
        { id: 'A', text: targetArchitectName, isCorrect: true },
        ...others.map((a, idx) => ({ id: String(idx), text: a.name, isCorrect: false }))
    ].sort(() => 0.5 - Math.random())

    return {
        id,
        imageUrl: target.image,
        questionText: "识别该建筑的设计者", // Identify Creator
        options
    }
}


const currentQuestion = computed(() => questions.value[currentIndex.value])

const startTurn = () => {
    timeLeft.value = 10
    showFeedback.value = false
    selectedOptionId.value = null
    
    clearInterval(timerInterval.value)
    
    timerInterval.value = setInterval(() => {
        timeLeft.value -= 0.1
        if (timeLeft.value <= 0) {
            handleTimeout()
        }
    }, 100)
}

const handleTimeout = () => {
    clearInterval(timerInterval.value)
    isLastCorrect.value = false
    showFeedback.value = true
    setTimeout(nextQuestion, 1500)
}

const handleAnswer = (opt: Option) => {
    if (showFeedback.value) return
    clearInterval(timerInterval.value)
    
    selectedOptionId.value = opt.id
    isLastCorrect.value = opt.isCorrect
    
    if (opt.isCorrect) {
        score.value++
    }
    
    showFeedback.value = true
    setTimeout(nextQuestion, 1000)
}

const nextQuestion = () => {
    if (currentIndex.value < totalQuestions - 1) {
        currentIndex.value++
        startTurn()
    } else {
        endGame()
    }
}

const endGame = () => {
    gameState.value = 'END'
}

// --- REPORT & REWARDS ---

const xpReward = computed(() => {
    let xp = score.value * 20
    if (score.value === totalQuestions) xp += 50
    return xp
})

const ratingText = computed(() => {
    const ratio = score.value / totalQuestions
    if (ratio === 1) return 'S (完美)'
    if (ratio >= 0.8) return 'A (优秀)'
    if (ratio >= 0.6) return 'B (合格)'
    return 'D (失败)'
})

const ratingClass = computed(() => {
    const ratio = score.value / totalQuestions
    if (ratio >= 0.8) return 'rating-s'
    if (ratio >= 0.6) return 'rating-a'
    return 'rating-d'
})

const closeModule = () => {
    if (xpReward.value > 0) {
        gameStore.gainExp(xpReward.value)
        gameStore.completeModule('eye_training', xpReward.value)
        message.success({
            content: `数据已归档 // +${xpReward.value} 经验`,
            class: 'brutalist-message'
        })
    }
    emit('close')
}

onUnmounted(() => {
    clearInterval(timerInterval.value)
})

</script>

<style scoped lang="scss">
.eye-module {
    width: 100%;
    height: 100%;
    background: #000;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* --- START SCREEN --- */
.start-screen {
    text-align: center;
    position: relative;
    z-index: 10;
}

.hud-circle {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: spin 20s linear infinite;
    z-index: -1;
}

.module-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    letter-spacing: -1px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.scan-line {
    width: 100%;
    height: 1px;
    background: #00ffcc;
    margin: 20px 0;
    box-shadow: 0 0 10px #00ffcc;
}

.module-desc {
    color: #888;
    margin-bottom: 3rem;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto 10px;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
    
    .highlight { color: #00ffcc; font-weight: 700; }
}

.action-btn {
    margin-top: 40px;
    background: transparent;
    border: 1px solid #00ffcc;
    color: #00ffcc;
    padding: 15px 40px;
    font-size: 1.2rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background: #00ffcc;
        color: #000;
        box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
    }
}

/* --- GAMEPLAY --- */
.game-interface {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.hud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: #888;
}

.timer-bar {
    flex: 1;
    height: 4px;
    background: #222;
    margin: 0 20px;
    position: relative;
    
    .timer-fill {
        height: 100%;
        background: #00ffcc;
        transition: width 0.1s linear;
        box-shadow: 0 0 5px #00ffcc;
    }
}

.visual-container {
    flex: 1;
    position: relative;
    border: 1px solid #333;
    background: #111;
    overflow: hidden;
    margin-bottom: 20px;
    
    /* Crosshairs */
    .crosshair {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #00ffcc;
        opacity: 0.5;
        z-index: 5;
        
        &.tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        &.tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        &.bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        &.br { bottom: 10px; right: 10px; border-left: none; border-top: none; }
    }
}

.target-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: grayscale(100%) contrast(1.2); /* Brutalist look */
}

.scan-overlay {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.1),
        rgba(0,0,0,0.1) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    z-index: 2;
}

.feedback-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.8);
    z-index: 10;
    backdrop-filter: blur(5px);
    
    .feedback-text {
        font-size: 2rem;
        font-weight: 800;
        padding: 20px 40px;
        border: 2px solid;
    }
    
    &.correct .feedback-text { border-color: #00ffcc; color: #00ffcc; box-shadow: 0 0 30px rgba(0,255,204,0.3); }
    &.wrong .feedback-text { border-color: #ff4d4f; color: #ff4d4f; box-shadow: 0 0 30px rgba(255,77,79,0.3); }
}

.interaction-area {
    min-height: 200px;
}

.question-text {
    font-size: 1.2rem;
    color: #fff;
    margin-bottom: 20px;
    text-align: center;
    border-left: 4px solid #00ffcc;
    padding-left: 15px;
    background: linear-gradient(90deg, #111 0%, transparent 100%);
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.option-btn {
    background: #111;
    border: 1px solid #333;
    color: #ccc;
    padding: 15px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    font-size: 0.9rem;
    
    &:hover:not(:disabled) {
        border-color: #fff;
        background: #222;
        color: #fff;
    }
    
    &.correct { border-color: #00ffcc; color: #00ffcc; background: rgba(0,255,204,0.1); }
    &.wrong { border-color: #ff4d4f; color: #ff4d4f; background: rgba(255,77,79,0.1); }
    &.dimmed { opacity: 0.3; }
}

/* --- REPORT --- */
.report-screen {
    text-align: center;
    animation: fadeIn 0.5s;
}

.report-card {
    background: #111;
    border: 1px solid #333;
    padding: 40px;
    min-width: 300px;
    margin-bottom: 40px;
}

.report-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 1.1rem;
    border-bottom: 1px solid #222;
    padding-bottom: 10px;
    
    .val { font-weight: 700; color: #fff; }
    .rating-s { color: #fabb18; text-shadow: 0 0 10px #fabb18; }
    .rating-a { color: #00ffcc; }
    .rating-d { color: #ff4d4f; }
}

@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

</style>
