<template>
  <div class="timeline-page">
    <div class="timeline-container">
      
      <!-- List of events sorted by year -->
      <div 
        v-for="building in sortedBuildings" 
        :key="building.id" 
        class="timeline-row"
        @click="openDetail(building)"
      >
        <!-- Left: Massive Sticky Year -->
        <div class="year-col">
          <div class="sticky-year">{{ building.year }}</div>
        </div>

        <!-- Right: Content Card -->
        <div class="content-col">
          <div class="content-wrapper">
             <div class="img-box">
               <img :src="building.image" :alt="building.name" loading="lazy" />
             </div>
             <div class="text-box">
               <h3 class="b-title">{{ getLocalized(building, 'name') }}</h3>
               <span class="b-arch">{{ getLocalized(building, 'architect') }}</span>
               <div class="b-desc-preview">{{ getLocalized(building, 'description') }}</div>
             </div>
          </div>
        </div>
      </div>

    </div>

    <!-- DETAIL MODAL -->
    <BuildingModal 
      :is-open="isModalOpen" 
      :building="selectedBuilding" 
      @close="closeDetail"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { useLocalized } from '@/composables/useLocalized';
import type { Building } from '@/types';
import BuildingModal from '@/components/ui/BuildingModal.vue';

const store = useBuildingStore();
const { getLocalized } = useLocalized();

const sortedBuildings = computed(() => {
  return [...store.buildings].sort((a, b) => a.year - b.year);
});

// Modal Logic
const isModalOpen = ref(false)
const selectedBuilding = ref<Building | null>(null)

const openDetail = (building: Building) => {
    selectedBuilding.value = building
    isModalOpen.value = true
}

const closeDetail = () => {
    isModalOpen.value = false
    // Clear selection after animation for smooth exit? 
    // Or clear immediately, let's keep it simple.
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Noto+Serif+JP:wght@400;700&display=swap');

.timeline-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
  padding-top: 80px; /* Nav spacing */
}

.timeline-container {
    max-width: 1400px; /* Standard width */
    margin: 0 auto;
}

.timeline-row {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 300px; /* Give it space */
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: #111;
        
        .img-box img {
            filter: grayscale(0%);
            transform: scale(1.05);
        }
        
        .b-title {
            color: #fff;
            text-decoration: underline;
            text-decoration-color: rgba(255,255,255,0.3);
            text-underline-offset: 4px;
        }
    }
}

/* Left Column: 30% Sticky Year */
.year-col {
    width: 30%;
    position: relative;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sticky-year {
    position: sticky;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8rem;
    font-weight: 900;
    color: #fff;
    opacity: 0.2;
    text-align: center;
    line-height: 1;
    pointer-events: none;
    font-variant-numeric: tabular-nums;
}

/* Right Column: 70% Content */
.content-col {
    width: 70%;
    padding: 40px;
    display: flex;
    align-items: center;
}

.content-wrapper {
    display: flex;
    width: 100%;
    gap: 40px;
}

.img-box {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
    background: #222;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        transition: all 0.5s ease;
        display: block;
    }
}

.text-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.b-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    color: #eee;
    transition: color 0.3s;
}

.b-arch {
    font-family: 'Noto Serif JP', serif;
    font-size: 1.1rem;
    color: #888;
    margin-bottom: 16px;
    font-style: italic;
}

.b-desc-preview {
    font-family: 'Noto Serif JP', serif;
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Responsive */
@media (max-width: 900px) {
    .timeline-row {
        flex-direction: column;
        border-right: none;
        min-height: auto;
    }
    .year-col {
        width: 100%;
        height: 100px;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .sticky-year {
        font-size: 4rem;
        top: 20px;
        transform: none;
    }
    .content-col {
        width: 100%;
        padding: 24px;
    }
    .content-wrapper {
        flex-direction: column;
        gap: 24px;
    }
    .img-box {
        width: 100%;
        height: 200px;
    }
}
</style>
