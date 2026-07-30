<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  isHomePage?: boolean
  isStarted?: boolean
}>(), {
  isHomePage: true,
  isStarted: true
})

const emit = defineEmits<{
  (e: 'selectCommand', actionId: string): void
}>()

const isOpen = ref(false)
const isTriggerHovered = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const copiedMessage = ref('')

interface ActionItem {
  id: string
  title: string
  subtitle?: string
  category: 'NAVIGATION' | 'CONNECTS' | 'REPOSITORIES'
  icon: string
  hasCopy?: boolean
  copyValue?: string
  handler: () => void
}

const actions: ActionItem[] = [
  {
    id: 'nav-home',
    title: 'Home Stage',
    category: 'NAVIGATION',
    icon: 'home',
    handler: () => {
      emit('selectCommand', 'nav-home')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  {
    id: 'nav-tech-stack',
    title: 'Tech Stack Showcase',
    category: 'NAVIGATION',
    icon: 'stack',
    handler: () => {
      emit('selectCommand', 'nav-tech-stack')
    }
  },
  {
    id: 'nav-projects',
    title: 'Projects & Systems Showcase',
    category: 'NAVIGATION',
    icon: 'folder',
    handler: () => {
      emit('selectCommand', 'nav-projects')
    }
  },
  {
    id: 'email',
    title: 'Send Email',
    subtitle: 'dhruvmann139@gmail.com',
    category: 'CONNECTS',
    icon: 'mail',
    hasCopy: true,
    copyValue: 'dhruvmann139@gmail.com',
    handler: () => {
      window.location.href = 'mailto:dhruvmann139@gmail.com'
    }
  },
  {
    id: 'github',
    title: 'GitHub Profile',
    subtitle: '@Dhruv-Mann',
    category: 'CONNECTS',
    icon: 'github',
    handler: () => {
      window.open('https://github.com/Dhruv-Mann', '_blank')
    }
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    subtitle: 'in/dhruv-mann',
    category: 'CONNECTS',
    icon: 'linkedin',
    handler: () => {
      window.open('https://www.linkedin.com/in/dhruv-mann', '_blank')
    }
  },
  {
    id: 'twitter',
    title: 'Twitter / X Profile',
    subtitle: '@DhruvMann64',
    category: 'CONNECTS',
    icon: 'x',
    handler: () => {
      window.open('https://x.com/DhruvMann64', '_blank')
    }
  },
  {
    id: 'repo',
    title: 'Digital Hub Repository',
    category: 'REPOSITORIES',
    icon: 'repo',
    handler: () => {
      window.open('https://github.com/Dhruv-Mann/Noirsito-Hub', '_blank')
    }
  }
]

const groupedActions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const filtered = q
    ? actions.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q)
      )
    : actions

  const categories = ['NAVIGATION', 'CONNECTS', 'REPOSITORIES'] as const
  return categories
    .map(cat => ({
      name: cat,
      items: filtered.filter(a => a.category === cat)
    }))
    .filter(group => group.items.length > 0)
})

const flatFilteredActions = computed(() => {
  return groupedActions.value.flatMap(group => group.items)
})

function showToast(msg: string) {
  copiedMessage.value = msg
  setTimeout(() => {
    copiedMessage.value = ''
  }, 2200)
}

function handleCopy(text: string) {
  navigator.clipboard.writeText(text)
  showToast('Email copied to clipboard!')
}

function scrollToSelected() {
  nextTick(() => {
    if (typeof document === 'undefined') return
    const selectedEl = document.querySelector('.action-item.selected') as HTMLElement | null
    if (selectedEl) {
      selectedEl.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  })
}

watch(selectedIndex, () => {
  scrollToSelected()
})

function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      searchQuery.value = ''
      selectedIndex.value = 0
      scrollToSelected()
    }
    return
  }

  if (!isOpen.value) return

  const total = flatFilteredActions.value.length

  if (e.key === 'Escape') {
    isOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (total > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % total
      scrollToSelected()
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (total > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + total) % total
      scrollToSelected()
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const selected = flatFilteredActions.value[selectedIndex.value]
    if (selected) {
      selected.handler()
      isOpen.value = false
    }
  }
}

watch(isOpen, (newVal) => {
  if (typeof document !== 'undefined') {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div>
    <!-- Floating Ctrl+K Dynamic Island Trigger Pill -->
    <button
      v-if="isHomePage && isStarted"
      class="cmd-k-trigger font-mono select-none"
      :class="{ expanded: isTriggerHovered }"
      @mouseenter="isTriggerHovered = true"
      @mouseleave="isTriggerHovered = false"
      @click="isOpen = true"
    >
      <span class="cmd-pulse-dot" />
      <span class="cmd-mnemonic font-mono">CTRL+K</span>
      <Transition name="fade-fast">
        <span v-if="isTriggerHovered" class="cmd-k-label font-mono">COMMAND PALETTE</span>
      </Transition>
    </button>

    <!-- Command Palette Modal -->
    <Transition name="palette-fade">
      <div v-if="isOpen" class="palette-backdrop" @click.self="isOpen = false">
        <div class="palette-modal font-body">
          <!-- Search Header -->
          <div class="palette-header">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search commands, links, stack, actions... (ESC to close)"
              class="palette-input font-body"
              autoFocus
            />
            <kbd class="esc-badge font-mono">ESC</kbd>
          </div>

          <!-- Categorized Body -->
          <div class="palette-body">
            <div v-if="groupedActions.length > 0" class="actions-list">
              <div v-for="group in groupedActions" :key="group.name" class="category-group">
                <div class="category-header font-mono">
                  <span>// {{ group.name }}</span>
                </div>

                <div
                  v-for="action in group.items"
                  :key="action.id"
                  class="action-item"
                  :class="{ selected: flatFilteredActions[selectedIndex]?.id === action.id }"
                  @click="action.handler(); isOpen = false;"
                  @mousemove="selectedIndex = flatFilteredActions.findIndex(item => item.id === action.id)"
                >
                  <div class="action-left">
                    <span class="action-icon" aria-hidden="true">
                      <svg v-if="action.icon === 'home'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <svg v-else-if="action.icon === 'stack'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                        <polyline points="2 17 12 22 22 17"/>
                        <polyline points="2 12 12 17 22 12"/>
                      </svg>
                      <svg v-else-if="action.icon === 'folder'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <svg v-else-if="action.icon === 'mail'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="3"/>
                        <path d="M22 6l-10 7L2 6"/>
                      </svg>
                      <svg v-else-if="action.icon === 'github'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                      </svg>
                      <svg v-else-if="action.icon === 'linkedin'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                      <svg v-else-if="action.icon === 'x'" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <svg v-else-if="action.icon === 'repo'" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="6" y1="3" x2="6" y2="15"/>
                        <circle cx="18" cy="6" r="3"/>
                        <circle cx="6" cy="18" r="3"/>
                        <path d="M18 9a9 9 0 0 1-9 9"/>
                      </svg>
                    </span>

                    <div class="action-text-block">
                      <span class="action-title">{{ action.title }}</span>
                      <span v-if="action.subtitle" class="action-subtitle font-mono">{{ action.subtitle }}</span>
                    </div>
                  </div>

                  <button
                    v-if="action.hasCopy"
                    class="copy-inline-btn font-mono"
                    title="Copy email to clipboard"
                    @click.stop="handleCopy(action.copyValue!)"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>COPY</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="empty-state font-mono">
              No matching commands found.
            </div>
          </div>

          <!-- Palette Footer Status Bar -->
          <div class="palette-footer font-mono">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="copiedMessage" class="toast-message font-mono">
        {{ copiedMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cmd-k-trigger {
  position: fixed;
  top: 24px;
  left: 32px;
  z-index: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1E0713;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(190, 44, 85, 0.4);
  color: #FFE0EB;
  height: 42px;
  width: 104px;
  padding: 0 14px;
  border-radius: 28px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(190, 44, 85, 0.2);
  transition: width 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.25),
              background 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
}

.cmd-k-trigger.expanded {
  width: 220px;
  border-color: #BE2C55;
  background: rgba(30, 7, 19, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(190, 44, 85, 0.4);
}

.cmd-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #BE2C55;
  box-shadow: 0 0 10px #BE2C55;
  animation: pulse-glow 2s infinite ease-in-out;
  flex-shrink: 0;
}

.cmd-mnemonic {
  color: #FFE0EB;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.cmd-k-label {
  color: rgba(255, 224, 235, 0.75);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  margin-left: 2px;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
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
  .cmd-k-trigger.expanded {
    width: 170px;
  }
}

.palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000000;
  background: rgba(4, 5, 7, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.palette-modal {
  width: 90%;
  max-width: 580px;
  background: #0d0e12;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.palette-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
}

.search-icon {
  color: rgba(255, 255, 255, 0.4);
}

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 0.9375rem;
}

.palette-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.esc-badge {
  font-size: 0.6875rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.palette-body {
  max-height: 380px;
  overflow-y: auto;
  padding: 8px 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(174, 59, 139, 0.35) rgba(0, 0, 0, 0.2);
}

.palette-body::-webkit-scrollbar {
  width: 6px;
}

.palette-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.palette-body::-webkit-scrollbar-thumb {
  background: rgba(174, 59, 139, 0.35);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.palette-body::-webkit-scrollbar-thumb:hover {
  background: #AE3B8B;
}

.category-group {
  margin-bottom: 12px;
}

.category-group:last-child {
  margin-bottom: 4px;
}

.category-header {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(174, 59, 139, 0.85);
  padding: 8px 12px 4px 12px;
  text-transform: uppercase;
}

.action-item {
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.875rem;
  margin-bottom: 2px;
  border-left: 3px solid transparent;
  transition: all 0.15s ease;
}

.action-item.selected {
  background: rgba(174, 59, 139, 0.15);
  border-left-color: #AE3B8B;
  color: #ffffff;
}

.action-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  color: #AE3B8B;
  transition: color 0.15s ease, background 0.15s ease;
}

.action-item.selected .action-icon {
  background: rgba(174, 59, 139, 0.25);
  color: #ffffff;
}

.action-text-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.action-subtitle {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.45);
}

.action-item.selected .action-subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.copy-inline-btn {
  background: rgba(174, 59, 139, 0.2);
  border: 1px solid rgba(174, 59, 139, 0.4);
  color: #E17888;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-inline-btn:hover {
  background: rgba(174, 59, 139, 0.5);
  border-color: #AE3B8B;
  color: #ffffff;
  transform: scale(1.05);
}

.empty-state {
  padding: 36px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8125rem;
}

.palette-footer {
  display: flex;
  gap: 16px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
}

.toast-message {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 10000;
  background: rgba(174, 59, 139, 0.95);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.8125rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.palette-fade-enter-active,
.palette-fade-leave-active {
  transition: opacity 0.2s ease;
}

.palette-fade-enter-from,
.palette-fade-leave-to {
  opacity: 0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
