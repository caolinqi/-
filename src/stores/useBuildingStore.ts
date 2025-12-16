import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Building, Architect, Quote } from "@/types";
import { getBuildings } from "@/api/building";
import { getArchitects } from "@/api/architect";
import { getQuotes } from "@/api/quote";




export const useBuildingStore = defineStore("building", () => {
  // 状态
  const buildings = ref<Building[]>([]);
  const architects = ref<Architect[]>([]);
  const quotes = ref<Quote[]>([]);
  const favorites = ref<number[]>([]);

  // Actions
  const fetchBuildings = async () => {
    try {
      const res = await getBuildings();
      if (res.data) {
        buildings.value = res.data;
      }
    } catch (error) {
      console.error("Failed to fetch buildings:", error);
    }
  }

  const fetchArchitects = async () => {
    try {
      const res = await getArchitects();
      if (res.data) {
        architects.value = res.data;
      }
    } catch (error) {
      console.error("Failed to fetch architects:", error);
    }
  }

  const fetchQuotes = async () => {
    try {
      const res = await getQuotes();
      if (res.data) {
        quotes.value = res.data;
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    }
  }

  // 初始化
  fetchBuildings();
  fetchArchitects();
  fetchQuotes();
  // fetchFavorites(); // Managed by useUserStore

  // 计算属性
  const favoriteBuildings = computed(() => {
    // Only works if favorites state is kept here, but we are removing it.
    // Actually, let's keep favorites as empty array or remove it.
    // If other components use store.favoriteBuildings, they will break.
    // Does Map use it? No.
    // Does Timeline use it? Maybe. 
    return [];
  });

  // Compatibility: "User Buildings" are those with category 'Custom' or specific tag
  // This allows Map.vue to still filter layers if needed
  const userBuildings = computed(() => {
    return buildings.value.filter(b => b.category === 'Custom' || (b.tags && b.tags.includes('Custom')));
  });

  const buildingsByArchitect = computed(() => {
    return (architectId: number) => {
      const architect = architects.value.find((a) => a.id === architectId);
      if (!architect) return [];
      // Handle both integer ID arrays and potentially relation objects if backend changes, but for now it's just IDs
      // Backend 'buildings' is stored as JSON array of INTs.
      return buildings.value.filter((b) => architect.buildings.includes(b.id));
    };
  });

  const buildingsByYear = computed(() => {
    // buildings.value now contains ALL buildings (fetched from DB)
    return [...buildings.value].sort((a, b) => b.year - a.year);
  });

  // 方法
  // removed toggleFavorite to avoid confusion. Use useUserStore.
  // const toggleFavorite = async (buildingId: number) => { // Moved to useUserStore
  //   const isFav = favorites.value.includes(buildingId);

  //   // Optimistic Update
  //   if (isFav) {
  //     favorites.value = favorites.value.filter(id => id !== buildingId);
  //     try {
  //       await removeFavorite(buildingId);
  //     } catch (e) {
  //       favorites.value.push(buildingId); // Rollback
  //     }
  //   } else {
  //     favorites.value.push(buildingId);
  //     try {
  //       await addFavorite(buildingId);
  //     } catch (e) {
  //       favorites.value = favorites.value.filter(id => id !== buildingId); // Rollback
  //     }
  //   }
  // };

  // const isFavorite = (buildingId: number) => { // Moved to useUserStore
  //   return favorites.value.includes(buildingId);
  // };

  const getBuildingById = (id: number) => {
    return buildings.value.find((b) => b.id === id);
  };

  const getArchitectById = (id: number) => {
    return architects.value.find((a) => a.id === id);
  };

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.value.length);
    return quotes.value[randomIndex];
  };

  const addBuilding = async (newBuilding: Partial<Building>) => {
    try {
      const { createBuilding } = await import("@/api/building");
      const res = await createBuilding(newBuilding);
      if (res.code === 200 && res.data) {
        buildings.value.push(res.data);
        // Re-fetch to be safe? No, just push is faster.
      }
    } catch (e) {
      console.error("Failed to create building", e);
    }
  };

  const updateBuilding = async (updatedBuilding: Building) => {
    try {
      const { updateBuilding } = await import("@/api/building");
      const res = await updateBuilding(updatedBuilding.id, updatedBuilding);
      if (res.code === 200 && res.data) {
        const index = buildings.value.findIndex(b => b.id === updatedBuilding.id);
        if (index !== -1) {
          buildings.value[index] = res.data;
        }
      }
    } catch (e) {
      console.error("Failed to update building", e);
    }
  };

  const deleteBuilding = async (id: number) => {
    try {
      const { deleteBuilding } = await import("@/api/building");
      const res = await deleteBuilding(id);
      if (res.code === 200) {
        const index = buildings.value.findIndex(b => b.id === id);
        if (index !== -1) {
          buildings.value.splice(index, 1);
        }
      }
    } catch (e) {
      console.error("Failed to delete building", e);
    }
  };

  return {
    buildings,
    architects,
    quotes,
    favorites,
    fetchBuildings,
    fetchArchitects,
    favoriteBuildings,
    buildingsByArchitect,
    buildingsByYear,
    getBuildingById,
    getArchitectById,
    getRandomQuote,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    userBuildings
  };
});
// End of store
