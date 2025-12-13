import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { badges } from '@/data/badges'

export const useGameStore = defineStore('game', () => {
    // State
    const userLevel = ref(1)
    const currentExp = ref(0)
    const unlockedBadges = ref<string[]>([]) // IDs
    const completedModules = ref<string[]>([]) // IDs (e.g. 'quiz_1', 'puzzle_1')

    // ARC-LAB Stats (0-100)
    const startStats = {
        history: 10,
        structure: 15,
        aesthetic: 5,
        material: 20,
        observation: 10
    }
    const userStats = ref({ ...startStats })

    // Constants
    const BASE_EXP_PER_LEVEL = 500

    // Getters
    const nextLevelExp = computed(() => userLevel.value * BASE_EXP_PER_LEVEL)

    const progressPercentage = computed(() => {
        return Math.min(100, Math.floor((currentExp.value / nextLevelExp.value) * 100))
    })

    const userTitleKey = computed(() => {
        if (userLevel.value >= 10) return 'learning.titles.visionary'
        if (userLevel.value >= 5) return 'learning.titles.historian'
        if (userLevel.value >= 3) return 'learning.titles.builder'
        return 'learning.titles.novice'
    })

    const earnedBadges = computed(() => {
        return badges.filter(b => unlockedBadges.value.includes(b.id))
    })

    // Actions
    const initialize = () => {
        const saved = localStorage.getItem('arch_trace_game_progress')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                userLevel.value = data.userLevel ?? 1
                currentExp.value = data.currentExp ?? 0
                unlockedBadges.value = data.unlockedBadges ?? []
                completedModules.value = data.completedModules ?? []
                // Merge stats if exist, otherwise use default
                userStats.value = { ...startStats, ...(data.userStats || {}) }
            } catch (e) {
                console.error('Failed to load game progress', e)
            }
        }
    }

    const saveProgress = () => {
        const data = {
            userLevel: userLevel.value,
            currentExp: currentExp.value,
            unlockedBadges: unlockedBadges.value,
            completedModules: completedModules.value,
            userStats: userStats.value
        }
        localStorage.setItem('arch_trace_game_progress', JSON.stringify(data))
    }

    const gainExp = (amount: number) => {
        currentExp.value += amount
        // Mock Stat Increase
        userStats.value.history = Math.min(100, userStats.value.history + 1)
        userStats.value.structure = Math.min(100, userStats.value.structure + 1)

        checkLevelUp()
        saveProgress()
    }

    const checkLevelUp = () => {
        while (currentExp.value >= nextLevelExp.value) {
            currentExp.value -= nextLevelExp.value
            userLevel.value++
            // Boost random stats on level up
            userStats.value.aesthetic = Math.min(100, userStats.value.aesthetic + 5)
            userStats.value.observation = Math.min(100, userStats.value.observation + 5)

            if (userLevel.value === 5) unlockBadge('historian')
            if (userLevel.value === 10) unlockBadge('visionary')
        }
    }

    const unlockBadge = (badgeId: string) => {
        if (!unlockedBadges.value.includes(badgeId)) {
            unlockedBadges.value.push(badgeId)
            saveProgress()
            return true // New unlock
        }
        return false // Already unlocked
    }

    const completeModule = (moduleId: string, expReward: number) => {
        gainExp(expReward)
        if (!completedModules.value.includes(moduleId)) {
            completedModules.value.push(moduleId)
            saveProgress()
        }
    }

    // Auto-save on specific mutations is handled by explicit calls to saveProgress above,
    // but we can also watch for safety.
    watch([userLevel, currentExp, unlockedBadges, completedModules, userStats], () => {
        saveProgress()
    }, { deep: true })

    // Initialize on load
    initialize()

    return {
        userLevel,
        currentExp,
        unlockedBadges,
        completedModules,
        userStats,
        nextLevelExp,
        progressPercentage,
        userTitleKey,
        earnedBadges,
        gainExp,
        unlockBadge,
        completeModule,
        initialize // Exposed mainly for testing or explicit reload
    }
})
