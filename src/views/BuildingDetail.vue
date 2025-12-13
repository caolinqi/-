<template>
  <div class="building-detail-page">
    <div v-if="building" class="detail-container">
      
      <!-- HERO SECTION -->
      <div class="hero-section">
        <div class="hero-image">
          <img :src="building.image" :alt="building.name" />
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title">{{ getLocalized(building, 'name') }}</h1>
            <div class="hero-architect">
                <span class="arch-name" @click="goToArchitect">
                    {{ building.architect }}
                </span>
                <button class="bookmark-btn" @click="toggleFavorite">
                    <StarFilled v-if="isFavorite" />
                    <StarOutlined v-else />
                </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SPEC SHEET (Data Grid) -->
      <div class="spec-sheet">
        <div class="spec-item">
            <span class="spec-label">YEAR</span>
            <span class="spec-value">{{ building.year }}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">LOCATION</span>
            <span class="spec-value">{{ getLocalized(building, 'location') }}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">STYLE</span>
            <span class="spec-value">{{ getLocalizedTag(building.style) }}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">CATEGORY</span>
            <span class="spec-value">{{ getLocalizedTag(building.category) }}</span>
        </div>
      </div>

      <!-- EDITORIAL BODY -->
      <div class="editorial-body">
        <p class="description-text">{{ getLocalized(building, 'description') }}</p>
        
        <div class="map-action">
            <button class="map-btn" @click="goToMap">
                <EnvironmentOutlined /> VIEW ON MAP
            </button>
        </div>
      </div>

    </div>

    <!-- 404 Section -->
    <div v-else class="not-found">
        <h1 class="not-found-title">ITEM NOT FOUND</h1>
        <button class="home-btn" @click="$router.push('/')">RETURN HOME</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { StarOutlined, StarFilled, EnvironmentOutlined } from "@ant-design/icons-vue";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useLocalized } from "@/composables/useLocalized";

const route = useRoute();
const router = useRouter();
const store = useBuildingStore();
const { getLocalized, getLocalizedTag } = useLocalized();

const buildingId = computed(() => parseInt(route.params.id as string));
const building = computed(() => store.getBuildingById(buildingId.value));
const isFavorite = computed(() => store.isFavorite(buildingId.value));

const toggleFavorite = () => {
  store.toggleFavorite(buildingId.value);
};

const goToMap = () => {
  router.push("/map");
};

const goToArchitect = () => {
  if (building.value) {
    const architect = store.architects.find((a) =>
      a.buildings.includes(building.value!.id)
    );
    if (architect) {
      router.push(`/architect/${architect.id}`);
    }
  }
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Noto+Serif+JP:wght@400;700&display=swap');

.building-detail-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
  padding-bottom: 80px;
}

.detail-container {
    width: 100%;
}

/* HERO */
.hero-section {
    width: 100%;
    height: 80vh;
    position: relative;
    overflow: hidden;
}

.hero-image {
    width: 100%;
    height: 100%;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%);
}

.hero-content {
    position: absolute;
    bottom: 60px;
    left: 60px;
    z-index: 10;
}

.hero-title {
    font-size: 6rem;
    font-weight: 900;
    color: #fff;
    line-height: 0.9;
    text-transform: uppercase;
    margin: 0 0 16px 0;
    max-width: 80%;
}

.hero-architect {
    display: flex;
    align-items: center;
    gap: 24px;
}

.arch-name {
    font-size: 1.5rem;
    font-weight: 400;
    color: #ccc;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: all 0.3s;
    
    &:hover {
        color: #fff;
        border-bottom-color: #fff;
    }
}

.bookmark-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s;
    padding: 0;
    
    &:hover {
        transform: scale(1.1);
    }
}

/* SPEC SHEET */
.spec-sheet {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0 60px;
}

.spec-item {
    padding: 24px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;

    &:last-child {
        border-right: none;
    }
}

.spec-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #666;
    letter-spacing: 0.1em;
}

.spec-value {
    font-family: 'Noto Serif JP', serif;
    font-size: 1.1rem;
    color: #fff;
}

/* EDITORIAL BODY */
.editorial-body {
    max-width: 800px; /* max-w-3xl */
    margin: 80px auto;
    padding: 0 24px;
    text-align: center;
}

.description-text {
    font-family: 'Noto Serif JP', serif;
    font-size: 1.25rem;
    line-height: 2; /* relaxed */
    color: #ccc;
    margin-bottom: 40px;
}

.map-action {
    margin-top: 40px;
}

.map-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 12px 24px;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: #fff;
        color: #000;
    }
}

/* NOT FOUND */
.not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.not-found-title {
    font-size: 2rem;
    font-weight: 900;
    color: #333;
    margin-bottom: 24px;
}

.home-btn {
    background: #fff;
    color: #000;
    border: none;
    padding: 12px 24px;
    font-weight: 700;
    cursor: pointer;
}

/* Responsive */
@media (max-width: 900px) {
    .hero-title {
        font-size: 3rem;
    }
    .hero-content {
        left: 24px;
        bottom: 40px;
    }
    .spec-sheet {
        grid-template-columns: repeat(2, 1fr);
        margin: 0;
        border-left: none;
        border-right: none;
    }
    .spec-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
}
</style>
