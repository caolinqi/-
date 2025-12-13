<template>
  <div class="building-filter">
    <a-button type="primary" @click="visible = true" class="filter-trigger" size="large">
      <FilterOutlined />
      {{ $t('common.filter') }}
      <a-badge v-if="activeFilterCount > 0" :count="activeFilterCount" :offset="[10, -5]" />
    </a-button>

    <a-drawer
      v-model:open="visible"
      :title="$t('common.filter')"
      placement="right"
      :width="400"
      @close="handleClose"
      class="filter-drawer"
    >
      <a-space direction="vertical" :size="24" style="width: 100%">
        <!-- 年代范围 -->
        <a-card :title="$t('building.year')" size="small" :bordered="false">
          <a-slider
            v-model:value="yearRange"
            range
            :min="minYear"
            :max="maxYear"
            :marks="yearMarks"
            :tooltip-visible="true"
            @change="handleFilterChange"
          />
          <div class="range-display">
            <a-tag color="blue">{{ yearRange[0] }}</a-tag>
            <span style="margin: 0 8px">-</span>
            <a-tag color="blue">{{ yearRange[1] }}</a-tag>
          </div>
        </a-card>

        <!-- 建筑风格 -->
        <a-card :title="$t('building.style')" size="small" :bordered="false">
          <a-checkbox-group 
            v-model:value="selectedStyles" 
            @change="handleFilterChange"
            style="width: 100%"
          >
            <a-row :gutter="[8, 8]">
              <a-col :span="12" v-for="style in availableStyles" :key="style">
                <a-checkbox :value="style">{{ style }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-card>

        <!-- 建筑类别 -->
        <a-card :title="$t('building.category')" size="small" :bordered="false">
          <a-checkbox-group 
            v-model:value="selectedCategories" 
            @change="handleFilterChange"
            style="width: 100%"
          >
            <a-row :gutter="[8, 8]">
              <a-col :span="12" v-for="category in availableCategories" :key="category">
                <a-checkbox :value="category">{{ category }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-card>

        <!-- 世界遗产 -->
        <a-card size="small" :bordered="false">
          <template #title>
            <span>🏆 {{ $t('building.unesco') }}</span>
          </template>
          <a-switch 
            v-model:checked="unescoOnly" 
            @change="handleFilterChange"
            checked-children="是"
            un-checked-children="否"
          />
        </a-card>

        <!-- 排序方式 -->
        <a-card :title="$t('common.sort')" size="small" :bordered="false">
          <a-select
            v-model:value="sortBy"
            style="width: 100%"
            size="large"
            @change="handleFilterChange"
          >
            <a-select-option value="year-asc">
              <CalendarOutlined /> {{ $t('building.year') }} ↑
            </a-select-option>
            <a-select-option value="year-desc">
              <CalendarOutlined /> {{ $t('building.year') }} ↓
            </a-select-option>
            <a-select-option value="name-asc">
              <SortAscendingOutlined /> 名称 A-Z
            </a-select-option>
            <a-select-option value="name-desc">
              <SortDescendingOutlined /> 名称 Z-A
            </a-select-option>
          </a-select>
        </a-card>

        <!-- 结果统计 -->
        <a-alert
          :message="`找到 ${filteredCount} 个建筑`"
          type="info"
          show-icon
        >
          <template #icon>
            <HomeOutlined />
          </template>
        </a-alert>
      </a-space>

      <!-- 底部操作 -->
      <template #footer>
        <a-space style="width: 100%; justify-content: space-between">
          <a-button @click="handleReset" size="large">
            <ReloadOutlined />
            {{ $t('common.reset') }}
          </a-button>
          <a-button type="primary" @click="handleApply" size="large">
            <CheckOutlined />
            应用筛选
          </a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  FilterOutlined, 
  CalendarOutlined, 
  SortAscendingOutlined,
  SortDescendingOutlined,
  HomeOutlined,
  ReloadOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'
import type { Building } from '@/types'

interface Props {
  buildings: Building[]
}

interface Emits {
  (e: 'filter', filters: FilterOptions): void
}

export interface FilterOptions {
  yearRange: [number, number]
  styles: string[]
  categories: string[]
  unescoOnly: boolean
  sortBy: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(false)

// 筛选条件
const yearRange = ref<[number, number]>([1600, 2024])
const selectedStyles = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const unescoOnly = ref(false)
const sortBy = ref('year-asc')

// 计算可用选项
const minYear = computed(() => {
  const years = props.buildings.map(b => b.year)
  return Math.min(...years, 1600)
})

const maxYear = computed(() => {
  const years = props.buildings.map(b => b.year)
  return Math.max(...years, 2024)
})

const yearMarks = computed(() => ({
  [minYear.value]: minYear.value.toString(),
  [maxYear.value]: maxYear.value.toString()
}))

const availableStyles = computed(() => {
  const styles = new Set(props.buildings.map(b => b.style))
  return Array.from(styles).sort()
})

const availableCategories = computed(() => {
  const categories = new Set(props.buildings.map(b => b.category))
  return Array.from(categories).sort()
})

// 激活的筛选器数量
const activeFilterCount = computed(() => {
  let count = 0
  if (yearRange.value[0] !== minYear.value || yearRange.value[1] !== maxYear.value) count++
  if (selectedStyles.value.length > 0) count++
  if (selectedCategories.value.length > 0) count++
  if (unescoOnly.value) count++
  return count
})

// 筛选后的数量
const filteredCount = computed(() => {
  return filterBuildings(props.buildings).length
})

// 筛选逻辑
const filterBuildings = (buildings: Building[]) => {
  let filtered = buildings

  // 年代筛选
  filtered = filtered.filter(b => 
    b.year >= yearRange.value[0] && b.year <= yearRange.value[1]
  )

  // 风格筛选
  if (selectedStyles.value.length > 0) {
    filtered = filtered.filter(b => selectedStyles.value.includes(b.style))
  }

  // 类别筛选
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(b => selectedCategories.value.includes(b.category))
  }

  // UNESCO筛选
  if (unescoOnly.value) {
    filtered = filtered.filter(b => b.unesco === true)
  }

  // 排序
  filtered = sortBuildings(filtered, sortBy.value)

  return filtered
}

// 排序逻辑
const sortBuildings = (buildings: Building[], sort: string) => {
  const sorted = [...buildings]
  
  switch (sort) {
    case 'year-asc':
      return sorted.sort((a, b) => a.year - b.year)
    case 'year-desc':
      return sorted.sort((a, b) => b.year - a.year)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sorted
  }
}

// 处理筛选变化
const handleFilterChange = () => {
  // 实时更新筛选结果
}

// 应用筛选
const handleApply = () => {
  emit('filter', {
    yearRange: yearRange.value,
    styles: selectedStyles.value,
    categories: selectedCategories.value,
    unescoOnly: unescoOnly.value,
    sortBy: sortBy.value
  })
  visible.value = false
}

// 重置筛选
const handleReset = () => {
  yearRange.value = [minYear.value, maxYear.value]
  selectedStyles.value = []
  selectedCategories.value = []
  unescoOnly.value = false
  sortBy.value = 'year-asc'
  handleApply()
}

// 关闭抽屉
const handleClose = () => {
  visible.value = false
}

// 初始化年代范围
watch(() => props.buildings, () => {
  if (yearRange.value[0] === 1600 && yearRange.value[1] === 2024) {
    yearRange.value = [minYear.value, maxYear.value]
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.building-filter {
  .filter-trigger {
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  .range-display {
    text-align: center;
    margin-top: 16px;
  }

  :deep(.ant-card) {
    background: var(--bg-secondary);
    border-radius: 12px;
    
    .ant-card-head {
      border-bottom: 1px solid var(--border-color);
      
      .ant-card-head-title {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
    
    .ant-card-body {
      padding: 16px;
    }
  }

  :deep(.ant-checkbox-wrapper) {
    color: var(--text-primary);
    margin: 0;
    
    &:hover {
      .ant-checkbox-inner {
        border-color: #667eea;
      }
    }
  }

  :deep(.ant-slider) {
    .ant-slider-track {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    .ant-slider-handle {
      border-color: #667eea;
      
      &:hover, &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.2);
      }
    }
  }

  :deep(.ant-select-selector) {
    border-radius: 8px !important;
  }

  :deep(.ant-switch-checked) {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
}

// 深色模式
[data-theme="dark"] {
  .building-filter {
    :deep(.ant-drawer-content) {
      background: var(--bg-primary);
    }

    :deep(.ant-drawer-header) {
      background: var(--bg-secondary);
      border-bottom-color: var(--border-color);

      .ant-drawer-title {
        color: var(--text-primary);
      }

      .ant-drawer-close {
        color: var(--text-primary);
      }
    }

    :deep(.ant-drawer-body) {
      background: var(--bg-primary);
    }

    :deep(.ant-drawer-footer) {
      background: var(--bg-secondary);
      border-top-color: var(--border-color);
    }
  }
}
</style>
