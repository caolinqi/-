<template>
  <div class="architect-detail-page">
    <div v-if="architect" class="content-container">
        
        <!-- HEADER HERO -->
        <div class="hero-section">
            <div class="hero-bg">
                <img :src="architect.image" :alt="getLocalized(architect, 'name')" />
                <div class="overlay"></div>
            </div>
            
            <div class="hero-content">
                <div class="avatar-circle">
                     <img :src="architect.image" />
                </div>
                <h1 class="arch-name">{{ getLocalized(architect, 'name') }}</h1>
                <div class="arch-years">
                    {{ architect.birthYear }} - {{ architect.deathYear || (locale === 'zh-CN' ? '至今' : 'PRESENT') }}
                </div>
            </div>
        </div>

        <!-- MAIN BODY -->
        <div class="main-grid">
            
            <!-- LEFT: BIO & INFO -->
            <div class="col-left">
                <div class="detail-card">
                    <h3 class="card-title">{{ locale === 'zh-CN' ? '生平' : 'BIOGRAPHY' }}</h3>
                    <div class="bio-text">
                        {{ getLocalized(architect, 'bio') }}
                    </div>
                </div>

                <div class="detail-card">
                    <h3 class="card-title">{{ locale === 'zh-CN' ? '主要成就' : 'ACHIEVEMENTS' }}</h3>
                    <ul class="achievements-list">
                         <li v-for="(ach, i) in (locale === 'zh-CN' ? architect.achievementsJa || architect.achievements : architect.achievements)" :key="i">
                            {{ ach }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- RIGHT: MASTERPIECES -->
            <div class="col-right">
                <div class="detail-card full-height">
                    <h3 class="card-title">{{ locale === 'zh-CN' ? '代表作品' : 'MASTERPIECES' }}</h3>
                    
                    <div v-if="masterpieces.length > 0" class="buildings-grid">
                        <div 
                            v-for="b in masterpieces" 
                            :key="b.id" 
                            class="building-card"
                            @click="router.push(`/building/${b.id}`)"
                        >
                            <div class="b-img">
                                <img :src="b.image" loading="lazy" />
                            </div>
                            <div class="b-info">
                                <div class="b-name">{{ getLocalized(b, 'name') }}</div>
                                <div class="b-year">{{ b.year }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="no-data">
                        {{ locale === 'zh-CN' ? '暂无收录作品' : 'No masterpieces recorded.' }}
                    </div>
                </div>
            </div>

        </div>

        <div class="footer-actions">
            <button class="back-btn" @click="router.back()">
                &larr; {{ locale === 'zh-CN' ? '返回' : 'BACK' }}
            </button>
        </div>

    </div>
    
    <div v-else class="loading-state">
        LOADING ARCHITECT DATABASE...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useLocalized } from '@/composables/useLocalized'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const store = useBuildingStore()
const { getLocalized } = useLocalized()
const { locale } = useI18n()

// Get ID from params
const architectId = computed(() => Number(route.params.id))

// Find architect in store
const architect = computed(() => {
    return store.architects.find(a => a.id === architectId.value)
})

// Find related buildings (Masterpieces)
const masterpieces = computed(() => {
    if (!architect.value || !architect.value.buildings) return []
    // store.buildings has all buildings.
    // architect.buildings is array of IDs.
    // We filter store.buildings where id is in architect.buildings
    
    // Note: architect.buildings might be strings or numbers depending on JSON parsing
    const relatedIds = architect.value.buildings.map((id: any) => Number(id))
    return store.buildings.filter(b => relatedIds.includes(b.id))
})

onMounted(() => {
    window.scrollTo(0, 0)
})
</script>

<style scoped lang="scss">
.architect-detail-page {
    min-height: 100vh;
    background: #0a0a0a;
    color: #fff;
    padding-top: 80px;
    font-family: 'Inter', sans-serif;
}

.content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 60px;
}

/* HERO */
.hero-section {
    position: relative;
    height: 350px;
    background: #000;
    margin-bottom: 40px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-bg {
    position: absolute; inset: 0;
    opacity: 0.3;
    img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); }
    .overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #0a0a0a); }
}

.hero-content {
    position: relative; z-index: 10;
    text-align: center;
    display: flex; flex-direction: column; align-items: center;
}

.avatar-circle {
    width: 120px; height: 120px; border-radius: 50%; border: 3px solid #fff;
    overflow: hidden; margin-bottom: 15px;
    box-shadow: 0 0 20px rgba(0,0,0,0.8);
    img { width: 100%; height: 100%; object-fit: cover; }
}

.arch-name {
    font-size: 2.5rem; font-weight: 900; letter-spacing: 1px; margin: 0;
    text-transform: uppercase;
}

.arch-years {
    font-family: 'JetBrains Mono', monospace; color: #888; margin-top: 5px;
}

/* GRID LAYOUT */
.main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 0 20px;
}

.detail-card {
    background: #111;
    border: 1px solid #333;
    padding: 30px;
    margin-bottom: 30px;
    
    &.full-height { height: 100%; }
}

.card-title {
    font-family: 'JetBrains Mono'; font-size: 0.9rem; color: #00ffcc;
    border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;
    letter-spacing: 2px;
}

.bio-text {
    line-height: 1.8; color: #ccc; font-size: 1rem;
    white-space: pre-line;
}

.achievements-list {
    list-style: none; padding: 0;
    li {
        margin-bottom: 10px; padding-left: 15px; position: relative; color: #ccc;
        &:before { content: '>'; color: #666; position: absolute; left: 0; }
    }
}

/* BUILDINGS / MASTERPIECES */
.buildings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.building-card {
    background: #000;
    border: 1px solid #222;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        border-color: #fff;
        transform: translateY(-2px);
    }
}

.b-img {
    height: 140px; overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(50%); transition: 0.3s; }
}
.building-card:hover .b-img img { filter: grayscale(0%); transform: scale(1.05); }

.b-info {
    padding: 10px;
}
.b-name { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: #eee; }
.b-year { font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #666; }

.no-data { color: #555; font-style: italic; text-align: center; padding: 20px; }

/* FOOTER */
.footer-actions {
    text-align: center; margin-top: 40px;
}
.back-btn {
    background: transparent; border: 1px solid #444; color: #fff;
    padding: 10px 30px; font-family: 'JetBrains Mono'; cursor: pointer;
    transition: 0.2s;
    &:hover { background: #fff; color: #000; }
}

.loading-state {
    display: flex; justify-content: center; align-items: center;
    height: 100vh; font-family: 'JetBrains Mono'; color: #666;
}

@media (max-width: 900px) {
    .main-grid { grid-template-columns: 1fr; }
}
</style>
