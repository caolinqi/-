<template>
  <div class="dialogue-page font-mono">
    <!-- Split Screen Container -->
    <div class="split-container">
      
      <!-- LEFT COLUMN -->
      <div class="split-col left-col" @mouseenter="hoverSide = 'left'" @mouseleave="hoverSide = null">
        <!-- Selector -->
        <div class="selector-wrapper">
          <select v-model="selectedIdLeft" class="minimal-select">
             <option v-for="b in buildings" :key="b.id" :value="b.id">
               {{ String(b.id).padStart(2, '0') }} - {{ b.name }}
             </option>
          </select>
        </div>

        <!-- Image Area -->
        <div class="image-area" :class="{ 'is-color': hoverSide === 'left' }">
           <img :src="leftBuilding.image" :alt="leftBuilding.name" />
           <div class="building-name">{{ getLocalized(leftBuilding, 'name') }}</div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="split-col right-col" @mouseenter="hoverSide = 'right'" @mouseleave="hoverSide = null">
        <!-- Selector -->
        <div class="selector-wrapper right-align">
          <select v-model="selectedIdRight" class="minimal-select">
             <option v-for="b in buildings" :key="b.id" :value="b.id">
               {{ String(b.id).padStart(2, '0') }} - {{ b.name }}
             </option>
          </select>
        </div>

        <!-- Image Area -->
        <div class="image-area" :class="{ 'is-color': hoverSide === 'right' }">
           <img :src="rightBuilding.image" :alt="rightBuilding.name" />
           <div class="building-name">{{ getLocalized(rightBuilding, 'name') }}</div>
        </div>
      </div>

    </div>

    <!-- CENTER RADAR CHART (Now Below) -->
    <div class="radar-container">
      <svg viewBox="0 0 240 240" class="radar-svg">
          <!-- PENTAGON GRID (5 AXES) -->
          <!-- Axis Lines -->
          <line x1="120" y1="120" x2="120" y2="20" class="axis-line" /> <!-- Top -->
          <line x1="120" y1="120" x2="215" y2="89" class="axis-line" /> <!-- Top Right -->
          <line x1="120" y1="120" x2="179" y2="201" class="axis-line" /> <!-- Bottom Right -->
          <line x1="120" y1="120" x2="61" y2="201" class="axis-line" /> <!-- Bottom Left -->
          <line x1="120" y1="120" x2="25" y2="89" class="axis-line" /> <!-- Top Left -->

          <!-- Grid Polygons -->
          <polygon points="120,20 215,89 179,201 61,201 25,89" class="grid-line" />
          <polygon points="120,70 167.5,104.5 149.5,160.5 90.5,160.5 72.5,104.5" class="grid-line inner" />

          <!-- Data Polygons -->
          <polygon :points="leftRadarPoints" class="radar-polygon left-poly" />
          <polygon :points="rightRadarPoints" class="radar-polygon right-poly" />

          <!-- Labels -->
          <text x="120" y="15" text-anchor="middle" class="radar-label">{{ $t('dialogue.metrics.height') }}</text>
          <text x="225" y="85" text-anchor="start" class="radar-label">{{ $t('dialogue.metrics.history') }}</text>
          <text x="190" y="215" text-anchor="start" class="radar-label">{{ $t('dialogue.metrics.innovation') }}</text>
          <text x="50" y="215" text-anchor="end" class="radar-label">{{ $t('dialogue.metrics.complexity') }}</text>
          <text x="15" y="85" text-anchor="end" class="radar-label">{{ $t('dialogue.metrics.aesthetics') }}</text>
      </svg>
    </div>

    <!-- COMPARISON DATA SHEET -->
    <div class="data-sheet">
       <div class="sheet-row" v-for="field in comparisonFields" :key="field.key">
          <div class="cell left-cell">{{ getFieldValue(leftBuilding, field) }}</div>
          <div class="cell center-label">{{ $t('dialogue.fields.' + field.key) }}</div>
          <div class="cell right-cell">{{ getFieldValue(rightBuilding, field) }}</div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useLocalized } from '@/composables/useLocalized'
import type { Building } from '@/types'

const store = useBuildingStore()
const { getLocalized, getLocalizedTag } = useLocalized()
const buildings = store.buildings

// Default to first two buildings
const selectedIdLeft = ref(buildings[0].id)
const selectedIdRight = ref(buildings.length > 1 ? buildings[1].id : buildings[0].id)

const leftBuilding = computed(() => buildings.find(b => b.id === selectedIdLeft.value) || buildings[0])
const rightBuilding = computed(() => buildings.find(b => b.id === selectedIdRight.value) || buildings[0])

const hoverSide = ref<string | null>(null)

// --- RADAR CHART LOGIC ---
// Metrics: Height, History, Innovation, Complexity, Aesthetics, Impact (6 pts hexagon for symmetry)
// User asked for 5 metrics, but hexagon (6) or pentagon (5) works. 
// "Points: 100,10 ... " in SVG template above is Hexagon. I added 'Impact' to make it 6 for symmetry on the code, 
// but user asked for 5. I'll adjust points for Pentagon if strict, but Hexagon is easier to align 2 columns.
// Let's stick to 6 for visual balance in split screen, or 5 if I calculate points.
// User requested: Height, History, Innovation, Complexity, Aesthetics. (5 metrics).
// I will recalculate points for Pentagon.

const metrics = ['height', 'history', 'innovation', 'complexity', 'aesthetics']

const getScore = (b: Building, metric: string): number => {
    // Deterministic Mock Scoring
    const id = b.id
    if (metric === 'height') {
        // Height 0-100 normalized (max ~300m excluding skytree outlier 634m -> cap at 100)
        return Math.min(100, (b.height || 30) / 2) // Rough scale
    }
    if (metric === 'history') {
        const age = 2025 - b.year
        return Math.min(100, age / 2)
    }
    if (metric === 'innovation') return (id * 17 + b.year) % 40 + 60 // 60-100
    if (metric === 'complexity') return (id * 23 + b.name.length) % 50 + 50
    if (metric === 'aesthetics') return (id * 31) % 40 + 60
    return 50
}

const calculatePolyPoints = (b: Building) => {
    // Canvas 240x240. Center 120,120. Max Radius 100.
    const radius = 100
    const angles = [-Math.PI/2, -Math.PI/10, 3*Math.PI/10, 7*Math.PI/10, 11*Math.PI/10] // Pentagon angles
    
    return metrics.map((m, i) => {
        const score = getScore(b, m)
        const r = (score / 100) * radius
        const x = 120 + r * Math.cos(angles[i])
        const y = 120 + r * Math.sin(angles[i])
        return `${x},${y}`
    }).join(' ')
}

const leftRadarPoints = computed(() => calculatePolyPoints(leftBuilding.value))
const rightRadarPoints = computed(() => calculatePolyPoints(rightBuilding.value))


// --- DATA SHEET ---
const comparisonFields = [
    { key: 'year', getter: (b: Building) => b.year },
    { key: 'architect', getter: (b: Building) => getLocalized(b, 'architect') },
    { key: 'material', getter: (b: Building) => b.materials?.[0] ? getLocalizedTag(b.materials[0]) : '-' },
    { key: 'height', getter: (b: Building) => b.height ? `${b.height}m` : '-' },
    { key: 'location', getter: (b: Building) => getLocalized(b, 'location') }
]

const getFieldValue = (b: Building, field: any) => field.getter(b)

</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

.font-mono {
    font-family: 'JetBrains Mono', monospace;
}

.dialogue-page {
    min-height: 100vh;
    background-color: #0a0a0a;
    color: #f0f0f0;
    padding-top: 60px; /* Navbar space */
    position: relative;
    overflow-x: hidden;
}

.split-container {
    display: flex;
    height: 60vh;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.split-col {
    flex: 1;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    
    &.left-col {
        border-right: 1px solid rgba(255,255,255,0.1);
    }
}

.selector-wrapper {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    
    &.right-align {
        left: auto;
        right: 20px;
        text-align: right;
    }
}

.minimal-select {
    background: transparent;
    color: #fff;
    border: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.2rem;
    cursor: pointer;
    outline: none;
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s;
    -webkit-appearance: none; 
    
    &:hover {
        border-bottom-color: #fff;
    }
    
    option {
        background: #000;
        color: #fff;
    }
}

.image-area {
    width: 100%;
    height: 100%;
    position: relative;
    filter: grayscale(100%);
    transition: filter 0.5s ease;
    
    &.is-color {
        filter: grayscale(0%);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.building-name {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 3rem;
    font-weight: 700;
    font-family: sans-serif; /* Large Sans-serif Title */
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    pointer-events: none;
    width: 100%;
}

.right-col .building-name {
    left: auto;
    right: 20px;
    text-align: right;
}

/* RADAR CHART */
/* RADAR CHART */
.radar-container {
    position: relative;
    width: 320px;
    height: 320px;
    margin: 40px auto 0; /* Centered below split */
    z-index: 20;
}

.radar-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.grid-line {
    fill: none;
    stroke: rgba(255,255,255,0.1);
    stroke-width: 1;
}

.axis-line {
    stroke: rgba(255,255,255,0.1);
    stroke-width: 1;
}

.radar-label {
    fill: #666;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
}

.radar-polygon {
    fill: rgba(255,255,255,0.1);
    stroke-width: 2;
    transition: all 0.5s ease;
}

.left-poly {
    stroke: #fff;
    fill: rgba(255,255,255,0.05);
}

.right-poly {
    stroke: #666;
    fill: rgba(100,100,100,0.1);
}

/* DATA SHEET */
.data-sheet {
    padding: 60px 0;
    max-width: 1000px;
    margin: 0 auto;
}

.sheet-row {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    font-size: 1.1rem;
    
    &:hover {
        background: rgba(255,255,255,0.02);
    }
}

.cell {
    flex: 1;
}

.left-cell {
    text-align: right;
    padding-right: 40px;
    color: #fff;
}

.right-cell {
    text-align: left;
    padding-left: 40px;
    color: #999; /* Right side standard color */
}

.center-label {
    flex: 0 0 160px;
    text-align: center;
    color: #444;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
    .split-container {
        flex-direction: column;
        height: auto;
    }
    .split-col {
        height: 300px;
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .radar-container {
        position: relative;
        top: 0;
        left: 0;
        transform: none;
        margin: -50px auto 0;
    }
}
</style>
