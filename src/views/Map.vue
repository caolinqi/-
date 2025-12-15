<template>
  <div class="map-page">
    
    <!-- Leaflet Map Container -->
    <div id="map" class="map-container"></div>

    <!-- Floating UI -->
    <div class="radar-overlay"></div>

    <!-- Layer Control (Custom) -->
    <div class="layer-control">
        <label class="layer-toggle">
            <input type="checkbox" v-model="layerFilter.official" />
            <span class="toggle-text">{{ $t('map.layerOfficial') }}</span>
        </label>
        <label class="layer-toggle">
            <input type="checkbox" v-model="layerFilter.custom" />
            <span class="toggle-text custom-text">{{ $t('map.layerCustom') }}</span>
        </label>
    </div>

    <!-- Sidebar -->
    <div class="floating-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">{{ $t('map.sidebarTitle') }}</h2>
        <div class="sidebar-count">{{ activeBuildings.length }} {{ $t('map.targetsDetected') }}</div>
        <div class="sidebar-instruction">{{ $t('map.instruction') }}</div>
      </div>
      
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="$t('map.searchPlaceholder')" 
          class="cyber-input"
        />
      </div>

      <div class="buildings-list">
        <div 
            v-for="(item, index) in filteredBuildings" 
            :key="item.id"
            class="list-item"
            :class="{ 'active': selectedIndex === index, 'is-custom': item.id < 0 }"
            @click="flyToBuilding(item)"
        >
          <div class="item-index">{{ item.id < 0 ? 'OP' : String(index + 1).padStart(2, '0') }}</div>
          <div class="item-info">
            <div class="item-name">{{ getLocalized(item, 'name') }}</div>
            <div class="item-meta">{{ getLocalized(item, 'architect') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL DRAWER -->
    <a-drawer
        :open="isDrawerOpen"
        placement="right"
        :closable="false"
        width="400"
        @close="closeDrawer"
        :mask="false"
        :zIndex="9999"
        :headerStyle="{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #333', color: '#fff' }"
        :bodyStyle="{ backgroundColor: '#0a0a0a', color: '#fff', padding: '0' }"
        rootClassName="brutalist-drawer-wrapper"
        class="brutalist-drawer"
    >
        <template #extra>
             <button class="custom-close-btn" @click="closeDrawer">×</button>
        </template>
        <template #title>
            <div class="drawer-title">{{ $t('map.drawerTitle') }} {{ selectedBuilding?.id }}</div>
        </template>
        
        <div v-if="selectedBuilding" class="drawer-content">
            <div class="drawer-img">
                <img :src="selectedBuilding.image" alt="Building" />
            </div>
            
            <div class="drawer-info">
                <h2 class="drawer-name">{{ getLocalized(selectedBuilding, 'name') }}</h2>
                <div class="drawer-meta">
                    <span>{{ $t('dialogue.fields.architect') }}: {{ getLocalized(selectedBuilding, 'architect') }}</span>
                    <span>{{ $t('dialogue.fields.year') }}: {{ selectedBuilding.year }}</span>
                </div>
                <div class="drawer-desc">
                    {{ getLocalized(selectedBuilding, 'description') }}
                </div>
            </div>

            <!-- Custom Operations -->
            <div v-if="isCustomBuilding(selectedBuilding)" class="drawer-actions">
                <div class="action-divider">{{ $t('map.opControl') }}</div>
                <button class="cyber-btn edit-btn" @click="editMarker">{{ $t('map.editRecord') }}</button>
                <button class="cyber-btn delete-btn" @click="deleteMarker">{{ $t('map.deleteSignal') }}</button>
            </div>
            
             <div class="drawer-footer">
                <RouterLink :to="`/building/${selectedBuilding.id}`" class="cyber-btn nav-btn">
                     > {{ $t('building.viewDetails') }}
                </RouterLink>
            </div>
        </div>
    </a-drawer>

    <!-- ADD/EDIT MODAL -->
    <a-modal
      v-model:visible="isModalOpen"
      :title="isEditing ? $t('map.modalTitleUpdate') : $t('map.modalTitleNew')"
      :footer="null"
      width="500px"
      class="brutalist-modal"
      @cancel="closeModal"
    >
      <a-form 
        :model="formState" 
        layout="vertical"
        class="brutalist-form"
        @finish="submitForm"
      >
        <a-form-item :label="$t('map.coordinates')" name="coords">
            <a-input v-model:value="coordsString" disabled class="coord-input" />
        </a-form-item>

        <a-form-item :label="$t('map.name')" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="formState.name" :placeholder="$t('map.name')" />
        </a-form-item>

        <a-form-item :label="$t('map.architectType')" name="architect">
          <a-input v-model:value="formState.architect" placeholder="e.g. Private Residence" />
        </a-form-item>
        
        <a-form-item :label="$t('map.description')" name="description">
          <a-textarea v-model:value="formState.description" :rows="3" :placeholder="$t('map.description')" />
        </a-form-item>

         <div class="form-actions">
           <button type="submit" class="submit-btn">{{ isEditing ? $t('map.submitUpdate') : $t('map.submitRegister') }}</button>
         </div>
      </a-form>
    </a-modal>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, watch } from "vue";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useLocalized } from "@/composables/useLocalized";
import { useI18n } from 'vue-i18n';
import type { Building } from "@/types";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal } from 'ant-design-vue';
import { RouterLink } from "vue-router";

const store = useBuildingStore();
const { getLocalized } = useLocalized();
const { t } = useI18n();

let map: L.Map | null = null;
let markers: L.Marker[] = [];

// -- State --
const selectedIndex = ref(-1);
const selectedBuilding = ref<Building | null>(null);
const searchQuery = ref("");
const layerFilter = reactive({ official: true, custom: true });

// -- Drawer/Modal State --
const isDrawerOpen = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const formState = reactive({
    id: 0,
    name: '',
    architect: '',
    description: '',
    year: new Date().getFullYear(),
    lat: 0,
    lng: 0,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000' // Default placeholder
});
const coordsString = computed(() => `${formState.lat.toFixed(4)}, ${formState.lng.toFixed(4)}`);

// -- Data Logic --
const activeBuildings = computed(() => {
    let list: Building[] = [];
    if (layerFilter.official) list = list.concat(store.buildings);
    if (layerFilter.custom) list = list.concat(store.userBuildings);
    return list;
});

const filteredBuildings = computed(() => {
  let base = activeBuildings.value;
  if (!searchQuery.value) return base;
  const q = searchQuery.value.toLowerCase();
  return base.filter(b => 
    getLocalized(b, 'name').toLowerCase().includes(q) || 
    getLocalized(b, 'architect').toLowerCase().includes(q)
  );
});

const isCustomBuilding = (b: Building) => b.id < 0;

// -- Map Logic --
onMounted(() => {
    initMap();
});

onUnmounted(() => {
    if(map) {
        map.remove();
        map = null;
    }
});

const initMap = () => {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([35.6812, 139.7671], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Context Menu for Right Click
    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
        openAddModal(e.latlng.lat, e.latlng.lng);
    });

    addMarkers();
};

const addMarkers = () => {
    if(!map) return;
    
    // Clear existing
    markers.forEach(m => m.remove());
    markers = [];

    filteredBuildings.value.forEach((b) => {
        const isCustom = isCustomBuilding(b);
        
        let html = '';
        if(isCustom) {
             html = `
                <div class="marker-dot custom"></div>
                <div class="marker-pulse custom"></div>
                <div class="marker-tooltip custom">OP: ${getLocalized(b, 'name')}</div>
            `;
        } else {
             html = `
                <div class="marker-dot"></div>
                <div class="marker-pulse"></div>
                <div class="marker-tooltip">${getLocalized(b, 'name')}</div>
            `;
        }

        const customIcon = L.divIcon({
            className: 'custom-marker-container',
            html: html,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([b.latitude, b.longitude], { icon: customIcon })
            .addTo(map!)
            .on('click', () => {
                selectBuilding(b);
            });

        markers.push(marker);
    });
};

const selectBuilding = (b: Building) => {
    selectedBuilding.value = b;
    isDrawerOpen.value = true;
    
    // Fly to
    if(map) {
        map.flyTo([b.latitude, b.longitude], 16, { duration: 1.0 });
    }
};

const flyToBuilding = (b: Building) => {
    selectBuilding(b);
};

// -- CRUD Logic --
const openAddModal = (lat: number, lng: number) => {
    isEditing.value = false;
    formState.id = 0;
    formState.name = '';
    formState.architect = '';
    formState.description = '';
    formState.lat = lat;
    formState.lng = lng;
    isModalOpen.value = true;
};

const submitForm = () => {
    const newB: Building = {
        id: isEditing.value ? formState.id : 0, // 0 triggers new ID gen in store
        name: formState.name,
        architect: formState.architect || 'Unknown',
        year: formState.year,
        location: 'Tokyo Field Record',
        description: formState.description,
        image: formState.image,
        tags: ['Field Record'],
        latitude: formState.lat,
        longitude: formState.lng,
        style: 'Observation',
        category: 'Custom'
    };

    if(isEditing.value) {
        store.updateBuilding(newB);
        // Update selected building ref to show changes immediately in drawer
        selectedBuilding.value = newB;
    } else {
        store.addBuilding(newB);
    }
    
    closeModal();
    addMarkers(); // Refresh map
};

const closeModal = () => {
    isModalOpen.value = false;
};

const closeDrawer = () => {
    isDrawerOpen.value = false;
};

const editMarker = () => {
    if(!selectedBuilding.value) return;
    isEditing.value = true;
    const b = selectedBuilding.value;
    formState.id = b.id;
    formState.name = b.name; // Keep as string, store handles simple strings
    formState.architect = b.architect;
    formState.description = b.description;
    formState.lat = b.latitude;
    formState.lng = b.longitude;
    isModalOpen.value = true;
    isDrawerOpen.value = false; // Close drawer to focus on modal
};

const deleteMarker = () => {
    if(!selectedBuilding.value) return;
    Modal.confirm({
        title: t('map.confirmDeleteTitle'),
        content: t('map.confirmDeleteContent'),
        okText: t('map.delete'),
        okType: 'danger',
        cancelText: t('map.cancel'),
        class: 'brutalist-modal',
        onOk() {
            store.deleteBuilding(selectedBuilding.value!.id);
            closeDrawer();
            addMarkers();
        }
    });
};


// Watchers
watch(filteredBuildings, () => {
    addMarkers();
});
</script>

<style lang="scss">
/* Leaflet Overrides */
.custom-marker-container {
    display: flex; 
    justify-content: center;
    align-items: center;
    
    .marker-dot {
        position: absolute; width: 8px; height: 8px; background: #fff;
        border-radius: 50%; box-shadow: 0 0 10px #fff; z-index: 2;
        &.custom { background: #ff3333; box-shadow: 0 0 10px #ff3333; }
    }

    .marker-pulse {
        position: absolute; width: 100%; height: 100%;
        border: 1px solid rgba(255,255,255,0.5); border-radius: 50%;
        animation: leaflet-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        opacity: 0;
        &.custom { border-color: #ff3333; }
    }
    
    .marker-tooltip {
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        background: #000; color: #fff; padding: 4px 8px;
        font-size: 0.7rem; font-family: 'JetBrains Mono', monospace;
        border: 1px solid #333; white-space: nowrap; opacity: 0; pointer-events: none;
        transition: opacity 0.2s; z-index: 10;
        &.custom { border-color: #ff3333; color: #ff3333; }
    }
    
    &:hover {
        .marker-dot { background: #00ff00; box-shadow: 0 0 15px #00ff00; }
        .marker-dot.custom { background: #ff0000; box-shadow: 0 0 15px #ff0000; }
        .marker-pulse { border-color: #00ff00; opacity: 1; }
        .marker-tooltip { opacity: 1; }
        z-index: 1000 !important;
    }
}
.brutalist-drawer .ant-drawer-content { background: #0a0a0a !important; color: #fff; border-left: 2px solid #333; }
.brutalist-drawer .ant-drawer-header { background: #000 !important; border-bottom: 2px solid #333 !important; padding: 20px; border-radius: 0; }
.brutalist-drawer .ant-drawer-title { color: #fff !important; font-family: 'JetBrains Mono'; text-transform: uppercase; letter-spacing: 0.05em; }
.brutalist-drawer .ant-drawer-close { color: #fff !important; }

.brutalist-modal .ant-modal-content { background: #000 !important; border: 2px solid #333; border-radius: 0 !important; box-shadow: 0 20px 50px rgba(0,0,0,0.9); }
.brutalist-modal .ant-modal-header { background: #000 !important; border-bottom: 2px solid #333 !important; border-radius: 0 !important; }
.brutalist-modal .ant-modal-title { color: #fff !important; font-family: 'JetBrains Mono'; text-transform: uppercase; }
.brutalist-modal .ant-modal-close { color: #fff !important; }

.brutalist-form .ant-form-item-label > label { color: #888 !important; font-family: 'JetBrains Mono'; font-size: 0.8rem; }
.brutalist-form .ant-input, .brutalist-form .ant-input-textarea { 
    background: #111 !important; border: 1px solid #333 !important; color: #fff !important; border-radius: 0 !important; font-family: 'JetBrains Mono';
    &:focus { border-color: #fff !important; box-shadow: none !important; }
}
</style>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400&display=swap');

.map-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

#map { width: 100%; height: 100%; background: #0a0a0a; }

.radar-overlay {
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0,0,0,0.6) 100%);
    pointer-events: none; z-index: 400;
}

.layer-control {
    position: absolute; bottom: 30px; left: 360px; z-index: 500;
    display: flex; gap: 20px;
    background: rgba(0,0,0,0.8); padding: 10px 20px; border: 1px solid #333; backdrop-filter: blur(5px);
}

.layer-toggle {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    .toggle-text { font-family: 'JetBrains Mono'; font-size: 0.8rem; color: #fff; }
    .custom-text { color: #ff3333; }
}

.floating-sidebar {
    position: absolute; top: 80px; left: 20px; width: 320px; height: calc(100vh - 120px);
    background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid #333;
    display: flex; flex-direction: column; z-index: 500;
}

.sidebar-header { padding: 20px; border-bottom: 1px solid #333; }
.sidebar-title { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 900; margin: 0; color: #fff; }
.sidebar-count { color: #00ff00; font-family: 'JetBrains Mono'; font-size: 0.7rem; margin-top: 5px; }
.sidebar-instruction { color: #555; font-family: 'JetBrains Mono'; font-size: 0.7rem; margin-top: 10px; border-top: 1px dashed #333; padding-top: 5px;}

.search-box { padding: 15px; border-bottom: 1px solid #333; }
.cyber-input {
    width: 100%; background: #111; border: 1px solid #333; color: #fff;
    padding: 10px; font-family: 'JetBrains Mono';
    &:focus { border-color: #fff; outline:none; }
}

.buildings-list { flex: 1; overflow-y: auto; }
.list-item {
    padding: 15px; border-bottom: 1px solid #222; cursor: pointer;
    display: flex; gap: 10px; transition: background 0.2s;
    &:hover, &.active { background: #111; border-left: 3px solid #fff; }
    &.is-custom { border-left-color: #ff3333; }
}
.item-index { font-family: 'JetBrains Mono'; color: #555; }
.item-name { font-weight: 700; font-size: 0.9rem; color: #eee; }
.item-meta { font-family: 'Noto Serif JP'; font-size: 0.8rem; color: #888; }

/* Drawer Content */
.drawer-title { font-weight: 900; letter-spacing: -0.02em; }
.drawer-content { display: flex; flex-direction: column; height: 100%; }
.drawer-img { width: 100%; height: 200px; margin-bottom: 20px; img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); }}
.drawer-info { padding-bottom: 20px; border-bottom: 1px solid #333; margin-bottom: 20px; }
.drawer-name { font-size: 2rem; font-weight: 900; line-height: 1; margin-bottom: 10px; color: #fff; text-transform: uppercase; }
.drawer-meta { display: flex; flex-direction: column; gap: 5px; font-family: 'JetBrains Mono'; font-size: 0.8rem; color: #888; margin-bottom: 20px; }
.drawer-desc { font-family: 'Noto Serif JP'; font-size: 1rem; color: #ccc; line-height: 1.6; }

.drawer-actions { margin-top: auto; }
.action-divider { font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #555; border-bottom: 1px solid #333; margin-bottom: 10px; }
.cyber-btn {
    width: 100%; padding: 12px; margin-bottom: 10px;
    font-family: 'JetBrains Mono'; font-weight: 700; cursor: pointer; border: 1px solid; transition: all 0.2s;
    &.edit-btn { background: transparent; color: #fff; border-color: #fff; &:hover { background: #fff; color: #000; } }
    &.delete-btn { background: transparent; color: #ff3333; border-color: #ff3333; &:hover { background: #ff3333; color: #fff; } }
}

.form-actions { display: flex; justify-content: flex-end; margin-top: 20px; }
.submit-btn {
    background: #fff; color: #000; border: none; padding: 10px 30px; font-family: 'JetBrains Mono'; font-weight: 900; cursor: pointer;
    &:hover { opacity: 0.8; }
}

/* Ant Drawer Overrides (Global) */
.brutalist-drawer-wrapper {
    .ant-drawer-content-wrapper {
        box-shadow: -10px 0 30px rgba(0,0,0,0.8);
    }
    .ant-drawer-content { 
        background-color: #0a0a0a !important; 
        color: #fff !important; 
        border-left: 1px solid #333;
    }
    .ant-drawer-header { 
        background-color: #000 !important; 
        border-bottom: 1px solid #333 !important; 
        padding-right: 50px; /* Space for close button */
        border-radius: 0;
    }
    .ant-drawer-title { 
        color: #fff !important; 
        font-family: 'JetBrains Mono'; 
        text-transform: uppercase; 
        letter-spacing: 0.05em; 
    }
    .ant-drawer-close { 
        display: none; /* Hide default if visible */
    }
    .ant-drawer-body {
        padding: 0; /* Reset padding for custom content */
        background: #0a0a0a;
    }
}

/* Custom Close Button */
.custom-close-btn {
    position: absolute;
    top: 65px; 
    right: 2px;
    background: transparent;
    border: 1px solid #555;
    color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 16px;
    line-height: 1;
    display: flex; justify-content: center; align-items: center;
    cursor: pointer;
    z-index: 2000; /* Ensure above header elements */
    font-family: 'JetBrains Mono';
    transition: all 0.2s;
    
    &:hover {
        background: #ff3333;
        border-color: #ff3333;
        transform: rotate(90deg);
    }
}

.drawer-footer {
    padding: 20px;
    margin-top: auto;
    border-top: 1px solid #333;
}

.nav-btn {
    display: block;
    text-align: center;
    background: #000;
    color: #fff;
    border-color: #333;
    text-decoration: none;
    &:hover {
        background: #fff;
        color: #000;
    }
}
</style>
