<template>
  <div class="quiz-module">
    <!-- START SCREEN -->
    <div v-if="!started" class="start-screen">
      <h2 class="module-title">{{ $t('learning.quiz.title') }}</h2>
      <p class="module-desc">{{ $t('learning.quiz.desc') }}</p>
      <button class="action-btn" @click="startQuiz">
        [{{ $t('learning.start') }}]
      </button>
    </div>

    <!-- QUIZ INTERFACE -->
    <div v-else-if="!finished" class="quiz-interface">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: ((currentIndex) / totalQuestions) * 100 + '%' }"
        ></div>
      </div>
      
      <div class="question-box">
        <span class="q-label">{{ $t('learning.quiz.question') }} {{ currentIndex + 1 }} / {{ totalQuestions }}</span>
        <h3 class="q-text">{{ getQuestionText(currentQuestion) }}</h3>
      </div>

      <div class="options-grid">
        <button 
          v-for="opt in currentQuestion.options" 
          :key="opt.id"
          class="option-btn"
          :class="{ 
            'correct': showFeedback && opt.isCorrect,
            'wrong': showFeedback && selectedOption === opt.id && !opt.isCorrect,
            'selected': selectedOption === opt.id
          }"
          :disabled="showFeedback"
          @click="selectOption(opt)"
        >
          <span class="opt-id">[{{ opt.id }}]</span>
          <span class="opt-text">{{ getOptionText(opt) }}</span>
        </button>
      </div>

      <div v-if="showFeedback" class="feedback-area">
        <div class="feedback-msg" :class="{ 'is-correct': isLastCorrect }">
            {{ isLastCorrect ? $t('learning.quiz.correct') : $t('learning.quiz.wrong') }}
        </div>
        <button class="next-btn" @click="nextQuestion">
            {{ $t('quiz.nextQuestion') }} ->
        </button>
      </div>
    </div>

    <!-- RESULT SCREEN -->
    <div v-else class="result-screen">
      <h2 class="module-title">{{ $t('learning.quiz.complete') }}</h2>
      <div class="score-display">
        <div class="score-val">{{ score }} / {{ totalQuestions }}</div>
        <div class="score-label">{{ $t('learning.quiz.score') }}</div>
      </div>
      <div class="rewards-display" v-if="rewardsEarned.exp > 0">
        <div class="reward-item">+{{ rewardsEarned.exp }} EXP</div>
        <div v-if="rewardsEarned.badge" class="reward-item badge-reward">
            [{{ $t('learning.badges.quiz_master') || 'Quiz Master' }}] UNLOCKED
        </div>
      </div>
      <button class="action-btn" @click="$emit('close')">
        [CLOSE]
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { quizQuestions, type QuizQuestion } from '@/data/quizQuestions'
import { useLocalized } from '@/composables/useLocalized'
import { useGameStore } from '@/stores/useGameStore'

const { getLocalized } = useLocalized() // We need to manually handle the tri-lingual objects here or update useLocalized to handle this specific shape?
// Actually questions use { text, textEn, textJa } pattern, but fields are different (question, questionEn).
// Let's implement helper here or reuse useLocalized if it fits. 
// getLocalized takes (obj, field). question obj has question, questionEn... so field is 'question'.
// option obj has text, textEn... so field is 'text'.
// Yes, getLocalized should work.

const store = useGameStore()
const emit = defineEmits(['close'])

const started = ref(false)
const finished = ref(false)
const currentIndex = ref(0)
const score = ref(0)
const showFeedback = ref(false)
const selectedOption = ref<string | null>(null)
const isLastCorrect = ref(false)

const rewardsEarned = ref({ exp: 0, badge: false })

const questions = ref(quizQuestions) // In real app, maybe shuffle
const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentIndex.value])

const getQuestionText = (q: QuizQuestion) => getLocalized(q, 'question')
const getOptionText = (opt: any) => getLocalized(opt, 'text')

const startQuiz = () => {
  started.value = true
  currentIndex.value = 0
  score.value = 0
  finished.value = false
}

const selectOption = (opt: any) => {
  if (showFeedback.value) return
  selectedOption.value = opt.id
  isLastCorrect.value = opt.isCorrect
  if (opt.isCorrect) score.value++
  showFeedback.value = true
}

const nextQuestion = () => {
    showFeedback.value = false
    selectedOption.value = null
    if (currentIndex.value < totalQuestions.value - 1) {
        currentIndex.value++
    } else {
        finishQuiz()
    }
}

const finishQuiz = () => {
    finished.value = true
    let exp = 0
    let badge = false

    // Reward Logic
    const percentage = score.value / totalQuestions.value
    if (percentage >= 0.8) {
        exp = 100
    }
    
    // Unlock Novice Architect on first completion
    store.unlockBadge('novice_architect')

    if (percentage === 1.0) {
        if (store.unlockBadge('quiz_master')) {
            badge = true
        }
    }

    if (exp > 0) {
        store.gainExp(exp)
    }
    store.completeModule('quiz_1', 0) // Already gave XP manually
    
    rewardsEarned.value = { exp, badge }
}
</script>

<style scoped lang="scss">
.quiz-module {
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
    max-width: 400px;
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

.quiz-interface {
    width: 100%;
    max-width: 600px;
    text-align: left;
}

.progress-bar {
    width: 100%;
    height: 2px;
    background: #333;
    margin-bottom: 24px;
}

.progress-fill {
    height: 100%;
    background: #fff;
    transition: width 0.3s;
}

.q-label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 8px;
}

.q-text {
    font-size: 1.5rem;
    margin-bottom: 32px;
    line-height: 1.4;
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.option-btn {
    background: transparent;
    border: 1px solid #333;
    color: #ccc;
    padding: 16px;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    gap: 12px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        border-color: #666;
        color: #fff;
    }

    &.selected {
        border-color: #fff;
        color: #fff;
        background: #222;
    }

    &.correct {
        border-color: #4caf50; // Greenish
        color: #4caf50;
    }

    &.wrong {
        border-color: #f44336; // Reddish
        color: #f44336;
    }
}

.feedback-area {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #333;
    padding-top: 24px;
}

.feedback-msg {
    font-weight: 700;
    color: #f44336;
    
    &.is-correct {
        color: #4caf50;
    }
}

.next-btn {
    background: #fff;
    color: #000;
    border: none;
    padding: 8px 16px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
}

.score-display {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 32px;
}

.rewards-display {
    margin-bottom: 32px;
    border: 1px solid #fff;
    padding: 16px;
}

.reward-item {
    font-weight: 700;
}
</style>
