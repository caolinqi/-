<template>
  <div class="building-detail-page">
    <div v-if="building" class="detail-container">
      
      <!-- 1. HERO SECTION (Immersive) -->
      <div class="hero-section">
        <div class="hero-bg">
          <img :src="building.image" :alt="building.name" class="bg-img" />
          <div class="hero-overlay"></div>
        </div>
        
        <div class="hero-content">
          <div class="breadcrumbs">
            <span class="crumb" @click="$router.push('/')">ARCH-TRACE</span>
            <span class="sep">/</span>
            <span class="crumb active">ARCHIVE No.{{ padZero(building.id) }}</span>
          </div>
          
          <h1 class="hero-title">{{ getLocalized(building, 'name') }}</h1>
          <div class="hero-subtitle">{{ getLocalized(building, 'nameEn') }}</div>

          <div class="hero-meta">
             <div class="meta-item architect" @click="goToArchitect">
                <span class="label">{{ $t('building.architect') }}</span>
                <span class="value">{{ getLocalized(building, 'architect') }}</span>
             </div>
             <div class="meta-item">
                <span class="label">{{ $t('building.year') }}</span>
                <span class="value">{{ building.year }}</span>
             </div>
             <div class="meta-item">
                <span class="label">{{ $t('building.location') }}</span>
                <span class="value">{{ getLocalized(building, 'location') }}</span>
             </div>
          </div>
        </div>
      </div>

      <!-- 2. CONTENT BODY (Editorial Layout) -->
      <div class="content-body">
        
        <!-- LEFT: Tech Specs Sticky Panel -->
        <aside class="specs-sidebar">
            <div class="specs-card">
                <h3 class="specs-title">{{ $t('detail.specs') }}</h3>
                <div class="spec-list">
                    <div class="spec-row" v-if="building.height">
                        <span class="k">{{ $t('building.height') }}</span>
                        <span class="v code">{{ building.height }} M</span>
                    </div>
                     <div class="spec-row" v-if="building.area">
                        <span class="k">{{ $t('building.area') }}</span>
                        <span class="v code">{{ building.area.toLocaleString() }} m²</span>
                    </div>
                     <div class="spec-row">
                        <span class="k">{{ $t('building.category') }}</span>
                        <span class="v">{{ getLocalizedTag(building.category) }}</span>
                    </div>
                     <div class="spec-row">
                        <span class="k">{{ $t('building.style') }}</span>
                        <span class="v">{{ getLocalizedTag(building.style) }}</span>
                    </div>
                    <div class="spec-row materials">
                        <span class="k">{{ $t('building.materials') }}</span>
                        <div class="tags-wrap">
                            <span v-for="m in building.materials" :key="m" class="mat-tag">{{ m }}</span>
                        </div>
                    </div>
                </div>

                <div class="actions-group">
                    <button class="action-btn primary" @click="goToMap">
                        <EnvironmentOutlined /> {{ $t('nav.map') }}
                    </button>
                    <button class="action-btn secondary" @click="toggleFavorite">
                         <StarFilled v-if="isFavorite" class="starred"/>
                         <StarOutlined v-else />
                         {{ isFavorite ? $t('building.removeFromFavorites') : $t('building.addToFavorites') }}
                    </button>
                </div>
            </div>
        </aside>

        <!-- RIGHT: Encyclopedic Content -->
        <main class="main-article">
            <!-- Introduction -->
            <section class="article-section intro">
                <p class="lead-text">{{ getLocalized(building, 'description') }}</p>
            </section>

            <!-- Dynamic Tech Details -->
            <template v-if="building.techDetails">
                
                <!-- Background -->
                <section class="article-section">
                    <h2 class="section-header">
                        <span class="num">01</span> {{ $t('detail.sections.background') }}
                    </h2>
                    <div class="text-block">
                        <div class="sub-item" v-if="building.techDetails.background.reason">
                            <h4 class="sub-label">{{ $t('detail.labels.reason') }}</h4>
                            <p>{{ building.techDetails.background.reason }}</p>
                        </div>
                         <div class="sub-item">
                            <h4 class="sub-label">{{ $t('detail.labels.context') }}</h4>
                            <p>{{ building.techDetails.background.context }}</p>
                        </div>
                    </div>
                </section>

                <div class="divider"></div>

                <!-- Features -->
                <section class="article-section">
                     <h2 class="section-header">
                        <span class="num">02</span> {{ $t('detail.sections.features') }}
                    </h2>
                    <div class="text-block grid-2">
                        <div class="sub-item box">
                            <h4 class="sub-label">{{ $t('detail.labels.structure') }}</h4>
                            <p>{{ building.techDetails.features.structure }}</p>
                        </div>
                        <div class="sub-item box">
                            <h4 class="sub-label">{{ $t('detail.labels.space') }}</h4>
                            <p>{{ building.techDetails.features.space }}</p>
                        </div>
                         <div class="sub-item box full">
                            <h4 class="sub-label">{{ $t('detail.labels.innovation') }}</h4>
                            <p>{{ building.techDetails.features.innovation }}</p>
                        </div>
                    </div>
                </section>

                 <div class="divider"></div>

                <!-- Aesthetics -->
                <section class="article-section">
                     <h2 class="section-header">
                        <span class="num">03</span> {{ $t('detail.sections.aesthetics') }}
                    </h2>
                     <div class="text-block">
                        <div class="sub-item">
                             <h4 class="sub-label">{{ $t('detail.labels.exterior') }}</h4>
                             <p>{{ building.techDetails.aesthetics.exterior }}</p>
                        </div>
                         <div class="sub-item">
                             <h4 class="sub-label">{{ $t('detail.labels.details') }}</h4>
                             <p>{{ building.techDetails.aesthetics.details }}</p>
                        </div>
                    </div>
                </section>

                 <div class="divider"></div>

                <!-- Significance -->
                 <section class="article-section">
                     <h2 class="section-header">
                        <span class="num">04</span> {{ $t('detail.sections.significance') }}
                    </h2>
                     <div class="text-block highlight-block">
                         <p class="impact-text">{{ building.techDetails.significance.status }}</p>
                         <p class="sub-impact">{{ building.techDetails.significance.influence }}</p>
                    </div>
                </section>

            </template>

            <!-- Missing Data Fallback -->
            <div v-else class="missing-data-placeholder">
                <div class="placeholder-content">
                    <span class="icon">⚠️</span>
                    <h3>{{ $t('detail.missing') }}</h3>
                    <p>Arch-Trace protocols are currently gathering deep intelligence on this structure.</p>
                </div>
            </div>

        </main>
      </div>

      <!-- 3. FOOTER NAV -->
      <div class="detail-footer">
          <div class="nav-control prev" @click="goToPrev" :class="{ disabled: !hasPrev }">
              <span class="dir-icon">←</span>
              <span class="dir-text">{{ $t('detail.actions.prev') }}</span>
          </div>
          <div class="nav-control next" @click="goToNext" :class="{ disabled: !hasNext }">
              <span class="dir-text">{{ $t('detail.actions.next') }}</span>
              <span class="dir-icon">→</span>
          </div>
      </div>

    </div>

    <!-- 404 -->
    <div v-else class="not-found">
        <h1>404 // NOT FOUND</h1>
        <button @click="$router.push('/')">{{ $t('detail.actions.backToHome') }}</button>
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

const hasPrev = computed(() => store.getBuildingById(buildingId.value - 1));
const hasNext = computed(() => store.getBuildingById(buildingId.value + 1));

const padZero = (num: number) => num.toString().padStart(3, '0');

const toggleFavorite = () => store.toggleFavorite(buildingId.value);
const goToMap = () => router.push("/map");

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

const goToPrev = () => {
    if (hasPrev.value) router.push(`/building/${buildingId.value - 1}`);
}
const goToNext = () => {
    if (hasNext.value) router.push(`/building/${buildingId.value + 1}`);
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Noto+Serif+JP:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');

$c-bg: #030303;
$c-text: #e0e0e0;
$c-muted: #888;
$c-border: #222;
$c-accent: #00ffcc;

.building-detail-page {
  min-height: 100vh;
  background-color: $c-bg;
  color: $c-text;
  font-family: 'Inter', sans-serif;
}

.detail-container { width: 100%; }

/* HERO */
.hero-section {
    height: 70vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 60px 80px;
    border-bottom: 1px solid $c-border;
}

.hero-bg {
    position: absolute; inset: 0; z-index: 0;
    .bg-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
    .hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to right, rgba(3,3,3,0.9) 0%, rgba(3,3,3,0.4) 100%);
    }
}

.hero-content {
    position: relative; z-index: 10; max-width: 1200px;
}

.breadcrumbs {
    font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: $c-accent; margin-bottom: 20px;
    .sep { margin: 0 10px; color: #555; }
    .crumb.active { color: #fff; }
    .crumb:hover { text-decoration: underline; cursor: pointer; }
}

.hero-title {
    font-family: 'Noto Serif JP', serif;
    font-size: 4.5rem; color: #fff; font-weight: 900; margin: 0; line-height: 1.1;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.hero-subtitle {
    font-family: 'Inter', sans-serif; font-size: 2rem; color: #ccc; font-weight: 300; margin-bottom: 40px;
}

.hero-meta {
    display: flex; gap: 40px;
    .meta-item {
        border-left: 2px solid $c-accent; padding-left: 15px;
        &.architect { cursor: pointer; &:hover .value { color: $c-accent; } }
        .label { display: block; font-size: 0.7rem; color: $c-muted; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .value { font-size: 1.2rem; color: #fff; font-weight: bold; font-family: 'Noto Serif JP', serif; }
    }
}

/* CONTENT BODY */
.content-body {
    display: grid;
    grid-template-columns: 350px 1fr;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100vh;
}

/* SIDEBAR */
.specs-sidebar {
    padding: 60px 40px;
    border-right: 1px solid $c-border;
}
.specs-card { position: sticky; top: 100px; }
.specs-title { font-family: 'JetBrains Mono'; font-size: 0.9rem; color: $c-muted; margin-bottom: 30px; letter-spacing: 2px; }

.spec-list {
    display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px;
    .spec-row {
        .k { display: block; font-size: 0.75rem; color: #666; font-weight: bold; margin-bottom: 4px; }
        .v { font-size: 1rem; color: #fff; border-bottom: 1px solid #222; padding-bottom: 4px; display: block; }
        .v.code { font-family: 'JetBrains Mono'; color: $c-accent; }
        
        &.materials .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
        .mat-tag { background: #111; padding: 4px 8px; font-size: 0.8rem; border: 1px solid #333; color: #ccc; }
    }
}

.actions-group {
    display: flex; flex-direction: column; gap: 15px;
    .action-btn {
        width: 100%; padding: 12px; font-family: 'JetBrains Mono'; font-weight: bold; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s;
        &.primary { background: $c-accent; border: none; color: #000; &:hover { background: #fff; } }
        &.secondary { background: transparent; border: 1px solid #333; color: #fff; &:hover { border-color: #fff; } }
        .starred { color: gold; }
    }
}

/* MAIN ARTICLE */
.main-article {
    padding: 80px 100px;
}

.article-section {
    margin-bottom: 60px;
    &.intro { 
        margin-bottom: 80px; 
    }
}

.lead-text {
    font-family: 'Noto Serif JP', serif;
    font-size: 1.4rem;
    line-height: 2;
    color: #fff;
    border-left: 4px solid #333;
    padding-left: 30px;
}

.section-header {
    font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 30px;
    font-family: 'Inter', sans-serif; letter-spacing: -1px;
    display: flex; align-items: center; gap: 15px;
    .num { font-family: 'JetBrains Mono'; font-size: 1rem; color: $c-accent; border: 1px solid $c-accent; padding: 2px 6px; border-radius: 4px; }
}

.text-block {
    display: flex; flex-direction: column; gap: 30px;
    &.grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
    
    .sub-item {
        .sub-label { font-size: 0.85rem; color: $c-muted; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        p { font-family: 'Noto Serif JP', serif; font-size: 1.1rem; line-height: 1.8; color: #ccc; margin: 0; }
        
        &.box { background: #0a0a0a; padding: 25px; border: 1px solid #1a1a1a; p { font-size: 1rem; color: #bbb; } }
        &.full { grid-column: span 2; }
    }
    
    &.highlight-block {
        background: rgba(0,255,204,0.05); padding: 40px; border-left: 2px solid $c-accent;
        .impact-text { font-size: 1.4rem; color: #fff; margin-bottom: 15px; font-weight: bold; }
        .sub-impact { font-size: 1.1rem; color: $c-accent; }
    }
}

.divider { height: 1px; background: #222; margin: 60px 0; width: 100px; }

.missing-data-placeholder {
    padding: 60px; background: #080808; border: 1px dashed #333; text-align: center;
    .icon { font-size: 2rem; display: block; margin-bottom: 10px; }
    h3 { color: #666; margin-bottom: 5px; }
    p { color: #444; font-family: 'JetBrains Mono'; font-size: 0.8rem; }
}

/* FOOTER */
.detail-footer {
    display: flex; border-top: 1px solid $c-border;
    .nav-control {
        flex: 1; padding: 40px; background: #050505; cursor: pointer; transition: all 0.3s;
        display: flex; align-items: center; justify-content: center; gap: 20px;
        color: #666;
        
        &:hover:not(.disabled) { background: #111; color: #fff; }
        &.disabled { opacity: 0.3; cursor: not-allowed; }
        
        .dir-text { font-family: 'Noto Serif JP', serif; font-size: 1rem; font-weight: bold; }
        .dir-icon { font-family: 'Inter'; font-size: 1.5rem; }
    }
    .prev { border-right: 1px solid $c-border; }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    .content-body { grid-template-columns: 1fr; }
    .specs-sidebar { border-right: none; border-bottom: 1px solid $c-border; padding: 40px; }
    .specs-card { position: static; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .main-article { padding: 60px 40px; }
}
@media (max-width: 768px) {
    .hero-title { font-size: 2.5rem; }
    .hero-meta { flex-direction: column; gap: 20px; }
    .specs-card { grid-template-columns: 1fr; }
    .text-block.grid-2 { grid-template-columns: 1fr; .sub-item.full { grid-column: span 1; } }
}
</style>
