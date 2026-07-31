<script setup lang="ts">
import { ref, computed } from 'vue'
import DynamicIslandNav from './DynamicIslandNav.vue'

interface Project {
  id: string
  title: string
  subtitle: string
  status: 'PRODUCTION' | 'OPEN SOURCE' | 'RESEARCH' | 'IN DEVELOPMENT'
  category: 'AI / ML' | 'FULL STACK' | 'SYSTEMS & C++'
  description: string
  techStack: string[]
  githubUrl: string
  demoUrl?: string
  telemetryBadge: string
  image: string
}

const activeCategory = ref<'ALL' | 'AI / ML' | 'FULL STACK' | 'SYSTEMS & C++'>('ALL')
const isFolderOpen = ref(false)
const hoverFolder = ref(false)
const hoveredCardId = ref<string | null>(null)
const activeReadProject = ref<Project | null>(null)

const dragStartY = ref<number | null>(null)
const dragOffsetY = ref<number>(0)
const isDragging = ref(false)

const projects: Project[] = [
  {
    id: 'project-one',
    title: 'Project Alpha',
    subtitle: 'Autonomous Local File Intelligence & Context Engine',
    status: 'PRODUCTION',
    category: 'AI / ML',
    description: 'Local document intelligence engine that indexes, vectors, and analyzes unstructured files with zero external API leaks.',
    techStack: ['Tauri v2', 'Rust', 'React 18', 'Ollama AI', 'LanceDB', 'MCP Protocol'],
    githubUrl: 'https://github.com/example/project-alpha',
    demoUrl: 'https://example.com/demo-alpha',
    telemetryBadge: 'AI FILE INTELLIGENCE',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'project-two',
    title: 'Project Beta',
    subtitle: 'Real-Time Telemetry & Tracking Platform',
    status: 'PRODUCTION',
    category: 'FULL STACK',
    description: 'Turn documents into data sources with real-time viewer telemetry, device metrics, duration tracking, and instant kill switches.',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Tailwind CSS 4'],
    githubUrl: 'https://github.com/example/project-beta',
    demoUrl: 'https://example.com/demo-beta',
    telemetryBadge: 'TELEMETRY INTELLIGENCE',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'project-three',
    title: 'Project Gamma',
    subtitle: 'Upcoming Flagship System',
    status: 'IN DEVELOPMENT',
    category: 'FULL STACK',
    description: 'Flagship project showcase system in development. Details and live deployment coming soon.',
    techStack: ['TypeScript', 'Nuxt 4', 'Nitro', 'PostgreSQL'],
    githubUrl: 'https://github.com/example/project-gamma',
    telemetryBadge: 'FLAGSHIP SYSTEM',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop'
  }
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'ALL') return projects
  return projects.filter(p => p.category === activeCategory.value)
})

function getCardStyle(index: number, total: number) {
  const offset = index - (total - 1) / 2

  if (!isFolderOpen.value) {
    const stackY = hoverFolder.value ? offset * -10 - 40 : offset * -5
    const stackX = hoverFolder.value ? offset * 32 : offset * 3
    const stackRotate = hoverFolder.value ? offset * 7 : offset * 3
    const baseScale = hoverFolder.value ? 1.0 : 0.82
    const stackScale = baseScale - Math.abs(offset) * 0.03

    return {
      transform: `translate3d(${stackX}px, ${stackY}px, 0px) rotate(${stackRotate}deg) scale(${stackScale})`,
      zIndex: index + 10,
      opacity: 1
    }
  } else {
    const isHovered = hoveredCardId.value === filteredProjects.value[index].id
    const openY = (isHovered ? -160 : -140) + (isDragging.value ? dragOffsetY.value * 0.5 : 0)
    const spacing = total <= 3 ? 240 : 205
    const openX = offset * spacing
    const openRotate = isHovered ? 0 : offset * 2
    const openScale = isHovered ? 1.45 : 1.02

    return {
      transform: `translate3d(${openX}px, ${openY}px, 0px) rotate(${openRotate}deg) scale(${openScale})`,
      zIndex: isHovered ? 100 : index + 20,
      opacity: 1
    }
  }
}

function handleFolderClick() {
  if (!isFolderOpen.value) {
    isFolderOpen.value = true
  }
}

function closeFolder() {
  isFolderOpen.value = false
  hoveredCardId.value = null
  dragOffsetY.value = 0
}

function openReadModal(project: Project, e: MouseEvent) {
  e.stopPropagation()
  activeReadProject.value = project
}

function closeReadModal() {
  activeReadProject.value = null
}

function handleTouchStart(e: TouchEvent) {
  if (!isFolderOpen.value) return
  dragStartY.value = e.touches[0].clientY
  isDragging.value = true
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value || dragStartY.value === null) return
  const currentY = e.touches[0].clientY
  const diff = currentY - dragStartY.value
  if (diff > 0) {
    dragOffsetY.value = diff
  }
}

function handleTouchEnd() {
  if (!isDragging.value) return
  if (dragOffsetY.value > 120) {
    closeFolder()
  } else {
    dragOffsetY.value = 0
  }
  isDragging.value = false
  dragStartY.value = null
}
</script>

<template>
  <div class="projects-showcase-stage font-body select-none">
    <!-- Dynamic Island Navigation Header -->
    <DynamicIslandNav active-tab="projects" />

    <!-- Ambient Grid & Spotlight Mesh -->
    <div class="noise-overlay" aria-hidden="true" />
    <div class="stage-spotlight" aria-hidden="true" />

    <!-- Top Left Title Block -->
    <header class="projects-header font-display">
      <h1 class="projects-title">
        <span class="word-projects">PROJECTS</span>
        <span class="word-systems">& SYSTEMS</span>
      </h1>
      <div class="projects-subtitle font-mono">
        <span>// ARCHITECTURAL PORTFOLIO & FEAT SYSTEMS</span>
      </div>
    </header>

    <!-- Category Filter Tabs -->
    <nav class="category-nav font-mono" aria-label="Project Categories">
      <button
        v-for="cat in ['ALL', 'AI / ML', 'FULL STACK', 'SYSTEMS & C++'] as const"
        :key="cat"
        class="category-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </nav>

    <!-- Main Central Stage: Manilla Folder + Stacked Cards -->
    <main 
      class="center-stage-container"
      :class="{ 'folder-is-open': isFolderOpen }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Manilla Folder Icon Container -->
      <div 
        class="folder-wrapper"
        :class="{ open: isFolderOpen, hover: hoverFolder }"
        @mouseenter="hoverFolder = true"
        @mouseleave="hoverFolder = false"
        @click="handleFolderClick"
      >
        <div class="folder-tab font-mono">
          <span class="tab-label">// ARCHIVE_VOL_01</span>
          <span class="tab-count">{{ filteredProjects.length }} SYSTEMS</span>
        </div>

        <div class="folder-body">
          <div class="folder-grid-pattern" />
          
          <div v-if="!isFolderOpen" class="folder-prompt font-mono">
            <svg class="folder-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span>CLICK TO UNLEASH PROJECTS</span>
          </div>

          <div v-else class="folder-close-prompt font-mono" @click.stop="closeFolder">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
            <span>CLOSE ARCHIVE FOLDER</span>
          </div>
        </div>
      </div>

      <!-- Project Cards Stack / Spread Grid -->
      <div class="cards-stack-layer">
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          class="project-card-item"
          :class="{ 
            'is-open-spread': isFolderOpen,
            'is-hovered': hoveredCardId === project.id 
          }"
          :style="getCardStyle(index, filteredProjects.length)"
          @mouseenter="hoveredCardId = project.id"
          @mouseleave="hoveredCardId = null"
          @click="handleFolderClick"
        >
          <!-- Card Header Telemetry Tag -->
          <div class="card-telemetry font-mono">
            <span class="telemetry-badge">{{ project.telemetryBadge }}</span>
            <span class="status-indicator" :class="project.status.toLowerCase().replace(/\s+/g, '-')">
              {{ project.status }}
            </span>
          </div>

          <!-- Card Thumbnail Media Container -->
          <div class="card-media">
            <img :src="project.image" :alt="project.title" class="media-img" loading="lazy" />
            <div class="media-overlay" />
          </div>

          <!-- Card Info Body -->
          <div class="card-content">
            <h2 class="card-title font-display">{{ project.title }}</h2>
            <p class="card-subtitle font-mono">{{ project.subtitle }}</p>
            <p class="card-desc">{{ project.description }}</p>

            <!-- Tech Tags -->
            <div class="card-tech-list font-mono">
              <span v-for="tech in project.techStack" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="card-actions font-mono">
              <button 
                class="action-btn read-btn"
                @click="openReadModal(project, $event)"
              >
                <span>READ DETAILS</span>
              </button>

              <a 
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener"
                class="action-btn demo-btn"
                @click.stop
              >
                <span>LIVE DEMO</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>

              <a 
                :href="project.githubUrl"
                target="_blank"
                rel="noopener"
                class="action-btn github-btn"
                @click.stop
              >
                <span>CODE</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Detail Reading Dialog Modal -->
    <Transition name="modal-fade">
      <div v-if="activeReadProject" class="project-dialog-backdrop" @click="closeReadModal">
        <div class="project-dialog-content font-body" @click.stop>
          <button class="dialog-close-btn font-mono" @click="closeReadModal">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
            <span>CLOSE</span>
          </button>

          <div class="dialog-header">
            <span class="dialog-badge font-mono">{{ activeReadProject.telemetryBadge }}</span>
            <h2 class="dialog-title font-display">{{ activeReadProject.title }}</h2>
            <p class="dialog-subtitle font-mono">{{ activeReadProject.subtitle }}</p>
          </div>

          <div class="dialog-media">
            <img :src="activeReadProject.image" :alt="activeReadProject.title" class="dialog-img" />
          </div>

          <div class="dialog-body font-body">
            <p class="dialog-description">{{ activeReadProject.description }}</p>

            <div class="dialog-tech-section font-mono">
              <h3>// ARCHITECTURAL TECH STACK</h3>
              <div class="dialog-tech-tags">
                <span v-for="t in activeReadProject.techStack" :key="t" class="tech-tag">
                  {{ t }}
                </span>
              </div>
            </div>

            <div class="dialog-actions font-mono">
              <a 
                v-if="activeReadProject.demoUrl"
                :href="activeReadProject.demoUrl"
                target="_blank"
                rel="noopener"
                class="dialog-btn demo-btn"
              >
                <span>OPEN LIVE DEMO</span>
              </a>
              <a 
                :href="activeReadProject.githubUrl"
                target="_blank"
                rel="noopener"
                class="dialog-btn github-btn"
              >
                <span>VIEW REPOSITORY</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.projects-showcase-stage {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  background: #080305;
  color: #FAFAFA;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 16px;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.stage-spotlight {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  height: 60vh;
  background: radial-gradient(ellipse at center, rgba(174, 59, 139, 0.18) 0%, rgba(13, 5, 8, 0) 70%);
  pointer-events: none;
  z-index: 2;
  filter: blur(40px);
}

.projects-header {
  position: absolute;
  top: 40px;
  left: 48px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.projects-title {
  font-size: clamp(1.8rem, 3.8vw, 3.2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  display: flex;
  gap: 12px;
}

.word-projects {
  color: #ffffff;
}

.word-systems {
  color: #AE3B8B;
  text-shadow: 0 0 25px rgba(174, 59, 139, 0.6);
}

.projects-subtitle {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: #E17888;
  opacity: 0.85;
}

.category-nav {
  position: absolute;
  top: 48px;
  right: 48px;
  z-index: 20;
  display: flex;
  gap: 10px;
}

.category-btn {
  background: rgba(30, 7, 19, 0.6);
  border: 1px solid rgba(190, 44, 85, 0.3);
  color: rgba(255, 224, 235, 0.7);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.category-btn:hover {
  border-color: #BE2C55;
  color: #FFE0EB;
}

.category-btn.active {
  background: #BE2C55;
  border-color: #BE2C55;
  color: #FFE0EB;
  box-shadow: 0 0 16px rgba(190, 44, 85, 0.5);
}

.center-stage-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  perspective: 1400px;
}

.folder-wrapper {
  position: absolute;
  top: 52%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 240px;
  background: linear-gradient(145deg, #240b15 0%, #120409 100%);
  border: 1.5px solid rgba(174, 59, 139, 0.4);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(174, 59, 139, 0.2);
  cursor: pointer;
  z-index: 5;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.folder-wrapper.hover {
  border-color: #AE3B8B;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 60px rgba(174, 59, 139, 0.4);
  transform: translate(-50%, -52%) scale(1.03);
}

.folder-wrapper.open {
  transform: translate(-50%, 140px) scale(0.9);
  opacity: 0.4;
  border-color: rgba(174, 59, 139, 0.2);
}

.folder-tab {
  position: absolute;
  top: -30px;
  left: 20px;
  background: #240b15;
  border: 1.5px solid rgba(174, 59, 139, 0.4);
  border-bottom: none;
  padding: 6px 18px;
  border-radius: 8px 8px 0 0;
  display: flex;
  gap: 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #E17888;
}

.folder-body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.folder-grid-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-size: 20px 20px;
  background-image: linear-gradient(to right, #ffffff 1px, transparent 1px),
                    linear-gradient(to bottom, #ffffff 1px, transparent 1px);
}

.folder-prompt, .folder-close-prompt {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #FAFAFA;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  z-index: 2;
}

.cards-stack-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 20;
}

.project-card-item {
  position: absolute;
  width: 320px;
  height: 420px;
  background: #14070d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
  pointer-events: auto;
  cursor: pointer;
  will-change: transform, opacity;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

.project-card-item.is-open-spread {
  border-color: rgba(174, 59, 139, 0.4);
}

.project-card-item.is-hovered {
  border-color: #AE3B8B;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(174, 59, 139, 0.5);
}

.card-telemetry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.telemetry-badge {
  color: #E17888;
}

.status-indicator {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(174, 59, 139, 0.2);
  color: #FF2A5F;
}

.card-media {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin: 12px 0;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 2px;
}

.card-subtitle {
  font-size: 0.72rem;
  color: #E17888;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 0.78rem;
  color: rgba(250, 250, 250, 0.75);
  line-height: 1.4;
  margin-bottom: 12px;
}

.card-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tech-tag {
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.read-btn {
  background: rgba(174, 59, 139, 0.2);
  border: 1px solid rgba(174, 59, 139, 0.5);
  color: #FFE0EB;
}

.read-btn:hover {
  background: #AE3B8B;
  color: #ffffff;
}

.demo-btn, .github-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.demo-btn:hover, .github-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.project-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(5, 2, 4, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.project-dialog-content {
  position: relative;
  width: 100%;
  max-width: 680px;
  background: #14070d;
  border: 1px solid rgba(174, 59, 139, 0.4);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.95);
}

.dialog-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.dialog-close-btn:hover {
  color: #ffffff;
}

.dialog-badge {
  font-size: 0.72rem;
  color: #E17888;
}

.dialog-title {
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
}

.dialog-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
}

.dialog-img {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.dialog-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(250, 250, 250, 0.85);
  margin-bottom: 24px;
}

.dialog-tech-section h3 {
  font-size: 0.75rem;
  color: #E17888;
  margin-bottom: 10px;
}

.dialog-tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.dialog-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.dialog-btn.demo-btn {
  background: #AE3B8B;
  color: #ffffff;
}

.dialog-btn.github-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .projects-header {
    top: 20px;
    left: 20px;
  }

  .category-nav {
    top: 80px;
    right: auto;
    left: 20px;
  }

  .project-card-item {
    width: 280px;
    height: 380px;
  }
}
</style>
