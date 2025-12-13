```
<template>
  <div class="home-page">
    <div class="main-container">
      
      <!-- Bento Hero Section -->
      <div class="bento-grid">
        <!-- Area 1: Main Title & Intro -->
        <div class="bento-item hero-text-area">
          <div class="hero-top-label">
            <span>JP / ARCH / 2.0</span>
            <span class="version-tag">V.24</span>
          </div>
          <h1 class="hero-title">
            JAPANESE<br>
            ARCHITECTURE
          </h1>
          <p class="hero-desc">{{ $t('home.subtitle') }}</p>
          
          <div class="hero-cta-group">
             <div class="cta-link" @click="$router.push('/timeline')">
               {{ $t('nav.timeline') }} <ArrowRightOutlined />
             </div>
          </div>
        </div>

        <!-- Area 2: Feature Image -->
        <div class="bento-item hero-image-area" @click="goToRandomBuilding">
          <img 
            :src="randomBuilding?.image" 
            class="brutalist-img" 
            alt="Featured"
          />
          <div class="overlay-label">{{ $t('home.featuredLabel') }}</div>
        </div>

        <!-- Area 3: Stats - Buildings -->
        <div class="bento-item stat-box">
          <div class="stat-val">{{ store.buildings.length }}</div>
          <div class="stat-label uppercase">{{ $t('home.stats.buildings') }}</div>
        </div>

        <!-- Area 4: Nav - Map -->
        <div class="bento-item nav-box map-box" @click="$router.push('/map')">
          <div class="map-bg"></div>
          <div class="map-overlay"></div>
          <EnvironmentOutlined class="nav-icon" />
          <span class="nav-text">{{ $t('nav.map') }}</span>
        </div>

        <!-- Area 5: Nav - Architects -->
        <div class="bento-item nav-box" @click="$router.push('/architect')">
          <UserOutlined class="nav-icon" />
          <span class="nav-text">{{ $t('nav.architects') }}</span>
        </div>
        
        <!-- Area 6: Stats - Architects (Merged or Separate? Let's keep grid tight) -->
        <!-- Let's reuse Stat box style for Arch count -->
         <div class="bento-item stat-box">
          <div class="stat-val">{{ store.architects.length }}</div>
          <div class="stat-label uppercase">{{ $t('home.stats.architects') }}</div>
        </div>
      </div>

      <!-- Quote Divider -->
      <div class="quote-stripe">
        <div class="quote-content">
          <span class="quote-symbol">"</span>
          <span class="quote-body">{{ getLocalized(currentQuote, 'text') }}</span>
          <span class="quote-author">— {{ getLocalized(currentQuote, 'author') }}</span>
        </div>
      </div>

      <!-- Featured Buildings List -->
      <div class="featured-list-section">
        <div class="section-header">
          <h2>{{ $t('home.selectedWorks') }}</h2>
          <div class="line"></div>
        </div>

        <div class="raw-grid">
          <div 
            v-for="building in featuredBuildings" 
            :key="building.id" 
            class="raw-card"
            @click="$router.push(`/building/${building.id}`)"
          >
            <div class="img-wrapper">
              <img :src="building.image" loading="lazy" />
            </div>
            <div class="card-meta">
              <div class="meta-row">
                <span class="b-name">{{ getLocalized(building, 'name') }}</span>
                <span class="b-year">{{ building.year }}</span>
              </div>
              <div class="meta-row sub">
                <span class="b-arch">{{ getLocalized(building, 'architect') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useLocalized } from "@/composables/useLocalized";
import { useRouter } from "vue-router";
import {
  EnvironmentOutlined,
  UserOutlined,
  ArrowRightOutlined
} from "@ant-design/icons-vue";

const store = useBuildingStore();
const { getLocalized } = useLocalized();
const router = useRouter();
const currentQuote = ref(store.getRandomQuote());

const featuredBuildings = computed(() => {
  return store.buildings.slice(0, 6); // Take 6 for a cleaner grid
});

const randomBuilding = computed(() => {
  if (store.buildings.length > 0) {
    // Just pick the first one or a random one for the hero image
    return store.buildings[Math.floor(Math.random() * store.buildings.length)];
  }
  return null;
});

const goToRandomBuilding = () => {
    if(randomBuilding.value) {
        router.push(`/building/${randomBuilding.value.id}`);
    }
}

const changeQuote = () => {
  currentQuote.value = store.getRandomQuote();
};

onMounted(() => {
  setInterval(() => {
    changeQuote();
  }, 10000); // Faster rotation
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Noto+Serif+JP:wght@400;700&display=swap');

.home-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
  padding: 40px; /* Outer frame padding */
  box-sizing: border-box;
}

.main-container {
  max-width: 1600px; /* Wider for Brutalist layout */
  margin: 0 auto;
}

/* Bento Grid System */
.bento-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 300px 200px;
  gap: 1px; /* The "border" effect */
  background-color: rgba(255, 255, 255, 0.2); /* Gap color acts as border */
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 60px;
}

.bento-item {
  background-color: #0a0a0a; /* Inner content bg */
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

/* Hero Text Area (Top Left) */
.hero-text-area {
  grid-column: 1 / 2;
  grid-row: 1 / 3; /* Spans full height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-top-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  opacity: 0.6;
}

.hero-title {
  font-size: 8rem;
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -4px;
  margin: 0;
  color: #fff;
  text-transform: uppercase;
  /* Brutalist Outline Text Effect Optional */
  /* -webkit-text-stroke: 1px #fff; color: transparent; */
}

.hero-desc {
  font-family: 'Noto Serif JP', serif;
  font-size: 1.2rem;
  max-width: 400px;
  opacity: 0.8;
  margin-top: 24px;
}

.hero-cta-group {
    margin-top: auto;
    padding-top: 32px;
}
.cta-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    border-bottom: 2px solid #fff;
    padding-bottom: 4px;
    transition: all 0.2s;

    &:hover {
        background: #fff;
        color: #000;
        padding: 4px;
        border-bottom: none;
    }
}

/* Hero Image Area (Top Right Span) */
.hero-image-area {
  grid-column: 2 / 4;
  grid-row: 1 / 2;
  padding: 0;
  cursor: pointer;
  
  &:hover .brutalist-img {
      filter: grayscale(0%);
      transform: scale(1.02);
  }
}

.brutalist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-label {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: #000;
    color: #fff;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: bold;
    border: 1px solid #fff;
}

/* Stat Boxes */
.stat-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .stat-val {
      font-size: 4rem;
      font-weight: 900;
      line-height: 1;
  }
  .stat-label {
      font-size: 12px;
      letter-spacing: 2px;
      opacity: 0.5;
      margin-top: 8px;
  }
}

/* Nav Boxes */
.nav-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    position: relative; /* Ensure relative for absolute children */
    z-index: 1;

    &:hover {
        background-color: #1a1a1a;
        
        .nav-icon {
            transform: scale(1.1);
        }
        
        /* Map specific hover */
        &.map-box .map-bg {
             transform: scale(1.1);
             opacity: 0.6;
        }
    }

    .nav-icon {
        font-size: 32px;
        align-self: flex-start;
        transition: transform 0.3s;
        z-index: 2; /* Above bg */
    }
    .nav-text {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        align-self: flex-end;
        z-index: 2; /* Above bg */
    }
}

.map-box {
    overflow: hidden; /* Contain the image */
}

.map-bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/tokyo_dark_map.png');
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    transition: all 0.5s ease;
    z-index: 0;
}

.map-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3); /* Subtle overlay */
    z-index: 1; /* Above bg, below content */
}

/* Quote Section */
.quote-stripe {
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    padding: 60px 0;
    margin-bottom: 80px;
    text-align: center;
}
.quote-content {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Noto Serif JP', serif;
}
.quote-symbol {
    display: block;
    font-size: 4rem;
    line-height: 0.5;
    margin-bottom: 20px;
    opacity: 0.3;
}
.quote-body {
    font-size: 1.5rem;
    line-height: 1.6;
    display: block;
    margin-bottom: 20px;
    letter-spacing: 0.05em; /* Increased letter-spacing */
}
.quote-author {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.6;
}

/* Featured List */
.featured-list-section {
    margin-bottom: 80px;
}
.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    
    .line {
        flex: 1;
        height: 1px;
        background: #333;
    }
}

.raw-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
}

.raw-card {
    cursor: pointer;
    
    &:hover {
        .img-wrapper img {
            filter: grayscale(0%);
            transform: scale(1.05); /* Added scale */
        }
        .b-name {
            text-decoration: underline;
            text-underline-offset: 4px;
        }
    }
}

.img-wrapper {
    width: 100%;
    aspect-ratio: 4/3;
    margin-bottom: 16px;
    border: 1px solid #333;
    overflow: hidden; /* Contain scale */
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        transition: all 0.5s ease; /* 500ms duration */
        display: block;
    }
}

.card-meta {
    font-family: 'Inter', sans-serif;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
    
    &.sub {
        opacity: 0.6;
        font-size: 0.9rem;
    }
}

.b-name {
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
}

.b-year {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .bento-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
    }
    .hero-text-area {
        grid-column: 1 / 3;
        grid-row: 1;
        min-height: 400px;
    }
    .hero-title {
        font-size: 4rem;
    }
    .hero-image-area {
        grid-column: 1 / 3;
        grid-row: 2;
        height: 300px;
    }
    /* Stats & Nav follow grid flow */
    .stat-box, .nav-box {
        height: 200px;
    }
    
    .raw-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .home-page {
        padding: 16px;
    }
    .bento-grid {
        grid-template-columns: 1fr;
    }
    .hero-text-area, .hero-image-area, .stat-box, .nav-box {
        grid-column: 1;
    }
    .hero-title {
        font-size: 3rem;
    }
    .raw-grid {
        grid-template-columns: 1fr;
    }
}
</style>
