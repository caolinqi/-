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

  // 从localStorage加载收藏列表
  const loadFavorites = () => {
    const saved = localStorage.getItem("japanese-architecture-favorites");
    if (saved) {
      favorites.value = JSON.parse(saved);
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
    return buildings.value.sort((a, b) => a.year - b.year);
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
  };
});
