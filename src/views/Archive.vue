<template>
  <div class="archive-page font-mono">
    <div class="archive-container">
      
      <!-- HEADER -->
      <div class="archive-header">
        <div class="header-top">
           <h1 class="page-title">{{ $t('archive.title') }}</h1>
           <div class="record-stat">{{ $t('archive.totalRecords') }}: <span class="highlight">{{ filteredBuildings.length }}</span></div>
        </div>
        
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('archive.searchPlaceholder')" 
            class="search-input"
          />
        </div>
      </div>

      <!-- FILTER SYSTEM -->
      <div class="filter-system">
        <!-- Status Filter -->
        <div class="filter-row">
            <span class="filter-label">{{ $t('archive.filters.status') }}:</span>
            <div class="filter-tags">
                <span 
                    v-for="status in statusOptions" 
                    :key="status"
                    class="filter-tag"
                    :class="{ active: selectedStatus === status }"
                    @click="toggleStatus(status)"
                >
                    [{{ getLocalizedTag(status) }}]
                </span>
            </div>
        </div>

        <!-- Material Filter -->
        <div class="filter-row">
            <span class="filter-label">{{ $t('archive.filters.material') }}:</span>
            <div class="filter-tags">
                <span 
                    v-for="mat in materialOptions" 
                    :key="mat"
                    class="filter-tag"
                    :class="{ active: selectedMaterial === mat }"
                    @click="toggleMaterial(mat)"
                >
                    [{{ getLocalizedTag(mat) }}]
                </span>
            </div>
        </div>

        <!-- Era Filter (Century/Year Range) -->
        <div class="filter-row">
            <span class="filter-label">{{ $t('archive.filters.era') }}:</span>
            <div class="filter-tags">
                <span 
                    v-for="era in eraOptions" 
                    :key="era.label"
                    class="filter-tag"
                    :class="{ active: selectedEra === era.label }"
                    @click="toggleEra(era.label)"
                >
                    [{{ $t(`archive.era.${era.label}`) }}]
                </span>
            </div>
        </div>
      </div>

      <!-- DATA GRID -->
      <div class="data-grid-header">
        <div class="col-id">{{ $t('archive.columns.id') }}</div>
        <div class="col-name">{{ $t('archive.columns.name') }}</div>
        <div class="col-arch">{{ $t('archive.columns.architect') }}</div>
        <div class="col-year">{{ $t('archive.columns.year') }}</div>
        <div class="col-loc">{{ $t('archive.columns.location') }}</div>
        <div class="col-mat">{{ $t('archive.columns.material') }}</div>
      </div>

      <div class="data-grid-body">
        <div 
            v-for="building in filteredBuildings" 
            :key="building.id" 
            class="data-row"
            @mouseenter="hoverBuilding = building"
            @mouseleave="hoverBuilding = null"
            @mousemove="updateCursor"
            @click="$router.push(`/building/${building.id}`)"
        >
            <div class="col-id">{{ String(building.id).padStart(2, '0') }}</div>
            <div class="col-name">
                <span class="name-display">{{ getLocalized(building, 'name') }}</span>
            </div>
            <div class="col-arch">{{ getLocalized(building, 'architect') }}</div>
            <div class="col-year">{{ building.year }}</div>
            <div class="col-loc">{{ getLocalized(building, 'location') }}</div>
            <div class="col-mat">{{ (building.materials && building.materials[0]) ? getLocalizedTag(building.materials[0]) : '—' }}</div>
        </div>
      </div>

    </div>

    <!-- HOVER REVEAL -->
    <div 
        v-if="hoverBuilding" 
        class="hover-reveal"
        :style="{ top: cursorY + 'px', left: cursorX + 'px' }"
    >
        <div class="reveal-img-box">
            <img :src="hoverBuilding.image" :alt="hoverBuilding.name" />
            <div class="reveal-meta">
                <span class="reveal-id">ID: {{ String(hoverBuilding.id).padStart(2, '0') }}</span>
            </div>
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

// Filters
const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)
const selectedEra = ref<string | null>(null)
const selectedMaterial = ref<string | null>(null)

// Derived Options
const statusOptions = computed(() => {
    const statuses = new Set<string>()
    store.buildings.forEach(b => {
        if (b.status) statuses.add(b.status)
    })
    return Array.from(statuses).sort()
})

const eraOptions = [
    { label: 'Meiji', min: 1868, max: 1912 },
    { label: 'Taisho', min: 1912, max: 1926 },
    { label: 'Showa', min: 1926, max: 1989 },
    { label: 'Heisei', min: 1989, max: 2019 }
]

const materialOptions = computed(() => {
    const materials = new Set<string>()
    store.buildings.forEach(b => {
        if (b.materials) {
            b.materials.forEach(m => materials.add(m))
        }
    })
    return Array.from(materials).sort()
})

// Hover Logic
const hoverBuilding = ref<Building | null>(null)
const cursorX = ref(0)
const cursorY = ref(0)

const updateCursor = (e: MouseEvent) => {
    cursorX.value = e.clientX + 20
    cursorY.value = e.clientY + 20
}

const toggleStatus = (status: string) => {
    selectedStatus.value = selectedStatus.value === status ? null : status
}

const toggleEra = (era: string) => {
    selectedEra.value = selectedEra.value === era ? null : era
}

const toggleMaterial = (mat: string) => {
    selectedMaterial.value = selectedMaterial.value === mat ? null : mat
}

const filteredBuildings = computed(() => {
    let result = store.buildings

    // Filter by Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(b => 
            String(b.id).includes(query) ||
            b.name.toLowerCase().includes(query) ||
            (b.nameEn && b.nameEn.toLowerCase().includes(query)) ||
            b.architect.toLowerCase().includes(query)
        )
    }

    // Filter by Status
    // Filter by Status
    if (selectedStatus.value) {
        result = result.filter(b => b.status === selectedStatus.value)
    }

    // Filter by Era
    if (selectedEra.value) {
        const era = eraOptions.find(e => e.label === selectedEra.value)
        if (era) {
            result = result.filter(b => b.year >= era.min && b.year <= era.max)
        }
    }

    // Filter by Material
    if (selectedMaterial.value) {
        result = result.filter(b => b.materials && b.materials.includes(selectedMaterial.value!))
    }

    return result
})

</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

.font-mono {
    font-family: 'JetBrains Mono', monospace;
}

.archive-page {
    min-height: 100vh;
    background-color: #0a0a0a;
    color: #f0f0f0;
    padding: 80px 40px;
    box-sizing: border-box;
}

.archive-container {
    max-width: 1600px;
    margin: 0 auto;
}

/* Header */
.archive-header {
    margin-bottom: 60px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 40px;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
}

.page-title {
    font-size: 3rem; /* Large Bold */
    font-weight: 700;
    margin: 0;
    color: #fff;
    letter-spacing: -0.05em;
}

.record-stat {
    font-size: 1rem;
    color: #666;
}

.highlight {
    color: #fff;
    font-weight: 700;
}

.search-bar {
    width: 100%;
}

.search-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.5rem;
    padding: 12px 0;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
        border-bottom-color: #fff;
    }
    
    &::placeholder {
        color: #444;
    }
}

/* Filter System */
.filter-system {
    margin-bottom: 60px;
}

.filter-row {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    align-items: baseline;
}

.filter-label {
    min-width: 80px;
    color: #666;
    font-size: 0.9rem;
    font-weight: 700;
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.filter-tag {
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
    font-size: 0.9rem;
    user-select: none;

    &:hover {
        color: #fff;
    }

    &.active {
        background-color: #fff;
        color: #000;
        padding: 0 4px; /* Slight highlight style change */
    }
}

/* Data Grid */
.data-grid-header {
    display: grid;
    grid-template-columns: 80px 2fr 1.5fr 100px 1.5fr 1.5fr;
    gap: 20px;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: #666;
    font-size: 0.8rem;
    font-weight: 700;
}

.data-grid-body {
    /* Container for rows */
    display: block;
}

.data-row {
    display: grid;
    grid-template-columns: 80px 2fr 1.5fr 100px 1.5fr 1.5fr;
    gap: 20px;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #ccc;
    cursor: pointer;
    transition: background-color 0.2s;
    align-items: baseline;

    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
    }
}

.col-name {
    display: flex;
    flex-direction: column;
    
    .name-en {
        margin-bottom: 4px;
        color: #fff;
        font-weight: 700;
    }
    .name-jp {
        font-size: 0.8rem;
        color: #666;
    }
}

.col-arch, .col-year, .col-loc, .col-mat {
    font-size: 0.9rem;
}

/* Hover Reveal */
.hover-reveal {
    position: fixed;
    z-index: 9999;
    pointer-events: none; /* Ignore mouse interactions */
    transform: translate(0, 0); /* Position handled by top/left */
}

.reveal-img-box {
    width: 300px;
    height: 200px;
    background: #000;
    border: 1px solid #fff;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.reveal-meta {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 4px 8px;
    font-size: 0.8rem;
    font-family: 'JetBrains Mono', monospace;
    border-top: 1px solid #fff;
}

/* Responsive */
@media (max-width: 1024px) {
    .data-grid-header, .data-row {
        grid-template-columns: 60px 2fr 1fr 1fr; /* Hide Location/Mat on small */
    }
    .col-loc, .col-mat, .data-grid-header .col-loc, .data-grid-header .col-mat {
        display: none;
    }
}
</style>
