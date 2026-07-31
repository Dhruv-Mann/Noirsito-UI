<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  activeTab?: 'home' | 'tech-stack' | 'projects' | 'commands'
}>(), {
  activeTab: 'home'
})

const emit = defineEmits<{
  (e: 'navigate', tab: 'home' | 'tech-stack' | 'projects' | 'commands'): void
}>()

const isHovered = ref(false)
const currentActiveTab = ref<'home' | 'tech-stack' | 'projects' | 'commands'>(props.activeTab)

const currentTitle = computed(() => {
  if (currentActiveTab.value === 'projects') return 'PROJECTS'
  if (currentActiveTab.value === 'tech-stack') return 'STACK'
  if (currentActiveTab.value === 'commands') return 'COMMANDS'
  return 'HUB'
})

function navigateTo(tab: 'home' | 'tech-stack' | 'projects' | 'commands') {
  currentActiveTab.value = tab
  emit('navigate', tab)
}
</script>

<template>
  <div
    class="dynamic-island-wrapper font-mono select-none"
    :class="{ expanded: isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Collapsed Pill Header State -->
    <Transition name="fade-fast" mode="out-in">
      <div v-if="!isHovered" key="collapsed" class="island-collapsed-content">
        <span class="pulse-dot" />
        <span class="island-title">{{ currentTitle }}</span>
        <svg class="chevron-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Expanded Navigation Options -->
      <div v-else key="expanded" class="island-expanded-content">
        <button
          class="island-nav-btn"
          :class="{ active: currentActiveTab === 'home' }"
          @click="navigateTo('home')"
        >
          <span class="btn-prefix">01</span>
          <span class="btn-label">HOME</span>
        </button>

        <button
          class="island-nav-btn"
          :class="{ active: currentActiveTab === 'tech-stack' }"
          @click="navigateTo('tech-stack')"
        >
          <span class="btn-prefix">02</span>
          <span class="btn-label">STACK</span>
        </button>

        <button
          class="island-nav-btn"
          :class="{ active: currentActiveTab === 'projects' }"
          @click="navigateTo('projects')"
        >
          <span class="btn-prefix">03</span>
          <span class="btn-label">PROJECTS</span>
        </button>

        <button
          class="island-nav-btn"
          :class="{ active: currentActiveTab === 'commands' }"
          @click="navigateTo('commands')"
        >
          <span class="btn-prefix">04</span>
          <span class="btn-label">COMMANDS</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dynamic-island-wrapper {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: #1E0713;
  border: 1px solid rgba(190, 44, 85, 0.4);
  border-radius: 28px;
  height: 42px;
  width: 150px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(190, 44, 85, 0.2);
  transition: width 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.25),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  overflow: hidden;
}

.dynamic-island-wrapper.expanded {
  width: 460px;
  border-color: #BE2C55;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(190, 44, 85, 0.35);
  padding: 0 10px;
}

.island-collapsed-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #FFE0EB;
  font-size: 0.78125rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #BE2C55;
  box-shadow: 0 0 10px #BE2C55;
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.chevron-icon {
  color: #BE2C55;
  transition: transform 0.2s ease;
}

.island-expanded-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 6px;
}

.island-nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 224, 235, 0.7);
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.island-nav-btn:hover {
  background: rgba(190, 44, 85, 0.25);
  color: #FFE0EB;
  border-color: rgba(190, 44, 85, 0.5);
}

.island-nav-btn.active {
  background: #BE2C55;
  border-color: #BE2C55;
  color: #FFE0EB;
}

.btn-prefix {
  color: #FFE0EB;
  font-size: 0.65rem;
  opacity: 0.8;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .dynamic-island-wrapper.expanded {
    width: 92vw;
  }

  .btn-prefix {
    display: none;
  }
}
</style>
