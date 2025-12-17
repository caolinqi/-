<template>
  <div class="figures-page">
    <div class="background-fx"></div>

    <div class="content-container">
        
        <!-- INTRO STATE -->
        <div v-if="!revealedArchitect" class="deck-container">
            <h1 class="page-title">{{ $t('nav.figures') }}</h1>
            <p class="instruction">{{ locale === 'zh-CN' ? '点击抽取一位建筑大师' : 'DRAW A MASTER ARCHITECT' }}</p>
            
            <!-- DECK FILTERS -->
            <div class="deck-filters">
                <label class="filter-switch">
                    <input type="checkbox" v-model="onlyPritzker">
                    <span class="slider"></span>
                    <span class="label-text">{{ locale === 'zh-CN' ? '仅限普利兹克奖' : 'PRITZKER ONLY' }}</span>
                </label>
            </div>
            
            <div class="card-deck" @click="drawCard">
                <div class="card-stack">
                    <div class="card card-back">
                        <div class="pattern"></div>
                        <div class="logo-mark" :class="{ gold: onlyPritzker }">
                            {{ onlyPritzker ? 'PRITZKER' : 'ARCH' }}
                        </div>
                    </div>
                    <div class="card card-back offset-1"></div>
                    <div class="card card-back offset-2"></div>
                </div>
                <div class="glow-effect" :class="{ gold: onlyPritzker }"></div>
            </div>

            <!-- COLLECTION ACTION -->
            <button class="collection-btn" @click="showCollection = true">
                {{ locale === 'zh-CN' ? '我的收藏' : 'MY COLLECTION' }} ({{ collectedIds.length }})
            </button>
        </div>

        <!-- REVEAL STATE (3D FLIP) -->
        <div v-else class="reveal-stage">
            <div class="card-scene">
                <div class="card-object" :class="{ flipped: isFlipped }">
                    <!-- FRONT -->
                    <div class="card-face face-front">
                        <div class="pattern"></div>
                         <div class="logo-mark" :class="{ gold: onlyPritzker }">
                            {{ onlyPritzker ? 'PRITZKER' : 'ARCH' }}
                        </div>
                    </div>

                    <!-- BACK -->
                    <div class="card-face face-back">
                         <!-- NEW BADGE -->
                        <div v-if="isNewDiscovery" class="new-badge">NEW</div>

                        <div class="arch-image">
                            <img :src="revealedArchitect.image" :alt="revealedArchitect.name" />
                            <div class="overlay-grad"></div>
                        </div>
                        <div class="arch-info">
                            <h2 class="name">{{ getLocalized(revealedArchitect, 'name') }}</h2>
                            <div class="years">{{ revealedArchitect.birthYear }} - {{ revealedArchitect.deathYear || 'PRESENT' }}</div>
                            <div class="quote" v-if="randomQuote">“{{ getLocalizedQuote(randomQuote) }}”</div>
                            
                            <div class="action-row">
                                <button class="view-btn outline" @click.stop="goToDetail(revealedArchitect.id)">
                                    {{ locale === 'zh-CN' ? '查看详情' : 'DETAILS' }}
                                </button>
                                <button class="view-btn primary" v-if="!isCollected(revealedArchitect.id)" @click.stop="collect(revealedArchitect.id)">
                                    {{ locale === 'zh-CN' ? '收入图鉴' : 'COLLECT' }}
                                </button>
                                <button class="view-btn disabled" v-else disabled>
                                    {{ locale === 'zh-CN' ? '已收藏' : 'OWNED' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="controls">
                <button class="retry-btn" @click="reset">
                     {{ locale === 'zh-CN' ? '再次抽取' : 'DRAW AGAIN' }}
                </button>
                <button class="retry-btn" @click="showCollection = true">
                     {{ locale === 'zh-CN' ? '查看收藏' : 'VIEW COLLECTION' }}
                </button>
            </div>
        </div>

    </div>

    <!-- COLLECTION DRAWER -->
    <Transition name="slide-up">
        <div v-if="showCollection" class="collection-drawer">
            <div class="drawer-header">
                <h2>{{ locale === 'zh-CN' ? '收藏家图鉴' : 'COLLECTOR GALLERY' }}</h2>
                <button class="close-icon" @click="showCollection = false">×</button>
            </div>
            <div class="drawer-grid">
                <div 
                    v-for="arch in collectedArchitects" 
                    :key="arch.id" 
                    class="mini-card"
                    @click="goToDetail(arch.id)"
                >
                    <img :src="arch.image" loading="lazy" />
                    <div class="mini-name">{{ getLocalized(arch, 'name') }}</div>
                </div>
                <div v-if="collectedArchitects.length === 0" class="empty-state">
                    {{ locale === 'zh-CN' ? '暂无收藏，快去抽取吧！' : 'No collection yet. Start drawing!' }}
                </div>
            </div>
        </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useLocalized } from '@/composables/useLocalized'
import { useI18n } from 'vue-i18n'
import type { Architect, Quote } from '@/types'

const router = useRouter()
const store = useBuildingStore()
const { getLocalized } = useLocalized()
const { locale } = useI18n()

const revealedArchitect = ref<Architect | null>(null)
const isFlipped = ref(false)
const randomQuote = ref<Quote | null>(null)
const onlyPritzker = ref(false)
const showCollection = ref(false)

// Collection Logic (LocalStorage)
const collectedIds = ref<number[]>([])
const isNewDiscovery = ref(false)

onMounted(() => {
    const saved = localStorage.getItem('arch_collection');
    if (saved) {
        try {
            collectedIds.value = JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
    }
})

const collectedArchitects = computed(() => {
    return store.architects.filter(a => collectedIds.value.includes(a.id))
})

const isCollected = (id: number) => collectedIds.value.includes(id)

const collect = (id: number) => {
    if (!collectedIds.value.includes(id)) {
        collectedIds.value.push(id)
        localStorage.setItem('arch_collection', JSON.stringify(collectedIds.value))
    }
}

const drawCard = () => {
    let pool = store.architects
    if (onlyPritzker.value) {
        // Mock Pritzker IDs if not in DB proper, or filter by some property. 
        // For now using specific list or assuming 'achievements' has keyword.
        // Let's rely on fixed IDs for demo: [1, 2, 4, 18] etc.
        const pIds = [1, 2, 4, 18]; 
        pool = store.architects.filter(a => pIds.includes(a.id));
        if (pool.length === 0) pool = store.architects; // Fallback
    }

    const randomIndex = Math.floor(Math.random() * pool.length)
    revealedArchitect.value = pool[randomIndex]
    
    // Check if new
    isNewDiscovery.value = !collectedIds.value.includes(revealedArchitect.value.id)
    
    // Auto Collect? No, let user collect.
    
    // Animate
    setTimeout(() => {
        isFlipped.value = true
    }, 100)
}

const reset = () => {
    isFlipped.value = false
    setTimeout(() => {
        revealedArchitect.value = null
        isNewDiscovery.value = false
    }, 600) 
}

const goToDetail = (id: number) => {
    router.push(`/architect/${id}`)
}

const getLocalizedQuote = (q: Quote) => {
    if(!q) return ''
    return locale.value === 'zh-CN' ? (q.textJa || q.text) : q.text
}
</script>

<style scoped lang="scss">
.figures-page {
    min-height: 100vh;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: #fff;
    font-family: 'Inter', sans-serif;
    perspective: 1000px;
    padding-top: 60px;
}

.background-fx {
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, #222 0%, #000 100%);
    z-index: 0;
}

.content-container {
    position: relative; z-index: 10;
    text-align: center;
    width: 100%;
}

.page-title {
    font-size: 3rem; font-weight: 900; letter-spacing: 5px; margin-bottom: 5px;
    text-transform: uppercase;
    background: linear-gradient(to right, #fff, #666);
    -webkit-background-clip: text; color: transparent;
}
.instruction { font-family: 'JetBrains Mono'; color: #666; margin-bottom: 30px; }

/* FILTERS */
.deck-filters { margin-bottom: 20px; }
.filter-switch {
    display: inline-flex; align-items: center; cursor: pointer;
    .label-text { font-family: 'JetBrains Mono'; font-size: 0.8rem; margin-left: 10px; color: #888; }
    input { display: none; }
    .slider {
        width: 40px; height: 20px; background: #333; border-radius: 20px; position: relative; transition: 0.3s;
        &:before { content:''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: #888; border-radius: 50%; transition: 0.3s; }
    }
    input:checked + .slider { background: #ffd700; }
    input:checked + .slider:before { transform: translateX(20px); background: #000; }
}

/* DECK STYLES */
.card-deck {
    position: relative;
    width: 300px; height: 450px;
    margin: 0 auto;
    cursor: pointer;
    transition: transform 0.3s;
    &:hover { transform: scale(1.05); }
}

.card-stack { position: relative; width: 100%; height: 100%; }

.card {
    position: absolute; inset: 0;
    border-radius: 15px;
    background: #1a1a1a;
    border: 1px solid #333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
}

.card-back {
    background: linear-gradient(135deg, #222 25%, #1a1a1a 25%, #1a1a1a 50%, #222 50%, #222 75%, #1a1a1a 75%, #1a1a1a 100%);
    background-size: 20px 20px;
}

.offset-1 { transform: translate(5px, 5px) rotate(2deg); z-index: -1; opacity: 0.8; }
.offset-2 { transform: translate(10px, 10px) rotate(4deg); z-index: -2; opacity: 0.6; }

.logo-mark {
    font-family: 'JetBrains Mono'; font-weight: 900; font-size: 2rem;
    border: 3px solid #444; padding: 10px 20px; color: #444;
    transform: rotate(-45deg); transition: 0.3s;
    &.gold { color: #ffd700; border-color: #ffd700; }
}

.glow-effect {
    position: absolute; inset: -20px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.3s; pointer-events: none;
    &.gold { background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%); }
}
.card-deck:hover .glow-effect { opacity: 1; }

.collection-btn {
    margin-top: 40px;
    background: transparent; border: 1px solid #444; color: #888;
    padding: 10px 20px; font-family: 'JetBrains Mono'; cursor: pointer;
    transition: 0.2s;
    &:hover { border-color: #fff; color: #fff; }
}

/* 3D REVEAL SCENE */
.reveal-stage {
    perspective: 1200px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.card-scene {
    width: 340px; height: 500px;
    position: relative;
    margin-bottom: 40px;
}

.card-object {
    width: 100%; height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.card-object.flipped {
    transform: rotateY(180deg);
}

.card-face {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
    background: #111;
    border: 1px solid #333;
}

.face-front {
    /* Same as card-back */
    background: linear-gradient(135deg, #222 25%, #1a1a1a 25%, #1a1a1a 50%, #222 50%, #222 75%, #1a1a1a 75%, #1a1a1a 100%);
    background-size: 20px 20px;
    display: flex; justify-content: center; align-items: center;
}

.face-back {
    transform: rotateY(180deg);
    display: flex; flex-direction: column;
}

.new-badge {
    position: absolute; top: 15px; right: 15px;
    background: #ff3333; color: #fff; font-size: 0.7rem; font-weight: 800;
    padding: 2px 6px; border-radius: 4px; z-index: 10;
    animation: bounce 1s infinite;
}

.arch-image {
    height: 55%; position: relative;
    img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%); }
    .overlay-grad { position: absolute; inset: 0; background: linear-gradient(to top, #111, transparent); }
}

.arch-info {
    padding: 20px; text-align: center;
    flex: 1; display: flex; flex-direction: column; align-items: center;
}

.name { font-size: 1.5rem; font-weight: 700; margin: 0; margin-bottom: 5px; color: #fff; }
.years { font-family: 'JetBrains Mono'; font-size: 0.8rem; color: #666; margin-bottom: 15px; }

.action-row {
    margin-top: auto; display: flex; gap: 10px; width: 100%;
}
.view-btn {
    flex: 1; padding: 10px 0; border: none; font-weight: 700; font-family: 'JetBrains Mono'; cursor: pointer; transition: 0.2s;
    &.outline { background: transparent; border: 1px solid #444; color: #eee; &:hover { border-color: #fff; } }
    &.primary { background: #fff; color: #000; &:hover { background: #ccc; } }
    &.disabled { background: #222; color: #555; cursor: default; }
}

.controls {
    opacity: 0;
    animation: fadeIn 1s 1s forwards;
}

.retry-btn {
    background: transparent; border: 1px solid #444; color: #888;
    padding: 8px 16px; font-family: 'JetBrains Mono'; cursor: pointer;
    &:hover { color: #fff; border-color: #fff; }
}

/* DRAWER */
.collection-drawer {
    position: fixed; bottom: 0; left: 0; right: 0; height: 50vh;
    background: #1a1a1a; border-top: 2px solid #333;
    z-index: 200;
    display: flex; flex-direction: column;
    box-shadow: 0 -10px 50px rgba(0,0,0,0.8);
}
.drawer-header {
    padding: 15px 30px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1rem; color: #fff; letter-spacing: 2px; text-transform: uppercase; }
    .close-icon { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
}
.drawer-grid {
    flex: 1; overflow-y: auto; padding: 20px;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px;
}
.mini-card {
    background: #000; border: 1px solid #333; border-radius: 8px; overflow: hidden;
    cursor: pointer; transition: 0.2s;
    &:hover { transform: translateY(-5px); border-color: #fff; }
    img { width: 100%; height: 100px; object-fit: cover; opacity: 0.7; }
    .mini-name { font-size: 0.7rem; color: #ccc; padding: 5px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}
.empty-state { grid-column: 1 / -1; text-align: center; color: #666; padding-top: 50px; }

@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
@keyframes fadeIn { to { opacity: 1; } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

/* TRANSITIONS */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
