<template>
  <div class="tours-page">
    <div class="page-header">
      <h1 class="page-title">GUIDED TOURS</h1>
    </div>

    <!-- Tours List -->
    <div class="tours-list">
      <div 
        v-for="(tour, index) in presetTours" 
        :key="tour.id" 
        class="tour-row"
        @click="startTour(tour)"
      >
        <!-- Left: Cinematic Image -->
        <div class="tour-image-col">
           <div class="image-wrapper">
             <img :src="tour.coverImage" :alt="tour.name" loading="lazy" />
           </div>
        </div>

        <!-- Right: Content -->
        <div class="tour-content-col">
           <div class="tour-header">
             <span class="tour-number">{{ String(index + 1).padStart(2, '0') }}.</span>
             <h2 class="tour-name">{{ tour.name }}</h2>
           </div>

           <div class="tour-meta">
             <div class="meta-item">
               <ClockCircleOutlined /> {{ tour.duration }}
             </div>
             <div class="meta-item">
               <EnvironmentOutlined /> {{ tour.stops.length }} STOPS
             </div>
             <!-- Text only unesco if needed, or simple icon -->
             <div v-if="tour.hasUnesco" class="meta-item">
               UNESCO
             </div>
           </div>

           <p class="tour-description">{{ tour.description }}</p>

           <div class="tour-action">
             <span class="action-text">Explore Route &rarr;</span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/useBuildingStore'
import {
  ClockCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const store = useBuildingStore() // Keep for potential data access

interface Tour {
  id: number
  name: string
  description: string
  icon: string
  duration: string
  stops: number[]
  hasUnesco: boolean
  coverImage: string
}

// Preset Tours
const presetTours = computed<Tour[]>(() => [
  {
    id: 1,
    name: t('tours.tourList.1.name'),
    description: t('tours.tourList.1.description'),
    icon: '🏆',
    duration: '4-5H', 
    stops: [2, 3, 4, 5, 13], 
    hasUnesco: true,
    coverImage: 'https://picsum.photos/seed/unesco/800/400'
  },
  {
    id: 2,
    name: t('tours.tourList.2.name'),
    description: t('tours.tourList.2.description'),
    icon: '⛩️',
    duration: '3-4H',
    stops: [1, 2, 3, 4, 5], 
    hasUnesco: true,
    coverImage: 'https://picsum.photos/seed/traditional/800/400'
  },
  {
    id: 3,
    name: t('tours.tourList.3.name'),
    description: t('tours.tourList.3.description'),
    icon: '🏙️',
    duration: '5-6H',
    stops: [6, 7, 8, 9, 10, 11], 
    hasUnesco: false,
    coverImage: 'https://picsum.photos/seed/modern/800/400'
  },
  {
    id: 4,
    name: t('tours.tourList.4.name'),
    description: t('tours.tourList.4.description'),
    icon: '👨‍🎨',
    duration: '6-7H',
    stops: [7, 11, 12, 14, 15, 16],
    hasUnesco: false,
    coverImage: 'https://picsum.photos/seed/masters/800/400'
  },
  {
    id: 5,
    name: t('tours.tourList.5.name'),
    description: t('tours.tourList.5.description'),
    icon: '🗼',
    duration: '4-5H',
    stops: [6, 9, 10, 11, 19],
    hasUnesco: false,
    coverImage: 'https://picsum.photos/seed/tokyo/800/400'
  },
  {
    id: 6,
    name: t('tours.tourList.6.name'),
    description: t('tours.tourList.6.description'),
    icon: '🎋',
    duration: '5-6H',
    stops: [1, 3, 4, 5],
    hasUnesco: true,
    coverImage: 'https://picsum.photos/seed/kyoto/800/400'
  }
])

const startTour = (tour: Tour) => {
  router.push({
    name: 'Map',
    query: { tour: tour.id.toString() }
  })
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Noto+Serif+JP:wght@400;700&display=swap');

.tours-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
  padding-top: 64px;
}

.page-header {
  padding: 60px 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
}

.page-title {
  font-size: 5rem;
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: #fff;
  text-transform: uppercase;
  margin: 0;
}

.tours-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.tour-row {
  display: flex;
  margin-bottom: 80px;
  cursor: pointer;
  group: hover; /* ? */
  
  &:hover {
    .image-wrapper img {
      filter: grayscale(0%);
    }
    
    .action-text {
      text-decoration: underline;
    }
  }
}

.tour-image-col {
  width: 50%;
  padding-right: 40px;
}

.image-wrapper {
  width: 100%;
  aspect-ratio: 16/9; /* Cinematic wide */
  overflow: hidden;
  background: #111;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease;
  }
}

.tour-content-col {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tour-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.tour-number {
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255,255,255,0.2);
}

.tour-name {
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1;
  color: #fff;
  margin: 0;
}

.tour-meta {
  display: flex;
  gap: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #888;
  margin-bottom: 32px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.tour-description {
  font-family: 'Noto Serif JP', serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 40px;
  max-width: 90%;
}

.tour-action {
  margin-top: auto;
}

.action-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
}

/* Responsive */
@media (max-width: 900px) {
  .tour-row {
    flex-direction: column;
    margin-bottom: 60px;
  }
  .tour-image-col {
    width: 100%;
    padding-right: 0;
    margin-bottom: 24px;
  }
  .tour-content-col {
    width: 100%;
  }
  .image-wrapper {
    aspect-ratio: 21/9;
  }
  .tour-name {
    font-size: 2.5rem;
  }
}
</style>
