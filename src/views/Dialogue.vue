<template>
  <div class="compare-page">
    <div class="compare-container">
        
        <!-- VS HEADER -->
        <div class="vs-header">
            <h1 class="page-title">{{ t('compare.title') }}</h1>
        </div>

        <!-- MAIN SPLIT VIEW -->
        <div class="split-view">
            
            <!-- LEFT BUILDING -->
            <div class="building-col left">
                <div class="selector-wrap">
                    <select v-model="selectedIdLeft" class="b-select">
                        <option v-for="b in buildings" :key="b.id" :value="b.id">
                            {{ locale === 'zh-CN' ? b.name : b.name }} 
                        </option>
                    </select>
                </div>
                
                <!-- Image Card -->
                <div class="visual-card">
                    <img :src="leftBuilding.image" :alt="leftBuilding.name" />
                    <div class="card-overlay">
                        <h2>{{ getLocalized(leftBuilding, 'name') }}</h2>
                        <p class="subtitle">{{ getLocalized(leftBuilding, 'architect') }}</p>
                    </div>
                </div>

                <!-- Expanded Stats -->
                <div class="stats-box">
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.year') }}</span>
                        <span class="val">{{ leftBuilding.year }}</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.height') }}</span>
                        <span class="val">{{ leftBuilding.height || '-' }}m</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.location') }}</span>
                        <span class="val">{{ getLocalized(leftBuilding, 'location') }}</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.material') }}</span>
                        <span class="val">{{ leftBuilding.materials?.[0] ? getLocalizedTag(leftBuilding.materials[0]) : '-' }}</span>
                    </div>
                     <div class="stat-row">
                        <span>{{ t('dialogue.fields.style') }}</span>
                        <span class="val">{{ leftBuilding.style || '-' }}</span>
                    </div>
                </div>
            </div>

            <!-- CENTER HUD -->
            <div class="center-hud">
                <!-- RADAR CHART -->
                <div class="radar-wrapper">
                    <svg viewBox="0 0 100 100" class="radar-svg">
                         <!-- Grid -->
                        <polygon points="50,10 90,40 75,90 25,90 10,40" class="grid-poly" />
                        <polygon points="50,30 70,45 62,70 38,70 30,45" class="grid-poly inner" />
                        
                        <!-- Left Data -->
                        <polygon :points="leftPoints" class="data-poly left" />
                        <!-- Right Data -->
                        <polygon :points="rightPoints" class="data-poly right" />
                    </svg>
                    <!-- Localized Radar Labels -->
                    <div class="radar-label top">{{ t('dialogue.metrics.aesthetics') }}</div>
                    <div class="radar-label right-top">{{ t('dialogue.metrics.history') }}</div>
                    <div class="radar-label right-btm">{{ t('dialogue.metrics.innovation') }}</div>
                    <div class="radar-label left-btm">{{ t('dialogue.metrics.complexity') }}</div>
                    <div class="radar-label left-top">{{ t('compare.impact') }}</div>
                </div>

                <!-- AI ANALYZE BUTTON -->
                <button class="ai-analyze-btn" @click="runAIAnalysis" :disabled="isAiTyping || leftBuilding.id === 0">
                    <span class="icon">🤖</span>
                    <span v-if="leftBuilding.id === 0">{{ t('common.loading') || 'Loading...' }}</span>
                    <span v-else-if="!isAiTyping">{{ t('compare.analyze_btn') }}</span>
                    <span v-else>{{ t('compare.analyzing') }}</span>
                </button>
            </div>

            <!-- RIGHT BUILDING -->
            <div class="building-col right">
                <div class="selector-wrap">
                    <select v-model="selectedIdRight" class="b-select">
                         <option v-for="b in buildings" :key="b.id" :value="b.id">
                            {{ locale === 'zh-CN' ? b.name : b.name }} 
                        </option>
                    </select>
                </div>
                <div class="visual-card">
                    <img :src="rightBuilding.image" :alt="rightBuilding.name" />
                    <div class="card-overlay">
                        <h2>{{ getLocalized(rightBuilding, 'name') }}</h2>
                        <p class="subtitle">{{ getLocalized(rightBuilding, 'architect') }}</p>
                    </div>
                </div>
                <div class="stats-box">
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.year') }}</span>
                        <span class="val">{{ rightBuilding.year }}</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.height') }}</span>
                        <span class="val">{{ rightBuilding.height || '-' }}m</span>
                    </div>
                     <div class="stat-row">
                        <span>{{ t('dialogue.fields.location') }}</span>
                        <span class="val">{{ getLocalized(rightBuilding, 'location') }}</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.material') }}</span>
                        <span class="val">{{ rightBuilding.materials?.[0] ? getLocalizedTag(rightBuilding.materials[0]) : '-' }}</span>
                    </div>
                    <div class="stat-row">
                        <span>{{ t('dialogue.fields.style') }}</span>
                        <span class="val">{{ rightBuilding.style || '-' }}</span>
                    </div>
                </div>
            </div>

        </div>

        <!-- AI OUTPUT PANEL -->
        <Transition name="slide-up">
            <div v-if="showAnalysis" class="analysis-panel">
                <div class="panel-header">
                    <h3>ARCH-MIND ANALYSIS</h3>
                    <button class="close-btn" @click="showAnalysis = false">×</button>
                </div>
                <div class="panel-content">
                    <div v-if="analysisResult" class="markdown-body" v-html="renderMarkdown(analysisResult)"></div>
                    <div v-else class="loading-cursor">_</div>
                </div>
            </div>
        </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useLocalized } from '@/composables/useLocalized'
import { useDeepSeek } from '@/composables/useDeepSeek'
import { useI18n } from 'vue-i18n' 
import type { Building } from '@/types'

const { locale, t } = useI18n()
const store = useBuildingStore()
const { getLocalized, getLocalizedTag } = useLocalized()
const { messages, isAiTyping, processQuery } = useDeepSeek()

const buildings = computed(() => store.buildings)
const selectedIdLeft = ref(1)
const selectedIdRight = ref(2)

// Dummy Object to prevent crash
const dummyBuilding: Building = {
    id: 0, 
    name: 'Loading...', 
    year: 0, 
    architect: 'Loading...',
    image: '', 
    location: '', 
    tags: [],
    latitude: 0,
    longitude: 0,
    style: '',
    category: ''
}

const leftBuilding = computed(() => {
    if (!buildings.value.length) return dummyBuilding
    return buildings.value.find(b => b.id === selectedIdLeft.value) || buildings.value[0] || dummyBuilding
})

const rightBuilding = computed(() => {
    if (!buildings.value.length) return dummyBuilding
    return buildings.value.find(b => b.id === selectedIdRight.value) || buildings.value[1] || buildings.value[0] || dummyBuilding
})

// Auto-select first two when data loads
watch(buildings, (newVal) => {
    if (newVal.length >= 2) {
        selectedIdLeft.value = newVal[0].id
        selectedIdRight.value = newVal[1].id
    }
}, { immediate: true })

// --- RADAR CHART LOGIC ---
const getPoints = (b: Building, scale = 1) => {
    // Mock metrics based on ID/Year hash for demo stability
    const h = (b.id * 13) % 40 + 60
    const hist = (2025 - b.year) > 50 ? 90 : 60
    const tech = (b.year > 1980) ? 90 : 50
    const space = (b.name.length * 5) % 40 + 60
    const impact = 80

    const vals = [h, hist, tech, space, impact].map(v => v * scale * 0.4) // Radius scale
    
    // 5 points at 72 deg
    // -90, -18, 54, 126, 198
    const angles = [-90, -18, 54, 126, 198]
    const c = 50
    
    return angles.map((ang, i) => {
        const rad = ang * Math.PI / 180
        const r = vals[i]
        const x = c + Math.cos(rad) * r
        const y = c + Math.sin(rad) * r
        return `${x},${y}`
    }).join(' ')
}

const leftPoints = computed(() => getPoints(leftBuilding.value))
const rightPoints = computed(() => getPoints(rightBuilding.value))

// --- AI LOGIC ---
const showAnalysis = ref(false)
const analysisResult = ref('')

// Watch DeepSeek messages to update result
watch(messages, (newVal) => {
    const lastMsg = newVal[newVal.length - 1]
    if (lastMsg && lastMsg.role === 'assistant') {
        analysisResult.value = lastMsg.content
    }
}, { deep: true })

const runAIAnalysis = async () => {
    analysisResult.value = ''
    showAnalysis.value = true
    
    const prompt = locale.value === 'zh-CN' 
        ? `请深度对比以下两座建筑：
           A: ${leftBuilding.value.name} (By ${leftBuilding.value.architect}, ${leftBuilding.value.year})
           B: ${rightBuilding.value.name} (By ${rightBuilding.value.architect}, ${rightBuilding.value.year})
           请从风格流派、空间设计哲学、以及历史地位三个维度进行比较。用 markdown 格式列表输出。`
        : `Please compare these two buildings:
           A: ${leftBuilding.value.name}
           B: ${rightBuilding.value.name}
           Compare their style, philosophy, and historical significance. Output in Markdown.`
    
    await processQuery(prompt)
}

// Simple Markdown Renderer
const renderMarkdown = (text: string) => {
    let html = text
        .replace(/^```.*?$/gm, '') // Remove code block markers
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h4>$1</h4>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n\n/g, '<br><br>') // Handle paragraphs better
        .replace(/\n/g, '<br>')
        
    return html
}

</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap');

.compare-page {
    min-height: 100vh;
    background: #050505;
    color: #fff;
    padding-top: 80px;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
}

.compare-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    padding-bottom: 50px;
}

.vs-header {
    text-align: center; margin-bottom: 40px; position: relative;
    .page-title { font-weight: 900; letter-spacing: -1px; margin: 0; color: #333; font-size: 3rem; text-transform: uppercase; text-shadow: 0 1px 0 rgba(255,255,255,0.1); }
}

.split-view {
    display: flex; gap: 40px; position: relative;
    align-items: flex-start;
}

.building-col {
    flex: 1;
    display: flex; flex-direction: column; gap: 20px;
    &.right { text-align: right; }
}

.selector-wrap select {
    background: #111; border: 1px solid #333; color: #fff; padding: 10px;
    width: 100%; font-family: 'JetBrains Mono'; outline: none;
    font-size: 1rem;
    &:focus { border-color: #666; }
}

.visual-card {
    height: 400px; position: relative; overflow: hidden;
    border: 1px solid #222;
    img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; filter: grayscale(100%); }
    
    .card-overlay {
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 20px; background: linear-gradient(transparent, #000);
        h2 { font-size: 2rem; margin: 0; font-weight: 900; line-height: 1; }
        .subtitle { color: #888; font-family: 'Noto Serif JP'; margin: 5px 0 0; }
    }
    
    &:hover img { filter: grayscale(0%); transform: scale(1.05); }
}

.stats-box {
    background: #111; padding: 20px; border: 1px solid #222;
    .stat-row { 
        display: flex; justify-content: space-between; border-bottom: 1px solid #222; padding: 10px 0;
        font-family: 'JetBrains Mono'; font-size: 0.9rem; color: #888;
        .val { color: #fff; font-weight: 700; width: 60%; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        &:last-child { border: none; }
    }
}

/* CENTER HUD */
.center-hud {
    width: 240px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 30px;
    margin-top: 60px;
}

.radar-wrapper {
    width: 200px; height: 200px; position: relative;
    .radar-svg { 
        width: 100%; height: 100%; 
        .grid-poly { fill: none; stroke: #333; }
        .inner { stroke-dasharray: 2 2; opacity: 0.5; }
        .data-poly { fill-opacity: 0.3; stroke-width: 2; transition: all 0.5s; }
        .data-poly.left { fill: #fff; stroke: #fff; }
        .data-poly.right { fill: #999; stroke: #999; }
    }
    
    .radar-label {
        position: absolute; font-size: 0.6rem; color: #555; font-family: 'JetBrains Mono';
        white-space: nowrap;
        &.top { top: -15px; left: 50%; transform: translateX(-50%); }
        &.right-top { top: 30px; right: -30px; }
        &.right-btm { bottom: 30px; right: -30px; }
        &.left-btm { bottom: 30px; left: -30px; }
        &.left-top { top: 30px; left: -30px; }
    }
}

.ai-analyze-btn {
    background: linear-gradient(135deg, #00ffcc 0%, #0099cc 100%);
    border: none; color: #000; padding: 15px 30px;
    font-weight: 900; font-family: 'JetBrains Mono';
    cursor: pointer; display: flex; align-items: center; gap: 10px;
    box-shadow: 0 0 20px rgba(0,255,204,0.3);
    transition: 0.3s;
    &:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(0,255,204,0.5); }
    &:disabled { filter: grayscale(1); cursor: not-allowed; }
}

/* ANALYSIS PANEL */
.analysis-panel {
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1000px;
    height: 60vh; 
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 255, 204, 0.2);
    border-radius: 12px;
    z-index: 100;
    display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(0, 255, 204, 0.1);
    overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-header {
    padding: 15px 25px; 
    background: rgba(0,0,0,0.6); 
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex; justify-content: space-between; align-items: center;
    
    h3 { 
        margin: 0; 
        font-family: 'JetBrains Mono', monospace; 
        color: #00ffcc; 
        font-size: 0.9rem;
        letter-spacing: 2px;
        display: flex; align-items: center; gap: 10px;
        &:before { content: ''; width: 8px; height: 8px; background: #00ffcc; border-radius: 50%; box-shadow: 0 0 10px #00ffcc; }
    }

    .close-btn { 
        background: none; border: none; color: #666; cursor: pointer; font-size: 1.5rem; line-height: 1; transition: 0.3s;
        &:hover { color: #fff; transform: rotate(90deg); }
    }
}

.panel-content {
    padding: 40px; 
    overflow-y: auto; 
    font-family: 'Inter', sans-serif;
    line-height: 1.8; 
    color: #e0e0e0;
    
    /* Custom Scrollbar */
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: #111; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    &::-webkit-scrollbar-thumb:hover { background: #555; }
}

/* Markdown Styling */
:deep(.markdown-body) {
    strong { color: #fff; font-weight: 700; background: rgba(255,255,255,0.1); padding: 0 4px; border-radius: 2px; }
    
    h4 { 
        color: #00ffcc; 
        margin-top: 30px; margin-bottom: 20px;
        font-family: 'JetBrains Mono'; 
        font-size: 1.1rem; 
        text-transform: uppercase; 
        letter-spacing: 1px;
        border-left: 3px solid #00ffcc;
        padding-left: 15px;
        background: linear-gradient(90deg, rgba(0,255,204,0.1), transparent);
        padding-top: 5px; padding-bottom: 5px;
    }
    
    li { 
        margin-bottom: 12px; 
        list-style: none;
        position: relative;
        padding-left: 20px;
        &:before { content: '>'; position: absolute; left: 0; color: #666; font-family: 'JetBrains Mono'; font-size: 0.8rem; top: 2px; }
    }
    
    p { margin-bottom: 15px; color: #ccc; }
}

.loading-cursor { 
    display: inline-block; width: 10px; height: 1.2em; background: #00ffcc; 
    animation: blink 1s infinite; vertical-align: middle; 
}
@keyframes blink { 50% { opacity: 0; } }
@keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

/* RESPONSIVE */
@media (max-width: 900px) {
    .split-view { flex-direction: column; }
    .center-hud { order: -1; width: 100%; flex-direction: row; justify-content: space-around; margin-top: 20px; }
    .visual-card { height: 250px; }
    .analysis-panel { width: 100%; bottom: 0; border-radius: 12px 12px 0 0; height: 70vh; }
}
</style>
