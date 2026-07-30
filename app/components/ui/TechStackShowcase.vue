<template>
  <div class="tech-stack-showcase font-body select-none">
    <!-- Dynamic Island Navigation Header -->
    <DynamicIslandNav active-tab="tech-stack" />

    <!-- Subtle noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true" />

    <!-- Main Stage: Full-viewport flex row -->
    <div class="stage-container">
      <!-- Left Side: Main Content Column -->
      <div class="left-content-column">
        <!-- Main Section: TECH STACK Title & Primary Accent Line -->
        <main class="content-header-block">
          <h1 class="tech-title font-display anim-seg-1">
            <span class="word-tech">TECH</span>
            <span class="word-stack">STACK</span>
          </h1>

          <div class="divider-line anim-seg-2" />
        </main>

        <!-- Minimal Expandable Accordion Categories -->
        <div class="minimal-accordion-container anim-seg-3">
          <div
            v-for="(cat, idx) in stackCategories"
            :key="cat.id"
            class="accordion-item"
            :class="{ open: openCategories.includes(cat.id) }"
          >
            <!-- Minimal Category Header Row -->
            <button
              class="accordion-header font-mono"
              @click="toggleCategory(cat.id)"
            >
              <div class="header-left">
                <span class="index-num">0{{ idx + 1 }}</span>
                <span class="category-name">{{ cat.title }}</span>
              </div>

              <div class="header-right">
                <span class="expand-icon" :class="{ rotated: openCategories.includes(cat.id) }">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </div>
            </button>

            <!-- Expanded Category Content (Tech Cards Grid) -->
            <Transition name="accordion">
              <div v-if="openCategories.includes(cat.id)" class="accordion-body">
                <div class="tech-cards-grid">
                  <div
                    v-for="item in cat.items"
                    :key="item.name"
                    class="tech-card"
                    :class="{ active: hoveredTech === item.name }"
                    @mouseenter="hoveredTech = item.name"
                    @mouseleave="hoveredTech = null"
                  >
                    <div class="card-header">
                      <span class="tech-name font-display">{{ item.name }}</span>
                      <span v-if="item.badge" class="tech-badge font-mono">{{ item.badge }}</span>
                    </div>

                    <div class="card-level-bar">
                      <div class="level-fill" :style="{ width: `${item.level}%` }" />
                    </div>

                    <p class="tech-desc font-body">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Footer Action Row -->
        <div class="footer-action-row anim-seg-4">
          <button class="return-home-btn font-mono" @click="$emit('returnHome')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>RETURN TO STAGE</span>
          </button>
        </div>
      </div>

      <!-- Right Side: Secondary Exit Sheet Stage with Slanted Metallic Backdrop -->
      <div class="right-sheet-column">
        <div class="slanted-metallic-sheet">
          <div class="metallic-shine" />
          <div class="sheet-watermark font-display">
            EXCELLENCE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicIslandNav from './DynamicIslandNav.vue'

defineEmits<{
  (e: 'returnHome'): void
}>()

interface TechItem {
  name: string
  badge?: string
  level: number
  desc: string
}

interface StackCategory {
  id: string
  title: string
  items: TechItem[]
}

const openCategories = ref<string[]>(['core', 'ai-ml', 'frameworks'])
const hoveredTech = ref<string | null>(null)

function toggleCategory(id: string) {
  if (openCategories.value.includes(id)) {
    openCategories.value = openCategories.value.filter(c => c !== id)
  } else {
    openCategories.value.push(id)
  }
}

const stackCategories: StackCategory[] = [
  {
    id: 'core',
    title: 'CORE LANGUAGES & SYSTEMS',
    items: [
      { name: 'TypeScript', badge: 'EXPERT', level: 95, desc: 'Strict type safety, generics, utility types, system architecture.' },
      { name: 'Rust', badge: 'ADVANCED', level: 85, desc: 'High performance systems, Tauri native bindings, memory safety.' },
      { name: 'C++', badge: 'SYSTEMS', level: 82, desc: 'Low-level memory management, graphics algorithms, matrix math.' },
      { name: 'Python', badge: 'ML & SCRIPTING', level: 90, desc: 'PyTorch, PyMongo, vector search, data pipelines, AI models.' }
    ]
  },
  {
    id: 'ai-ml',
    title: 'ARTIFICIAL INTELLIGENCE & AGENTS',
    items: [
      { name: 'Ollama AI', badge: 'LOCAL AI', level: 92, desc: 'Local LLM inference, embedding generation, quantized model orchestration.' },
      { name: 'LanceDB', badge: 'VECTOR DB', level: 88, desc: 'Embedded vector database for ultra-fast local semantic retrieval.' },
      { name: 'MCP Protocol', badge: 'AGENTIC', level: 90, desc: 'Model Context Protocol server implementations & tool interfaces.' },
      { name: 'PyTorch', badge: 'DEEP LEARNING', level: 80, desc: 'Tensor computation, neural network architectures, model tuning.' }
    ]
  },
  {
    id: 'frameworks',
    title: 'FRAMEWORKS & ARCHITECTURE',
    items: [
      { name: 'Nuxt 4 / Vue 3', badge: 'PRIMARY', level: 98, desc: 'SSR, Nitro engine, composition API, direct DOM animation bypass.' },
      { name: 'Next.js 16 / React 19', badge: 'SAAS', level: 94, desc: 'Server components, App Router, full-stack React architectures.' },
      { name: 'Tauri v2', badge: 'DESKTOP', level: 86, desc: 'Cross-platform native desktop shell powered by Rust & Webview.' },
      { name: 'Tailwind CSS 4', badge: 'STYLING', level: 96, desc: 'Custom design systems, CSS variables, glassmorphism, responsive grids.' }
    ]
  }
]
</script>

<style scoped>
.tech-stack-showcase {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #080305;
  color: #FAFAFA;
  overflow-y: auto;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.stage-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
}

.left-content-column {
  flex: 1;
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-header-block {
  margin-bottom: 32px;
}

.tech-title {
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  display: flex;
  gap: 16px;
}

.word-tech {
  color: #ffffff;
}

.word-stack {
  color: #AE3B8B;
  text-shadow: 0 0 30px rgba(174, 59, 139, 0.6);
}

.divider-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #AE3B8B 0%, rgba(225, 120, 136, 0.4) 50%, transparent 100%);
  margin-top: 16px;
}

.minimal-accordion-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.accordion-item {
  background: rgba(20, 7, 13, 0.6);
  border: 1px solid rgba(174, 59, 139, 0.25);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.accordion-item.open {
  border-color: #AE3B8B;
  background: rgba(20, 7, 13, 0.85);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.accordion-header {
  width: 100%;
  padding: 16px 24px;
  background: transparent;
  border: none;
  color: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.index-num {
  color: #AE3B8B;
}

.expand-icon {
  color: #E17888;
  transition: transform 0.3s ease;

  display: inline-flex;
}

.expand-icon.rotated {
  transform: rotate(45deg);
}

.accordion-body {
  padding: 0 24px 24px 24px;
}

.tech-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 8px;
}

.tech-card {
  background: rgba(30, 10, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px;
  transition: all 0.25s ease;
}

.tech-card:hover, .tech-card.active {
  border-color: #AE3B8B;
  background: rgba(174, 59, 139, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tech-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
}

.tech-badge {
  font-size: 0.625rem;
  background: rgba(174, 59, 139, 0.3);
  border: 1px solid rgba(174, 59, 139, 0.5);
  color: #FFE0EB;
  padding: 2px 6px;
  border-radius: 4px;

  font-weight: 700;
}

.card-level-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 8px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, #AE3B8B, #FF2A5F);
}

.tech-desc {
  font-size: 0.75rem;
  color: rgba(250, 250, 250, 0.7);
  line-height: 1.35;
}

.footer-action-row {
  margin-top: 32px;
  display: flex;
  align-items: center;
}

.return-home-btn {
  background: rgba(174, 59, 139, 0.2);
  border: 1px solid rgba(174, 59, 139, 0.5);
  color: #FFE0EB;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.return-home-btn:hover {
  background: #AE3B8B;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(174, 59, 139, 0.6);
}

.right-sheet-column {
  flex: 0 0 32%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slanted-metallic-sheet {
  position: absolute;
  inset: -10% -20% -10% 0;
  background: linear-gradient(135deg, #1f0814 0%, #0d0308 60%, #050103 100%);
  border-left: 2px solid rgba(174, 59, 139, 0.4);
  transform: skewX(-6deg);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheet-watermark {
  font-size: clamp(4rem, 10vw, 12rem);
  font-weight: 900;
  color: rgba(174, 59, 139, 0.04);
  transform: rotate(-90deg);
  white-space: nowrap;
  letter-spacing: 0.1em;
}

@media (max-width: 900px) {
  .left-content-column {
    max-width: 100%;
    padding: 90px 24px 32px 24px;
  }
  .right-sheet-column {
    display: none;
  }
}
</style>
