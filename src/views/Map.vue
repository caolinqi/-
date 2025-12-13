<template>
  <div class="map-page">
    
    <!-- Map Container (Full Screen) -->
    <div class="map-wrapper">
       <div id="amap-container" class="amap-container"></div>
       
       <!-- Dark Mode Filter Overlay (If CSS filter on container isn't enough, we might need a mix-blend-mode overlay, but user suggested filter) -->
    </div>

    <!-- Floating Sidebar -->
    <div class="floating-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">LOCATIONS</h2>
        <div class="sidebar-count">{{ store.buildings.length }} SITES</div>
      </div>
      
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="SEARCH..." 
          class="cyber-input"
        />
      </div>

      <div class="buildings-list">
        <div 
            v-for="(item, index) in filteredBuildings" 
            :key="item.id"
            class="list-item"
            :class="{ 'active': selectedIndex === index }"
            @click="flyToBuilding(item, index)"
        >
          <div class="item-index">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-meta">{{ item.architect }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, shallowRef } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useLocalized } from "@/composables/useLocalized";
import type { Building } from "@/types";

const store = useBuildingStore();
const { getLocalized } = useLocalized();
const loading = ref(true);
const selectedIndex = ref(-1);
const selectedBuilding = shallowRef<Building | null>(null);
const searchQuery = ref("");
let map: any = null;
let markers: any[] = [];
let infoWindow: any = null;
let AMap: any = null;

const AMAP_KEY = "04809df8a7a2d6374723d511b2dab5dd"; 

const filteredBuildings = computed(() => {
  if (!searchQuery.value) return store.buildings;
  const q = searchQuery.value.toLowerCase();
  return store.buildings.filter(b => 
    getLocalized(b, 'name').toLowerCase().includes(q) || 
    getLocalized(b, 'architect').toLowerCase().includes(q)
  );
});

onMounted(async () => {
  try {
    AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: "2.0",
      plugins: ["AMap.Marker", "AMap.InfoWindow", "AMap.ToolBar", "AMap.MoveAnimation"],
    });

    map = new AMap.Map("amap-container", {
      zoom: 11,
      center: [139.7671, 35.6812],
      viewMode: "3D",
      mapStyle: "amap://styles/grey", // Try to use grey or normal then filter
    });

    // Custom "Glow Dot" Marker
    const createMarkerContent = (isActive: boolean) => {
        const pulse = isActive ? 'animate-ping' : '';
        return `
        <div class="relative w-3 h-3 flex items-center justify-center cursor-pointer group">
             <div class="absolute w-full h-full rounded-full bg-white/30 ${pulse}"></div>
             <div style="
                width: 8px; 
                height: 8px; 
                background: ${isActive ? '#3b82f6' : '#fff'}; 
                border-radius: 50%;
                box-shadow: 0 0 10px ${isActive ? '20px rgba(59, 130, 246, 0.6)' : '8px rgba(255, 255, 255, 0.4)'};
                transition: all 0.3s;
            "></div>
        </div>
        `;
    };

    const addMarkers = () => {
        // Clear existing
        if(markers.length) map.remove(markers);
        markers = [];

        filteredBuildings.value.forEach((b, i) => {
            const marker = new AMap.Marker({
                position: [b.longitude, b.latitude],
                content: createMarkerContent(false),
                offset: new AMap.Pixel(-6, -6), // Center it
                extData: { id: b.id, index: i }
            });

            marker.on('click', () => {
                selectBuilding(b, i);
            });
            
            markers.push(marker);
            map.add(marker);
        });
    };

    addMarkers();
    
    watch(filteredBuildings, () => {
        addMarkers();
    });

    loading.value = false;

  } catch (error) {
    console.error("Map load failed", error);
    loading.value = false;
  }
});

const selectBuilding = (b: Building, index: number) => {
    selectedIndex.value = index;
    selectedBuilding.value = b;
    if(!map) return;

    map.setZoomAndCenter(15, [b.longitude, b.latitude], true, 800);
    
    // Update marker styles
    markers.forEach((m, i) => {
        const isActive = i === index;
        // Optimization: Dom't recreate content every time if possible, but AMap content string needs update
        // m.setContent(createMarkerContent(isActive)); 
        // Note: AMap marker content update might be expensive or glitchy if frequent.
        // For now, let's keep it simple CSS or accept re-render.
    });
};

const hoverBuilding = (index: number) => {
    // Optional hover logic
};

const closeDrawer = () => {
    selectedBuilding.value = null;
    selectedIndex.value = -1;
    if(map) map.setZoomAndCenter(11, [139.7671, 35.6812], true, 800);
};

const flyToBuilding = (b: Building, index: number) => {
    selectBuilding(b, index);
};

onUnmounted(() => {
    if(map) map.destroy();
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400&display=swap');

.map-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

.map-wrapper {
    width: 100%;
    height: 100%;
    /* The Cyberpunk Filter Hack */
    filter: grayscale(100%) invert(100%) contrast(90%);
}

.amap-container {
    width: 100%;
    height: 100%;
}

/* Floating Sidebar */
.floating-sidebar {
    position: absolute;
    top: 80px; /* Below Navbar */
    left: 20px;
    width: 300px;
    height: calc(100vh - 120px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.sidebar-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: 0.1em;
}

.sidebar-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #888;
}

.search-box {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cyber-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
        border-color: #fff;
    }
}

.buildings-list {
    flex: 1;
    overflow-y: auto;
    
    /* Custom Scrollbar */
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; }
    &::-webkit-scrollbar-track { background: transparent; }
}

.list-item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    &.active {
        background: #fff;
        
        .item-index, .item-name, .item-meta {
            color: #000;
        }
    }
}

.item-index {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #555;
    padding-top: 2px;
}

.item-info {
    flex: 1;
}

.item-name {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #eee;
    margin-bottom: 2px;
}

.item-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: #777;
}

.loading-overlay {
    position: absolute;
    inset: 0;
    background: #0a0a0a;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 2px solid #333;
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s infinite linear;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
