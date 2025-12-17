<template>
  <div class="chrono-game">
    <div class="game-header">
      <h2>{{ t('learning.modulesList.chrono.title') }}</h2>
      <p class="subtitle">{{ t('learning.modulesList.chrono.desc') }}</p>
    </div>

    <div class="game-body" v-if="!gameComplete">
      <div class="timeline-container">
        <div 
          v-for="(item, index) in shuffledItems" 
          :key="item.id"
          class="timeline-card"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
          :class="{ 'dragging': draggedIndex === index }"
        >
          <div class="card-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <div class="card-info">
            <span class="name">{{ locale === 'zh-CN' ? item.name : item.name }}</span>
            <span class="year-placeholder">????</span>
          </div>
        </div>
      </div>

      <button class="check-btn" @click="checkOrder">{{ t('quiz.submit') }}</button>
      <p v-if="message" class="feedback" :class="{ error: isError }">{{ message }}</p>
    </div>

    <div class="game-complete" v-else>
      <div class="result-icon">🎉</div>
      <h3>{{ t('quiz.congratulations') }}</h3>
      <p>XP +500</p>
      <button class="replay-btn" @click="resetGame">{{ t('quiz.playAgain') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useGameStore } from '@/stores/useGameStore'
import { useI18n } from 'vue-i18n'
import type { Building } from '@/types'

const { t, locale } = useI18n()
const buildingStore = useBuildingStore()
const gameStore = useGameStore()
const emit = defineEmits(['close'])

const draggedIndex = ref<number | null>(null)
const shuffledItems = ref<Building[]>([])
const gameComplete = ref(false)
const message = ref('')
const isError = ref(false)

const resetGame = () => {
    // Pick 5 random buildings
    const all = [...buildingStore.buildings].filter(b => b.year > 0)
    const selection = []
    for(let i=0; i<4; i++) {
        if(!all.length) break
        const r = Math.floor(Math.random() * all.length)
        selection.push(all.splice(r, 1)[0])
    }
    shuffledItems.value = selection
    gameComplete.value = false
    message.value = ''
    isError.value = false
}

const dragStart = (index: number) => {
    draggedIndex.value = index
}

const drop = (index: number) => {
    if (draggedIndex.value === null) return
    const item = shuffledItems.value.splice(draggedIndex.value, 1)[0]
    shuffledItems.value.splice(index, 0, item)
    draggedIndex.value = null
}

const checkOrder = () => {
    let correct = true
    for (let i = 0; i < shuffledItems.value.length - 1; i++) {
        if (shuffledItems.value[i].year > shuffledItems.value[i+1].year) {
            correct = false
            break
        }
    }

    if (correct) {
        message.value = t('quiz.correct')
        isError.value = false
        setTimeout(() => {
            gameComplete.value = true
            gameStore.gainExp(500)
        }, 1000)
    } else {
        message.value = t('quiz.incorrect')
        isError.value = true
    }
}

onMounted(() => {
    resetGame()
})
</script>

<style scoped lang="scss">
.chrono-game {
    height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #fff; font-family: 'JetBrains Mono';
}
.game-header { text-align: center; margin-bottom: 40px; }
.timeline-container { 
    display: flex; gap: 20px; padding: 20px; overflow-x: auto; 
    border: 1px dashed #333; border-radius: 10px; margin-bottom: 30px;
}
.timeline-card {
    width: 160px; background: #111; border: 1px solid #333; cursor: grab; user-select: none;
    transition: transform 0.2s;
    &.dragging { opacity: 0.5; transform: scale(0.9); }
    &:active { cursor: grabbing; }
    
    .card-img { height: 100px; background-size: cover; filter: grayscale(1); }
    .card-info { padding: 10px; font-size: 0.8rem; text-align: center; }
    .year-placeholder { display: block; color: #666; font-weight: bold; margin-top: 5px; }
}

.check-btn, .replay-btn {
    padding: 15px 40px; background: #00ffcc; color: #000; border: none; 
    font-weight: 900; cursor: pointer; font-family: 'JetBrains Mono';
    &:hover { box-shadow: 0 0 20px #00ffcc; }
}

.feedback { margin-top: 20px; font-weight: bold; color: #00ffcc; &.error { color: #ff3333; } }
.game-complete { text-align: center; .result-icon { font-size: 5rem; margin-bottom: 20px; } }
</style>
