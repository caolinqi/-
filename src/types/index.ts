/**
 * 建筑数据类型定义
 */
export interface Building {
  id: number
  name: string
  nameEn?: string
  nameJa?: string
  year: number
  architect: string
  architectEn?: string
  architectJa?: string
  location: string
  locationEn?: string
  locationJa?: string
  latitude: number
  longitude: number
  description: string
  descriptionEn?: string
  descriptionJa?: string
  image: string
  style: string
  category: string
  /** 可选：bilibili 视频ID（bvid），用于详情页播放介绍视频 */
  bvid?: string
  /** 可选：建筑高度（米） */
  height?: number
  /** 可选：建筑面积（平方米） */
  area?: number
  /** 可选：主要建筑材料 */
  materials?: string[]
  /** 可选：保存状态 */
  status?: string
  /** 可选：是否为世界遗产 */
  unesco?: boolean
  /** 可选：标签 */
  tags?: string[]
}

/**
 * 建筑师数据类型定义
 */
export interface Architect {
  id: number
  name: string
  nameEn?: string
  nameJa?: string
  birthYear: number
  deathYear?: number
  bio: string
  bioEn?: string
  bioJa?: string
  image: string
  buildings: number[] // 建筑ID数组
  achievements: string[]
  achievementsJa?: string[]
}

/**
 * 名言类型定义
 */
export interface Quote {
  text: string
  textEn?: string
  textJa?: string
  author: string
  authorEn?: string
  authorJa?: string
}

