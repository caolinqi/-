<template>
  <a-card
    class="building-card"
    :hoverable="true"
    @click="handleClick"
  >
    <template #cover>
      <div class="card-image-wrapper">
        <img :src="building.image" :alt="building.name" />
        <div class="card-overlay">
          <a-button
            type="primary"
            shape="circle"
            :icon="isFavorite ? h(StarFilled) : h(StarOutlined)"
            @click.stop="handleFavorite"
            class="favorite-btn"
          />
        </div>
      </div>
    </template>
    <a-card-meta>
      <template #title>
        <div class="card-title">
          <span :title="getLocalized(building, 'name')">{{ getLocalized(building, 'name') }}</span>
          <span class="card-year">{{ building.year }}</span>
        </div>
      </template>
      <template #description>
        <div class="card-info">
          <p class="card-architect">
            <UserOutlined />
            {{ getLocalized(building, 'architect') }}
          </p>
          <p class="card-location">
            <EnvironmentOutlined />
            {{ getLocalized(building, 'location') }}
          </p>
          <p class="card-style">{{ getLocalizedTag(building.style) }}</p>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n' // Remove legacy usage if not needed for other things
import { StarOutlined, StarFilled, UserOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/useUserStore'
import { useLocalized } from '@/composables/useLocalized'
import type { Building } from '@/types'

interface Props {
  building: Building
}

const props = defineProps<Props>()
const router = useRouter()
// const store = useBuildingStore() // Not needed for favorites
const userStore = useUserStore() // Use UserStore
// const { locale } = useI18n() 
const { getLocalized, getLocalizedTag } = useLocalized()

const isFavorite = computed(() => userStore.favorites.includes(props.building.id))


const handleClick = () => {
  router.push(`/building/${props.building.id}`)
}

const handleFavorite = () => {
  userStore.toggleFavorite(props.building.id)
}
</script>

<style scoped lang="scss">
.building-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .card-image-wrapper {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
      opacity: 0;
      transition: opacity 0.3s ease;

      .favorite-btn {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        color: #ff4d4f;

        &:hover {
          background: #fff;
        }
      }
    }

    &:hover .card-overlay {
      opacity: 1;
    }
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;

    .card-year {
      font-size: 14px;
      color: var(--ant-primary-color);
      font-weight: 500;
    }
  }

  .card-info {
    .card-architect,
    .card-location {
      margin: 4px 0;
      color: #666;
      font-size: 14px;

      .anticon {
        margin-right: 6px;
        color: var(--ant-primary-color);
      }
    }

    .card-style {
      margin-top: 8px;
      padding: 4px 12px;
      background: var(--bg-tertiary);
      border-radius: 4px;
      display: inline-block;
      font-size: 12px;
      color: var(--text-secondary);
      border: 1px solid var(--border-color-light);
    }
  }
}
</style>

