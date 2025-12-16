<template>
  <div class="profile-page">
    <div class="profile-container">
      
      <!-- HEADER ROW (ID + RADAR) -->
      <div class="top-row">
          
          <!-- ID CARD (Top Left) -->
          <div class="bento-card id-card">
              <div class="id-header">{{ $t('profile.header') }}</div>
              <div class="id-content">
                  <div class="avatar-frame">
                      <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" class="avatar-img" />
                      <div v-else class="avatar-placeholder">{{ userStore.user?.username?.charAt(0) }}</div>
                  </div>
                  <div class="user-details">
                      <h1 class="username">{{ userStore.user?.username || 'UNKNOWN' }}</h1>
                      <div class="user-level-row">
                          <span class="label">{{ $t('learning.level') }}:</span>
                          <span class="value">{{ gameStore.userLevel }} ({{ $t(gameStore.userTitleKey) }})</span>
                      </div>
                      <!-- XP Progress Bar -->
                      <div class="level-progress-container" :title="`${gameStore.currentExp % 1000} / 1000 XP`">
                          <div class="level-progress-bar" :style="{ width: `${(gameStore.currentExp % 1000) / 10}%` }"></div>
                      </div>

                      <div class="detail-row">
                          <span class="label">{{ $t('profile.memberSince') }}:</span>
                          <span class="value">2025</span>
                      </div>
                      <div class="greeting-row">{{ greetingMessage }}</div>

                      <div class="status-badge">{{ $t('profile.statusActive') }}</div>
                      <div class="user-bio" v-if="userStore.user?.bio">
                          "{{ userStore.user.bio }}"
                      </div>
                  </div>
              </div>
          </div>

          <!-- RADAR STATS (Top Right) -->
          <div class="bento-card stats-card">
              <div class="card-label">{{ $t('profile.attributeAnalysis') }}</div>
              <div class="radar-wrapper">
                <svg viewBox="0 0 100 100" class="radar-svg">
                    <polygon points="50,10 90,40 75,90 25,90 10,40" class="radar-bg-grid" />
                    <polygon points="50,30 70,45 62,70 38,70 30,45" class="radar-bg-grid inner" />
                    <polygon :points="radarPoints" class="radar-shape" />
                    <line x1="50" y1="50" x2="50" y2="10" class="axis-line" />
                    <line x1="50" y1="50" x2="90" y2="40" class="axis-line" />
                    <line x1="50" y1="50" x2="75" y2="90" class="axis-line" />
                    <line x1="50" y1="50" x2="25" y2="90" class="axis-line" />
                    <line x1="50" y1="50" x2="10" y2="40" class="axis-line" />
                </svg>
                <div class="stat-label top">{{ $t('profile.stats.str') }}</div>
                <div class="stat-label right-top">{{ $t('profile.stats.his') }}</div>
                <div class="stat-label right-bot">{{ $t('profile.stats.obs') }}</div>
                <div class="stat-label left-bot">{{ $t('profile.stats.mat') }}</div>
                <div class="stat-label left-top">{{ $t('profile.stats.aes') }}</div>
              </div>
          </div>

      </div>

      <!-- MIDDLE ROW (VAULT) -->
      <div class="bento-card vault-card">
          <div class="card-header-row">
              <div class="card-label">{{ $t('profile.savedBlueprints') }}</div>
              <div class="vault-count">{{ favoriteItems.length }} {{ $t('common.items') }}</div>
          </div>
          
          <div class="vault-grid" v-if="favoriteItems.length > 0">
              <div v-for="item in favoriteItems" :key="item.id" class="blueprint-item">
                  <div class="bp-icon">📐</div>
                  <div class="bp-id">ID-{{ item.id }}</div>
                  <div class="bp-name">{{ item.name }}</div>
              </div>
          </div>
          <div v-else class="empty-vault">
              <p>{{ $t('profile.noFavorites') }}</p>
              <div style="font-size: 0.8rem; margin-top: 5px; color: #444;">{{ dailyQuote }}</div>
              <router-link to="/archive" class="archive-btn">{{ $t('profile.visitArchive') }}</router-link>
          </div>
      </div>

      <!-- BOTTOM ROW (ACHIEVEMENTS + OPS) -->
      <div class="bottom-row">
          
          <!-- ACHIEVEMENT WALL (Bottom Left) -->
          <div class="bento-card achievement-card">
              <div class="card-label">{{ $t('profile.honors') }}</div>
              <div class="badges-scroll">
                  <div v-for="badge in gameStore.earnedBadges" :key="badge.id" class="badge-item">
                      <div class="badge-icon">
                           <span v-if="badge.id.includes('novice')">🔨</span>
                           <span v-else-if="badge.id.includes('quiz')">🎓</span>
                           <span v-else-if="badge.id.includes('material')">🧱</span>
                           <span v-else-if="badge.id.includes('historian')">📜</span>
                           <span v-else-if="badge.id.includes('visionary')">👁️</span>
                           <span v-else>🏆</span>
                      </div>
                      <div class="badge-name">{{ badge.name }}</div>
                  </div>
                  <div v-if="gameStore.earnedBadges.length === 0" class="no-badges">
                      {{ $t('profile.awaitingMerits') }}
                  </div>
              </div>
          </div>

          <!-- SYSTEM OPS (Bottom Right) -->
          <div class="bento-card ops-card">
              <div class="card-label">{{ $t('profile.systemOps') }}</div>
              <div class="ops-list">
                  <button class="ops-btn" @click="openEditModal">{{ $t('profile.editProfile') }}</button>
                  <button class="ops-btn" @click="openPwModal">{{ $t('profile.changePassword') }}</button>
                  <button class="ops-btn logout-btn" @click="handleLogout">{{ $t('profile.logout') }}</button>
              </div>
          </div>

      </div>

    </div>

    <!-- MODAL: EDIT PROFILE -->
    <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-window">
            <div class="modal-header">
                <h2>{{ $t('profile.editProfile') }}</h2>
                <button class="close-btn" @click="closeEditModal">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>CODENAME</label>
                    <input v-model="editForm.name" type="text" maxlength="12" />
                </div>
                <!-- Avatar selection could go here but let's keep it simple for v1 style -->
                <!-- We'll just allow basic bio editing -->
                <div class="form-group">
                    <label>BIO</label>
                    <textarea v-model="editForm.bio" rows="3"></textarea>
                </div>
                <div class="form-group avatar-upload-group">
                     <label>AVATAR IMAGE</label>
                    <div class="modal-avatar-preview" @click="triggerFileInput">
                        <img v-if="editForm.avatar || userStore.user?.avatar" :src="editForm.avatar || userStore.user?.avatar" />
                        <div v-else class="placeholder">?</div>
                        <div class="overlay">CHANGE IMAGE</div>
                    </div>
                    <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none" />
                    <small style="color: #666; font-size: 0.6rem; margin-top: 5px;">Click image to upload new avatar</small>
                </div>
            </div>
            <div class="modal-footer">
                <button class="primary-btn" @click="saveProfile">COMMIT</button>
            </div>
        </div>
    </div>

    <!-- MODAL: CHANGE PASSWORD -->
    <div v-if="showPwModal" class="modal-overlay">
        <div class="modal-window">
             <div class="modal-header">
                <h2>{{ $t('profile.changePassword') }}</h2>
                <button class="close-btn" @click="closePwModal">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>CURRENT_KEY</label>
                    <input v-model="pwForm.old" type="password" />
                </div>
                <div class="form-group">
                    <label>NEW_KEY</label>
                    <input v-model="pwForm.new" type="password" />
                </div>
                <div class="form-group">
                    <label>CONFIRM_KEY</label>
                    <input v-model="pwForm.confirm" type="password" />
                </div>
            </div>
             <div class="modal-footer">
                <button class="primary-btn" @click="savePassword">UPDATE_KEY</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useGameStore } from '@/stores/useGameStore'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import { buildings } from '@/data/buildings'
import { architects } from '@/data/architects'

const userStore = useUserStore()
const gameStore = useGameStore()
const router = useRouter()

// --- COMPUTED FEATURES ---

// Dynamic Favorites
const favoriteItems = computed(() => {
    return buildings.filter(b => userStore.favorites.includes(b.id))
})

// Time-based Greeting
const greetingMessage = computed(() => {
    const hour = new Date().getHours()
    if(hour < 12) return 'GOOD MORNING, ARCHITECT.'
    if(hour < 18) return 'GOOD AFTERNOON, ARCHITECT.'
    return 'GOOD EVENING, ARCHITECT.'
})

// Daily Quote (Random)
const dailyQuote = computed(() => {
    // Determine a "random" index based on date so it persists for the day? 
    // Or just random for fun on reload. Let's do random for variety.
    const randomIndex = Math.floor(Math.random() * architects.length)
    const architect = architects[randomIndex]
    return `"${architect.bio}" — ${architect.name}` 
})

// --- STATE ---
const showEditModal = ref(false)
const showPwModal = ref(false)

const editForm = reactive({
    name: '',
    bio: '',
    avatar: ''
})
const fileInput = ref<HTMLInputElement | null>(null)

const pwForm = reactive({
    old: '',
    new: '',
    confirm: ''
})

// --- ACTIONS ---
const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}

const openEditModal = () => {
    editForm.name = userStore.user?.username || ''
    editForm.bio = userStore.user?.bio || ''
    editForm.avatar = '' 
    showEditModal.value = true
}
const triggerFileInput = () => {
    fileInput.value?.click()
}
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                editForm.avatar = e.target.result as string
            }
        }
        reader.readAsDataURL(file)
    }
}

const closeEditModal = () => showEditModal.value = false

const saveProfile = () => {
    if(!editForm.name) return message.error('Name cannot be empty')
    
    userStore.updateProfile({ 
        name: editForm.name, 
        bio: editForm.bio, 
        avatar: editForm.avatar // Pass the base64 string if present
    })
    message.success('PROFILE UPDATED')
    closeEditModal()
}

const openPwModal = () => {
    pwForm.old = ''
    pwForm.new = ''
    pwForm.confirm = ''
    showPwModal.value = true
}
const closePwModal = () => showPwModal.value = false

const savePassword = async () => {
    if(!pwForm.old || !pwForm.new) return message.error('Fields cannot be empty')
    if(pwForm.new !== pwForm.confirm) return message.error('Passwords do not match')
    
    try {
        await userStore.changePassword(pwForm.old, pwForm.new)
        message.success('PASSWORD UPDATED - PLEASE RELOGIN')
        closePwModal()
        // Force Logout
        handleLogout()
    } catch(e: any) {
        message.error(e.message || 'UPDATE FAILED')
    }
}


// Radar Chart (Reused Logic)
const radarPoints = computed(() => {
    const stats = gameStore.userStats
    const c = 50
    const r = 40
    
    // 5 Axis: Structure, History, Observation, Material, Aesthetic
    const mapVal = (v: number) => v / 100
    
    const sStructure = mapVal(stats.structure)
    const sHistory = mapVal(stats.history)
    const sObservation = mapVal(stats.observation)
    const sMaterial = mapVal(stats.material)
    const sAesthetic = mapVal(stats.aesthetic)

    const getX = (angle: number, val: number) => c + Math.cos(angle * Math.PI / 180) * (r * val)
    const getY = (angle: number, val: number) => c + Math.sin(angle * Math.PI / 180) * (r * val)

    // Rotated -90 start
    const p1 = `${getX(-90, sStructure)},${getY(-90, sStructure)}`
    const p2 = `${getX(-18, sHistory)},${getY(-18, sHistory)}`
    const p3 = `${getX(54, sObservation)},${getY(54, sObservation)}`
    const p4 = `${getX(126, sMaterial)},${getY(126, sMaterial)}`
    const p5 = `${getX(198, sAesthetic)},${getY(198, sAesthetic)}`

    return `${p1} ${p2} ${p3} ${p4} ${p5}`
})
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

.profile-page {
    min-height: 100vh;
    padding-top: 80px; /* Navbar space */
    padding-bottom: 40px;
    background: #050505;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    background-image: radial-gradient(circle at 50% 50%, #111 0%, #050505 100%);
}

.profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* CARDS */
.bento-card {
    background: #0a0a0a;
    border: 1px solid #333;
    padding: 24px;
    position: relative;
    transition: all 0.3s;
    
    &:hover {
        border-color: #555;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
}

.card-label {
    font-size: 0.7rem;
    color: #666;
    letter-spacing: 2px;
    margin-bottom: 16px;
    text-transform: uppercase;
}

/* TOP ROW */
.top-row {
    display: grid;
    grid-template-columns: 2fr 1fr; /* ID wider than Radar */
    gap: 20px;
    height: 300px;
}

/* ID CARD */
.id-card {
    display: flex;
    flex-direction: column;
}

.id-header {
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 0.7rem;
    color: #00ffcc;
    letter-spacing: 2px;
}

.id-content {
    display: flex;
    gap: 30px;
    align-items: center;
}

.avatar-frame {
    width: 100px;
    height: 100px;
    border: 2px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #111;
    border-radius: 50%; /* Ensuring circle for avatar */
    
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder { font-size: 3rem; font-weight: 700; color: #333; }
}

.user-details {
    flex: 1;
}

.username {
    font-size: 2rem;
    margin: 0 0 5px 0;
    text-transform: uppercase;
}
.user-bio {
    margin-top: 10px;
    font-size: 0.8rem;
    color: #aaa;
    font-style: italic;
    border-left: 2px solid #00ffcc;
    padding-left: 10px;
    max-width: 300px;
}

.detail-row {
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #888;
    
    .label { margin-right: 10px; color: #555; }

    .value { color: #fff; }
}

.level-progress-container {
    width: 100%;
    height: 4px;
    background: #222;
    margin-bottom: 2px;
    overflow: hidden;
}
.level-progress-bar {
    height: 100%;
    background: #00ffcc;
    transition: width 0.5s ease;
}

.greeting-row {
    font-size: 0.7rem;
    color: #666;
    margin-top: 5px;
    letter-spacing: 1px;
}

.status-badge {
    display: inline-block;
    margin-top: 10px;
    padding: 4px 8px;
    background: rgba(0, 255, 204, 0.1);
    color: #00ffcc;
    font-size: 0.7rem;
    border: 1px solid #00ffcc;
}

/* RADAR CARD */
.stats-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.radar-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
}

.radar-svg {
    width: 100%; height: 100%;
    .radar-bg-grid { fill: none; stroke: #333; stroke-width: 0.5; }
    .inner { stroke: #222; stroke-dasharray: 2 2; }
    .axis-line { stroke: #222; stroke-width: 0.5; }
    .radar-shape {
        fill: rgba(0, 255, 204, 0.2);
        stroke: #00ffcc;
        stroke-width: 1;
    }
}

.stat-label {
    position: absolute;
    font-size: 0.6rem;
    color: #555;
    &.top { top: -15px; left: 50%; transform: translateX(-50%); }
    &.right-top { top: 20px; right: -20px; }
    &.right-bot { bottom: 20px; right: -20px; }
    &.left-bot { bottom: 20px; left: -20px; }
    &.left-top { top: 20px; left: -20px; }
}

/* MIDDLE ROW */
.vault-card {
    height: 200px;
    display: flex;
    flex-direction: column;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
}

.vault-count { color: #00ffcc; font-size: 0.8rem; }

.vault-grid {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding: 10px 0;
    
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-track { background: #111; }
    &::-webkit-scrollbar-thumb { background: #333; }
}

.blueprint-item {
    min-width: 140px;
    height: 100px;
    background: #111;
    border: 1px solid #222;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s;
    cursor: pointer;
    
    &:hover { border-color: #fff; background: #161616; }
    
    .bp-icon { font-size: 1.2rem; }
    .bp-id { font-size: 0.7rem; color: #555; }
    .bp-name { font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}

.empty-vault {
    text-align: center;
    padding: 40px;
    color: #555;
    
    .archive-btn {
        display: inline-block;
        margin-top: 10px;
        color: #00ffcc;
        text-decoration: none;
        border-bottom: 1px solid #00ffcc;
        &:hover { color: #fff; border-color: #fff; }
    }
}

/* BOTTOM ROW */
.bottom-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    height: 200px;
}

.achievement-card {
    display: flex;
    flex-direction: column;
}

.badges-scroll {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    overflow-y: auto;
}

.badge-item {
    text-align: center;
    width: 60px;
    
    .badge-icon { font-size: 2rem; margin-bottom: 5px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
    .badge-name { font-size: 0.6rem; color: #888; }
}

.no-badges { color: #444; font-style: italic; font-size: 0.9rem; }

/* OPS CARD */
.ops-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ops-btn {
    background: transparent;
    border: 1px solid #333;
    color: #888;
    padding: 10px;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    font-size: 0.8rem;
    
    &:hover { border-color: #fff; color: #fff; padding-left: 15px; }
    
    &.logout-btn {
        border-color: #662222;
        color: #ff4d4f;
        margin-top: 10px;
        &:hover { background: #662222; color: #fff; }
    }
}

/* --- MODALS --- */
.modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-window {
    width: 400px;
    background: #0a0a0a;
    border: 1px solid #333;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
}

.modal-header {
    background: #111;
    padding: 15px 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 { margin: 0; font-size: 1rem; color: #00ffcc; letter-spacing: 1px; }
    .close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
}

.modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    label { font-size: 0.7rem; color: #555; }
    input, textarea {
        background: #111;
        border: 1px solid #333;
        color: #fff;
        padding: 10px;
        font-family: inherit;
        &:focus { outline: none; border-color: #00ffcc; }
    }
}

.avatar-upload-group {
    align-items: center;
    margin-bottom: 20px;
}

.modal-avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    border: 2px solid #333;
    cursor: pointer;
    background: #000;
    
    img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { 
        width: 100%; height: 100%; 
        display: flex; justify-content: center; align-items: center; 
        font-size: 2rem; color: #333; 
    }
    
    .overlay {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.6);
        color: #fff;
        display: flex; justify-content: center; align-items: center;
        opacity: 0;
        font-size: 0.8rem;
        transition: opacity 0.2s;
    }
    
    &:hover .overlay { opacity: 1; }
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #333;
    text-align: right;
}
.avatar-input-row {
    display: flex;
    gap: 10px;
    input { flex: 1; }
    .random-btn { 
        background: #333; color: #fff; border: 1px solid #444; cursor: pointer; padding: 0 10px;
        &:hover { background: #444; }
    }
}

.primary-btn {
    background: #00ffcc;
    color: #000;
    font-weight: 700;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    &:hover { background: #fff; }
}



@media (max-width: 900px) {
    .top-row, .bottom-row {
        grid-template-columns: 1fr;
        height: auto;
    }
    .profile-container { padding-bottom: 80px; }
}
</style>
