<template>
  <div class="puzzle-module">
    <!-- INTRO -->
    <div v-if="!started" class="start-screen">
      <h2 class="module-title">{{ $t('learning.puzzle.title') }}</h2>
      <p class="module-desc">{{ $t('learning.puzzle.desc') }}</p>
      <button class="action-btn" @click="startPuzzle">
        [{{ $t('learning.start') }}]
      </button>
    </div>

    <!-- GAME AREA -->
    <div v-else-if="!finished" class="game-area">
      <div class="instruction">{{ $t('learning.puzzle.instruction') }}</div>
      
      <!-- TARGETS (Architects) -->
      <div class="targets-row">
        <div 
          v-for="arch in targets" 
          :key="arch.id"
          class="target-zone"
          @dragover.prevent
          @drop="handleDrop($event, arch)"
          :class="{ 'matched': arch.isMatched }"
        >
          <div class="arch-img-wrapper">
             <img :src="arch.image" class="arch-img" draggable="false"/>
             <div class="mark" v-if="arch.isMatched">✓</div>
          </div>
          <div class="arch-name">{{ getLocalized(arch, 'name') }}</div>
        </div>
      </div>

      <!-- DRAGGABLES (Materials) -->
      <div class="draggables-row">
        <div 
          v-for="mat in availableMaterials" 
          :key="mat.id"
          class="material-block"
          draggable="true"
          @dragstart="handleDragStart($event, mat)"
        >
          <span class="mat-icon">■</span>
          <span class="mat-name">{{ mat.label }}</span>
        </div>
      </div>

      <div class="feedback-msg" v-if="feedbackMsg">
        {{ feedbackMsg }}
      </div>
    </div>

    <!-- RESULT -->
    <div v-else class="result-screen">
      <h2 class="module-title">{{ $t('learning.puzzle.complete') }}</h2>
      <div class="rewards-display">
        <div class="reward-item">+150 EXP</div>
        <div class="reward-item badge-reward">
            [{{ $t('learning.badges.material_master') || 'Material Master' }}] UNLOCKED
        </div>
      </div>
      <button class="action-btn" @click="$emit('close')">
        [CLOSE]
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useGameStore } from '@/stores/useGameStore'
import { useLocalized } from '@/composables/useLocalized'

const buildingStore = useBuildingStore()
const gameStore = useGameStore()
const { getLocalized, getLocalizedTag } = useLocalized()
const emit = defineEmits(['close'])

const started = ref(false)
const finished = ref(false)
const feedbackMsg = ref('')

// Game Data
// Target Architects: 
// 1: Tatsuno Kingo (Red Brick)
// 6: Tadao Ando (Exposed Concrete)
// 5: Kengo Kuma (Wood)
// 3: Kazuyo Sejima (Glass) - or SANAA

interface GameArchitect {
    id: number
    name: string
    nameEn?: string
    nameJa?: string
    image: string
    requiredMaterial: string
    isMatched: boolean
}

const targets = ref<GameArchitect[]>([])
const materials = ref([
    { id: 'red_brick', labelKey: '红砖', value: 'red_brick' },
    { id: 'concrete', labelKey: '清水混凝土', value: 'concrete' }, // Using Chinese key to match buildings.ts logic if needed, or just keys
    { id: 'wood', labelKey: '木材', value: 'wood' }, // LabelKey will be passed to getLocalizedTag
    { id: 'glass', labelKey: '玻璃', value: 'glass' }
])

// Computed to show only unmatched materials (or keep all but make non-draggable? Let's remove used ones)
const availableMaterials = computed(() => {
    // Actually simpler: materials are infinite or 1-to-1? 
    // Let's make it 1-to-1.
    return materials.value.filter(m => !targets.value.some(t => t.requiredMaterial === m.value && t.isMatched))
})

const initGame = () => {
    // Fetch architects from store
    const archIds = [1, 6, 5, 3] 
    // Map: 1->red_brick, 6->concrete, 5->wood, 3->glass
    const materialMap: Record<number, string> = {
        1: 'red_brick',
        6: 'concrete',
        5: 'wood',
        3: 'glass'
    }

    targets.value = archIds.map(id => {
        const a = buildingStore.architects.find(arch => arch.id === id)
        if (!a) return null
        return {
            ...a,
            requiredMaterial: materialMap[id],
            isMatched: false
        }
    }).filter(Boolean) as GameArchitect[]
}

const startPuzzle = () => {
    started.value = true
    initGame()
}

const handleDragStart = (e: DragEvent, mat: any) => {
    if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', mat.value)
        e.dataTransfer.effectAllowed = 'move'
    }
}

const handleDrop = (e: DragEvent, arch: GameArchitect) => {
    if (arch.isMatched) return
    const matValue = e.dataTransfer?.getData('text/plain')
    
    if (matValue === arch.requiredMaterial) {
        arch.isMatched = true
        feedbackMsg.value = getLocalizedText('match') // Need simple translation lookup
        checkWin()
    } else {
        feedbackMsg.value = getLocalizedText('mismatch')
        setTimeout(() => feedbackMsg.value = '', 1000)
    }
}

const checkWin = () => {
    if (targets.value.every(t => t.isMatched)) {
        setTimeout(() => {
            finishGame()
        }, 500)
    }
}

const finishGame = () => {
    finished.value = true
    gameStore.gainExp(150)
    gameStore.unlockBadge('material_master')
    gameStore.completeModule('puzzle_1', 0)
}

// Helper for internal UI strings since useLocalized is for data objects
// We can use useI18n, but useLocalized composable exports t? No.
// Let's import useI18n
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const getLocalizedText = (key: string) => t(`learning.puzzle.${key}`)

// Fix material labels to be localized
const localizedMaterials = computed(() => {
    return availableMaterials.value.map(m => ({
        ...m,
        label: t(`tags.${m.labelKey}`) // Reuse tags translations! Genius.
    }))
})
// Override the v-for source
const availableMaterialsLocalized = localizedMaterials

</script>

<style scoped lang="scss">
.puzzle-module {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    padding: 20px;
}

.module-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 16px;
    text-transform: uppercase;
}

.module-desc {
    color: #888;
    margin-bottom: 32px;
}

.action-btn {
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 12px 24px;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #fff;
        color: #000;
    }
}

.game-area {
    width: 100%;
    max-width: 800px;
}

.instruction {
    margin-bottom: 40px;
    opacity: 0.7;
}

.targets-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 60px;
    flex-wrap: wrap;
}

.target-zone {
    border: 1px dashed #444;
    padding: 10px;
    transition: all 0.3s;
    width: 120px;
    
    &.matched {
        border-color: #4caf50;
        background: rgba(76, 175, 80, 0.1);
    }
}

.arch-img-wrapper {
    width: 100px;
    height: 100px;
    margin: 0 auto 10px;
    position: relative;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
    }

    .mark {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color: #4caf50;
        text-shadow: 0 0 10px black;
    }
}

.arch-name {
    font-size: 0.8rem;
    height: 2.4em; // Fixed height for 2 lines
    overflow: hidden;
}

.draggables-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    min-height: 80px; // Prevent collapse
}

.material-block {
    border: 1px solid #fff;
    padding: 10px 20px;
    cursor: grab;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #000;
    transition: transform 0.2s;

    &:active {
        cursor: grabbing;
    }
    
    &:hover {
        transform: scale(1.05);
        background: #222;
    }
}

.feedback-msg {
    margin-top: 20px;
    height: 24px;
    font-weight: bold;
}

.rewards-display {
    margin-bottom: 32px;
    border: 1px solid #fff;
    padding: 16px;
}
</style>
