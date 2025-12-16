<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel-slide">
      <button class="close-btn" @click="$emit('close')">×</button>
      
      <div class="modal-content" v-if="building">
        
        <!-- HEADER IMAGE -->
        <div class="header-image">
            <img :src="building.image" :alt="getLocalized(building, 'name')" />
            <div class="overlay"></div>
            <!-- Favorite Toggle -->
            <button class="favorite-btn" @click="handleToggleFavorite" :class="{ active: isFavorite }">
                {{ isFavorite ? '★' : '☆' }}
            </button>
            <div class="title-block">
                <span class="year-badge">{{ building.year }}</span>
                <h1 class="modal-title">{{ getLocalized(building, 'name') }}</h1>
                <p class="modal-subtitle">{{ getLocalized(building, 'category') }} · {{ getLocalized(building, 'location') }}</p>
            </div>
        </div>

        <!-- SCROLLABLE CONTENT -->
        <div class="scroll-body">
            <!-- MAIN DESCRIPTION -->
            <section class="desc-section">
                <p>{{ getLocalized(building, 'description') }}</p>
                <div class="tags-row">
                    <span v-for="tag in building.tags" :key="tag" class="tag-pill">
                        #{{ getLocalizedTag(tag) }}
                    </span>
                </div>
            </section>

            <!-- ARCHITECT PROFILE -->
            <section class="architect-section" v-if="architectData">
                <h3 class="section-title">THE ARCHITECT</h3>
                <div class="arch-card">
                    <div class="arch-avatar">
                        <img :src="architectData.image" :alt="getLocalized(architectData, 'name')" />
                    </div>
                    <div class="arch-info">
                        <h4 class="arch-name">{{ getLocalized(architectData, 'name') }}</h4>
                        <!-- Just showing short bio or a snippet -->
                        <p class="arch-bio">{{ getLocalized(architectData, 'bio') }}</p>
                    </div>
                </div>
            </section>

            <!-- FOOTER INFO -->
            <section class="meta-grid">
                <div class="meta-item">
                    <span class="label">STATUS</span>
                    <span class="value">{{ getLocalizedTag(building.status || 'Extant') }}</span>
                </div>
                <div class="meta-item">
                    <span class="label">HEIGHT</span>
                    <span class="value">{{ building.height ? building.height + 'm' : '-' }}</span>
                </div>
            </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Building, Architect } from '@/types'
import { useBuildingStore } from '@/stores/useBuildingStore'
import { useLocalized } from '@/composables/useLocalized'
import { useUserStore } from '@/stores/useUserStore'
import { message } from 'ant-design-vue'

const buildingStore = useBuildingStore()

const props = defineProps<{
    isOpen: boolean
    building: Building | null
}>()

defineEmits(['close'])

const { getLocalized, getLocalizedTag } = useLocalized()
const userStore = useUserStore()

// Favorite Logic
const isFavorite = computed(() => {
    if (!props.building) return false
    return userStore.favorites.includes(props.building.id)
})

const handleToggleFavorite = () => {
    if (!props.building) return
    userStore.toggleFavorite(props.building.id)
    if (isFavorite.value) {
        message.success('Added to Vault')
    } else {
        message.info('Removed from Vault')
    }
}

// Look up architect by name (Assuming exact match on localized name key or ID logic would be safer but name is what we have on building)
// Ideally building should store architectId. But currently it stores `architect` string.
// Let's try to find by string match.
const architectData = computed(() => {
    if (!props.building) return null
    return buildingStore.architects.find(a => a.name === props.building?.architect || a.nameEn === props.building?.architectEn)
})
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap');

.modal-backdrop {
    position: fixed;
    top: 80px; /* Respect Top Nav */
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    justify-content: flex-end; /* Align right for slide-over */
}

.modal-panel-slide {
    width: 600px;
    max-width: 90vw;
    height: 100%;
    background: #111;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
        background: #fff;
        color: #000;
    }
}

.modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header-image {
    height: 300px;
    position: relative;
    flex-shrink: 0;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, #111 0%, transparent 100%);
    }
}

.favorite-btn {
    position: absolute;
    top: 20px;
    right: 80px; /* Left of close button */
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover, &.active {
        background: #00ffcc;
        color: #000;
        border-color: #00ffcc;
    }
}

.title-block {
    position: absolute;
    bottom: 20px;
    left: 30px;
    right: 30px;
}

.year-badge {
    background: #fff;
    color: #000;
    padding: 2px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 0.8rem;
    margin-bottom: 8px;
    display: inline-block;
}

.modal-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 5px 0;
    text-transform: uppercase;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.modal-subtitle {
    font-family: 'Noto Serif JP', serif;
    font-style: italic;
    color: rgba(255,255,255,0.8);
    margin: 0;
}

.scroll-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
}

.desc-section {
    margin-bottom: 40px;
    
    p {
        font-size: 1rem;
        line-height: 1.8;
        color: #ccc;
        margin-bottom: 20px;
    }
}

.tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag-pill {
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px 12px;
    font-size: 0.8rem;
    color: #888;
    border-radius: 99px;
    font-family: 'JetBrains Mono', monospace;
}

.architect-section {
    margin-bottom: 40px;
    border: 1px solid rgba(255,255,255,0.1);
    background: #151515;
    padding: 20px;
}

.section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 20px;
    letter-spacing: 2px;
}

.arch-card {
    display: flex;
    gap: 20px;
    align-items: center;
}

.arch-avatar {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    filter: grayscale(100%);
    border: 2px solid #333;
    
    img { width: 100%; height: 100%; object-fit: cover; }
}

.arch-name {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    color: #fff;
}

.arch-bio {
    font-size: 0.85rem;
    color: #888;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    border-top: 1px solid #222;
    padding-top: 30px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    
    .label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: #555;
        margin-bottom: 5px;
    }
    .value {
        font-size: 1rem;
        color: #ddd;
    }
}

@media (max-width: 768px) {
    .modal-panel-slide {
        width: 100%;
        max-width: 100%;
    }
    .header-image { height: 250px; }
}
</style>
