import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Building, Architect, Quote } from "@/types";
import { buildings as buildingsData } from "@/data/buildings";
import { architects as architectsData } from "@/data/architects";
import { quotes as quotesData } from "@/data/quotes";

export const useBuildingStore = defineStore("building", () => {
  // 状态
  const buildings = ref<Building[]>(buildingsData);
  const architects = ref<Architect[]>(architectsData);
  const quotes = ref<Quote[]>(quotesData);
  const favorites = ref<number[]>([]);
  const userBuildings = ref<Building[]>([]); // New custom buildings

  // 从localStorage加载收藏列表
  const loadFavorites = () => {
    const saved = localStorage.getItem("japanese-architecture-favorites");
    if (saved) {
      favorites.value = JSON.parse(saved);
    }

    // Load User Buildings
    const savedBuildings = localStorage.getItem("japanese-architecture-user-buildings");
    if (savedBuildings) {
      userBuildings.value = JSON.parse(savedBuildings);
    }
  };

  // 保存收藏列表到localStorage
  const saveFavorites = () => {
    localStorage.setItem(
      "japanese-architecture-favorites",
      JSON.stringify(favorites.value)
    );
  };

  // 初始化
  loadFavorites();

  // 计算属性
  const favoriteBuildings = computed(() => {
    return buildings.value.filter((building) =>
      favorites.value.includes(building.id)
    );
  });

  const buildingsByArchitect = computed(() => {
    return (architectId: number) => {
      const architect = architects.value.find((a) => a.id === architectId);
      if (!architect) return [];
      return buildings.value.filter((b) => architect.buildings.includes(b.id));
    };
  });

  const buildingsByYear = computed(() => {
    // Merge static and user buildings
    const all = [...buildings.value, ...userBuildings.value];
    // Sort Descending (Newest First)
    return all.sort((a, b) => b.year - a.year);
  });

  // 方法
  const toggleFavorite = (buildingId: number) => {
    const index = favorites.value.indexOf(buildingId);
    if (index > -1) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push(buildingId);
    }
    saveFavorites();
  };

  const isFavorite = (buildingId: number) => {
    return favorites.value.includes(buildingId);
  };

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

  const addBuilding = (newBuilding: Building) => {
    // Assign a new negative ID to avoid collision with static IDs (assuming static are positive)
    if (!newBuilding.id) {
      newBuilding.id = -(Date.now());
    }
    userBuildings.value.push(newBuilding);
    localStorage.setItem("japanese-architecture-user-buildings", JSON.stringify(userBuildings.value));
  };

  const updateBuilding = (updatedBuilding: Building) => {
    const index = userBuildings.value.findIndex(b => b.id === updatedBuilding.id);
    if (index !== -1) {
      userBuildings.value[index] = updatedBuilding;
      localStorage.setItem("japanese-architecture-user-buildings", JSON.stringify(userBuildings.value));
    }
  };

  const deleteBuilding = (id: number) => {
    const index = userBuildings.value.findIndex(b => b.id === id);
    if (index !== -1) {
      userBuildings.value.splice(index, 1);
      localStorage.setItem("japanese-architecture-user-buildings", JSON.stringify(userBuildings.value));
    }
  };

  return {
    buildings,
    architects,
    quotes,
    favorites,
    favoriteBuildings,
    buildingsByArchitect,
    buildingsByYear,
    toggleFavorite,
    isFavorite,
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
