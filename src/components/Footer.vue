<template>
  <footer class="app-footer">
    <div class="footer-container">
      
      <!-- Top Section: Brand & Action -->
      <div class="footer-top">
        <div class="brand-title">
          ARCH · TRACE
        </div>
        <button class="back-to-top" @click="scrollToTop">
          <span class="icon">↑</span>
          <span class="text">TOP</span>
        </button>
      </div>

      <!-- Bottom Section: Info Grid -->
      <div class="footer-bottom">
        <!-- Col 1 -->
        <div class="footer-col">
          <p class="mono-text">© 2025 近代日本建筑探索馆</p>
        </div>
        
        <!-- Col 2 -->
        <div class="footer-col">
          <p class="mono-text">Based on: 《通识：学问的门类》</p>
        </div>

        <!-- Col 3 -->
        <div class="footer-col links-col">
          <a href="#" class="footer-link">Github</a>
          <a href="#" class="footer-link">About</a>
          <router-link to="/map" class="footer-link">Map</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=JetBrains+Mono:wght@400;500&display=swap');

.app-footer {
    background-color: #0a0a0a;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 64px 24px;
    color: #fff;
    width: 100%;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
}

/* Top Section */
.footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 24px;
}

.brand-title {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 6rem; /* text-6xl */
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -0.05em; /* tracking-tighter */
    color: rgba(255, 255, 255, 0.9);
}

.back-to-top {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    transition: all 0.3s;

    &:hover {
        background: #fff;
        color: #000;
    }

    .icon {
        font-size: 1.2em;
    }
}

/* Bottom Section */
.footer-bottom {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.05); /* Subtle inner separator */
}

.footer-col {
    display: flex;
    flex-direction: column;
}

.mono-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; /* text-xs */
    color: #6b7280; /* text-gray-500 */
    margin: 0;
}

.links-col {
    align-items: flex-end; /* Align links to right in desktop? Or left? Request implies simple list. Default left is safer for 3-col grid. */
    /* Let's keep left aligned for grid consistency, or flex-row for links */
    flex-direction: row;
    gap: 16px;
}

.footer-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #fff;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .brand-title {
        font-size: 3rem; /* text-4xl */
    }
    
    .footer-bottom {
        grid-template-columns: 1fr;
        gap: 32px;
    }

    .links-col {
        justify-content: flex-start;
    }
}
</style>
