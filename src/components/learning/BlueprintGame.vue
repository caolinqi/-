<template>
  <div class="blueprint-game">
    <div class="game-header">
      <h2>{{ t('learning.modulesList.blueprint.title') }}</h2>
      <div v-if="!gameComplete" class="round-counter">ROUND {{ currentRound }} / {{ TOTAL_ROUNDS }}</div>
    </div>

    <div class="game-body" v-if="!gameComplete">
      
      <div class="blueprint-viewer">
          <div class="bp-grid"></div>
          <div class="bp-img" :style="{ backgroundImage: `url(${currentQuestion?.image})` }"></div>
          <div class="scan-line"></div>
      </div>

      <div class="options-grid">
          <button 
            v-for="opt in options" 
            :key="opt.id" 
            class="opt-btn"
            @click="checkAnswer(opt.id)"
            :class="{ error: isError && selectedId === opt.id, correct: isCorrect && selectedId === opt.id }"
          >
              <span class="code">BP-{{ opt.id }}</span>
              {{ locale === 'zh-CN' ? opt.name : opt.name }}
          </button>
      </div>

    </div>

    <div class="game-complete" v-else>
      <div class="result-icon">📐</div>
      <h3>{{ t('quiz.complete') }}</h3>
      <p>XP +{{ score }}</p>
      <button class="replay-btn" @click="startRound">{{ t('quiz.playAgain') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useGameStore } from '@/stores/useGameStore'
import { useI18n } from 'vue-i18n'
import type { Building } from '@/types'

const { t, locale } = useI18n()
const store = useBuildingStore()
const gameStore = useGameStore()

const currentQuestion = ref<Building | null>(null)
const options = ref<Building[]>([])
const gameComplete = ref(false)
const score = ref(0)
const selectedId = ref<number | null>(null)
const isError = ref(false)
const isCorrect = ref(false)
const currentRound = ref(1)
const TOTAL_ROUNDS = 5

const startRound = () => {
    gameComplete.value = false
    score.value = 0
    currentRound.value = 1
    nextQuestion()
}

const nextQuestion = () => {
    isError.value = false
    isCorrect.value = false
    selectedId.value = null
    
    const all = store.buildings
    if(all.length < 4) return

    // Pick target
    const target = all[Math.floor(Math.random() * all.length)]
    currentQuestion.value = target

    // Pick distractors
    const pool = all.filter(b => b.id !== target.id)
    const dists = []
    for(let i=0; i<3; i++) dists.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
    
    // Shuffle options
    options.value = [...dists, target].sort(() => Math.random() - 0.5)
}

const checkAnswer = (id: number) => {
    if (isCorrect.value || isError.value) return // Prevent double click

    selectedId.value = id
    if (id === currentQuestion.value?.id) {
        isCorrect.value = true
        score.value += 300
        
        setTimeout(() => {
            if (currentRound.value < TOTAL_ROUNDS) {
                currentRound.value++
                nextQuestion()
            } else {
                gameComplete.value = true
                gameStore.gainExp(score.value) // Award total score at end
            }
        }, 1000)
    } else {
        isError.value = true
        setTimeout(() => {
            isError.value = false
            selectedId.value = null
        }, 800)
    }
}

onMounted(() => {
    startRound()
})
</script>

<style scoped lang="scss">
.blueprint-game {
    height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #fff; font-family: 'JetBrains Mono';
}
.game-header { margin-bottom: 20px; text-align: center; }
.round-counter { font-size: 0.8rem; letter-spacing: 2px; color: #00ffcc; margin-top: 5px; font-weight: bold; }

.blueprint-viewer {
    width: 400px; height: 300px; background: #003366; 
    border: 2px solid #fff; position: relative; overflow: hidden;
    margin-bottom: 30px;
    
    .bp-grid {
        position: absolute; inset: 0; 
        background-image: linear-gradient(#ffffff20 1px, transparent 1px), linear-gradient(90deg, #ffffff20 1px, transparent 1px);
        background-size: 20px 20px; z-index: 1;
    }
    
    .bp-img {
        width: 100%; height: 100%; background-size: cover; background-position: center;
        filter: grayscale(100%) invert(1) contrast(1.5) brightness(1.2); /* Blueprint Effect */
        opacity: 0.9;
    }

    .scan-line {
        position: absolute; top:0; left:0; width: 100%; height: 2px; background: #fff;
        box-shadow: 0 0 10px #fff;
        animation: scan 3s linear infinite; z-index: 2;
    }
}

.options-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 500px;
}

.opt-btn {
    background: #111; border: 1px solid #333; color: #aaa; padding: 15px;
    text-align: left; cursor: pointer; transition: 0.2s;
    font-family: 'JetBrains Mono';
    &:hover { border-color: #fff; color: #fff; }
    &.correct { background: #00ff00; color: #000; border-color: #00ff00; }
    &.error { background: #ff0000; color: #fff; border-color: #ff0000; animation: shake 0.4s; }
    
    .code { display: block; font-size: 0.7rem; color: #555; }
}

.replay-btn {
    padding: 15px 40px; background: #fff; color: #000; border: none; 
    font-weight: 900; cursor: pointer; margin-top: 20px;
}
.game-complete { text-align: center; .result-icon { font-size: 4rem; } }

@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
