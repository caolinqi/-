<template>
  <div class="timeline-page">
    <div class="timeline-container">
      <!-- Add Building Button -->
      <div class="add-btn-container">
        <button class="add-btn" @click="isAddModalOpen = true">
          <span class="plus">+</span> 添加建筑
        </button>
      </div>
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

    <!-- ADD BUILDING MODAL (Ant Design) -->
    <a-modal
      v-model:open="isAddModalOpen"
      title="注册新建筑 / REGISTER NEW ARCHITECTURE"
      :footer="null"
      width="600px"
      class="brutalist-modal"
      @cancel="closeAddModal"
    >
      <a-form 
        :model="newBuildingForm" 
        layout="vertical"
        class="brutalist-form"
        @finish="submitNewBuilding"
      >
        <a-form-item label="名称 / NAME" name="name" :rules="[{ required: true, message: '请输入建筑名称' }]">
          <a-input v-model:value="newBuildingForm.name" placeholder="例如：中银胶囊塔 / Nakagin Capsule Tower" />
        </a-form-item>

        <a-row :gutter="16">
            <a-col :span="12">
                <a-form-item label="年份 / YEAR" name="year" :rules="[{ required: true, message: '请输入年份' }]">
                    <a-input-number v-model:value="newBuildingForm.year" style="width: 100%" placeholder="1972" />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="建筑师 / ARCHITECT" name="architect" :rules="[{ required: true, message: '请输入建筑师' }]">
                    <a-input v-model:value="newBuildingForm.architect" placeholder="黑川纪章 / Kisho Kurokawa" />
                </a-form-item>
            </a-col>
        </a-row>

        <a-form-item label="描述 / DESCRIPTION" name="description" :rules="[{ required: true, message: '请输入描述' }]">
          <a-textarea v-model:value="newBuildingForm.description" :rows="3" placeholder="简短的建筑描述..." />
        </a-form-item>

        <a-form-item label="图片来源 / IMAGE SOURCE">
             <a-radio-group v-model:value="imageSourceType" button-style="solid">
                <a-radio-button value="url">链接 (URL)</a-radio-button>
                <a-radio-button value="upload">上传 (Upload)</a-radio-button>
             </a-radio-group>
        </a-form-item>

        <a-form-item v-if="imageSourceType === 'url'" label="图片链接 / IMAGE URL" name="image">
           <a-input v-model:value="newBuildingForm.image" placeholder="https://..." />
        </a-form-item>

        <a-form-item v-else label="上传图片 / UPLOAD IMAGE">
            <a-upload
                name="file"
                :show-upload-list="false"
                :before-upload="handleFileUpload"
                accept="image/*"
            >
                <a-button class="upload-btn">
                     <span v-if="newBuildingForm.image && newBuildingForm.image.startsWith('data:')">✓ 图片已选择 (Image Selected)</span>
                     <span v-else>点击上传 (Click to Upload)</span>
                </a-button>
            </a-upload>
            <div v-if="newBuildingForm.image && newBuildingForm.image.startsWith('data:')" class="img-preview">
                <img :src="newBuildingForm.image" />
            </div>
        </a-form-item>

        <div class="form-actions">
           <a-button type="primary" html-type="submit" class="submit-ant-btn" :loading="uploading">
              确认上传 / CONFIRM UPLOAD
           </a-button>
        </div>

      </a-form>
    </a-modal>

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
  return store.buildingsByYear; 
});

// Add Building Logic
const isAddModalOpen = ref(false)
const imageSourceType = ref<'url' | 'upload'>('url')
const uploading = ref(false)

const newBuildingForm = ref({
  name: '',
  year: 1900,
  architect: '',
  description: '',
  image: ''
})

const closeAddModal = () => {
  isAddModalOpen.value = false
  // Reset form
  newBuildingForm.value = { name: '', year: 1900, architect: '', description: '', image: '' }
  imageSourceType.value = 'url'
}

const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        newBuildingForm.value.image = reader.result as string;
    };
    return false; // Prevent automatic upload
};

const submitNewBuilding = () => {
    const b: Building = {
        id: 0, // Assigned by store
        name: newBuildingForm.value.name,
        year: newBuildingForm.value.year,
        architect: newBuildingForm.value.architect,
        description: newBuildingForm.value.description,
        image: newBuildingForm.value.image || 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop', // Default placeholder
        location: 'Japan', // Default
        tags: ['Custom'],
        latitude: 35.6762,
        longitude: 139.6503,
        style: 'Contemporary',
        category: 'Modern'
    }
    store.addBuilding(b)
    closeAddModal()
}

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
    line-clamp: 3;
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

/* ADD BTN & MODAL */
.add-btn-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    padding: 0 40px;
}

.add-btn {
    background: #eee;
    color: #000;
    border: none;
    padding: 10px 20px;
    font-weight: 900;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
    
    &:hover {
        background: #fff;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255,255,255,0.2);
    }
    
    .plus { font-size: 1.2rem; }
}

</style>

<style lang="scss">
/* GLOBAL OVERRIDES FOR BRUTALIST ANT DESIGN */
.brutalist-modal .ant-modal-content {
    background-color: #000 !important;
    border: 1px solid #333;
    border-radius: 0 !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.brutalist-modal .ant-modal-header {
    background-color: #000 !important;
    border-bottom: 1px solid #333 !important;
}

.brutalist-modal .ant-modal-title {
    color: #fff !important;
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
}

.brutalist-modal .ant-modal-close {
    color: #fff !important;
}

.brutalist-form .ant-form-item-label > label {
    color: #888 !important;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
}

.brutalist-form .ant-input, 
.brutalist-form .ant-input-number,
.brutalist-form .ant-input-number-input,
.brutalist-form .ant-input-textarea {
    background-color: #111 !important;
    border: 1px solid #333 !important;
    color: #fff !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif;
}

.brutalist-form .ant-input:focus,
.brutalist-form .ant-input-number:focus {
    border-color: #fff !important;
    box-shadow: none !important;
}

.brutalist-form .ant-radio-button-wrapper {
    background: #111;
    border-color: #333;
    color: #888;
}

.brutalist-form .ant-radio-button-wrapper-checked {
    background: #fff !important;
    border-color: #fff !important;
    color: #000 !important;
}

.submit-ant-btn {
    width: 100%;
    height: 50px;
    background: #fff !important;
    border-color: #fff !important;
    color: #000 !important;
    font-weight: 900 !important;
    text-transform: uppercase;
    border-radius: 0 !important;
    
    &:hover {
        background: #ccc !important;
        border-color: #ccc !important;
    }
}

.upload-btn {
    background: #111 !important;
    border: 1px dashed #444 !important;
    color: #fff !important;
    width: 100%;
    height: 100px;
    border-radius: 0;
    
    &:hover {
        border-color: #fff !important;
    }
}

.img-preview {
    margin-top: 10px;
    height: 100px;
    width: 100px;
    overflow: hidden;
    border: 1px solid #333;
    img { width: 100%; height: 100%; object-fit: cover; }
}
</style>
