<template>
  <div ref="containerRef" class="skills-physics-container">
    <div 
      v-for="badge in badges" 
      :key="badge.id"
      class="physics-skill-badge font-mono"
      :style="{
        transform: `translate(${badge.x}px, ${badge.y}px)`
      }"
    >
      {{ badge.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface PhysicsBadge {
  id: number
  label: string
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  radius: number
}

const containerRef = ref<HTMLDivElement | null>(null)
let rafId: number | null = null

const props = withDefaults(defineProps<{
  skills?: string[]
}>(), {
  skills: () => [
    'AI Engineering',
    'ML Engineering',
    'Software Engineering',
    'Frontend Design',
    'Backend Design'
  ]
})

const badges = ref<PhysicsBadge[]>([])

function initPhysics() {
  const w = window.innerWidth
  const h = window.innerHeight * 0.38

  const list: PhysicsBadge[] = []
  const initialPositions = [
    { x: w * 0.12, y: h * 0.25 },
    { x: w * 0.35, y: h * 0.18 },
    { x: w * 0.65, y: h * 0.22 },
    { x: w * 0.82, y: h * 0.30 },
    { x: w * 0.48, y: h * 0.12 }
  ]

  props.skills.forEach((label, i) => {
    const angle = Math.random() * Math.PI * 2
    const speed = (0.8 + Math.random() * 0.8) * 0.6
    const approxWidth = label.length * 10 + 36
    const approxHeight = 36
    const pos = initialPositions[i % initialPositions.length]

    list.push({
      id: i,
      label,
      x: pos.x,
      y: pos.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      width: approxWidth,
      height: approxHeight,
      radius: Math.max(approxWidth, approxHeight) / 2 + 8
    })
  })

  badges.value = list
}

function updatePhysics() {
  const w = window.innerWidth
  const h = window.innerHeight
  const topMaxY = h * 0.36
  const cx = w / 2
  const cy = h / 2
  const ribbonBufferRadius = 240

  const list = badges.value

  for (let i = 0; i < list.length; i++) {
    const b = list[i]

    b.x += b.vx
    b.y += b.vy

    const margin = 24
    if (b.x < margin) {
      b.x = margin
      b.vx = Math.abs(b.vx)
    } else if (b.x > w - b.width - margin) {
      b.x = w - b.width - margin
      b.vx = -Math.abs(b.vx)
    }

    if (b.y < margin) {
      b.y = margin
      b.vy = Math.abs(b.vy)
    } else if (b.y > topMaxY - b.height) {
      b.y = topMaxY - b.height
      b.vy = -Math.abs(b.vy)
    }

    const badgeCx = b.x + b.width / 2
    const badgeCy = b.y + b.height / 2
    const dxRibbon = badgeCx - cx
    const dyRibbon = badgeCy - cy
    const distRibbon = Math.sqrt(dxRibbon * dxRibbon + dyRibbon * dyRibbon)

    if (distRibbon < ribbonBufferRadius) {
      const nx = dxRibbon / distRibbon
      const ny = dyRibbon / distRibbon
      const overlap = ribbonBufferRadius - distRibbon
      b.x += nx * overlap
      b.y += ny * overlap
      const dot = b.vx * nx + b.vy * ny
      b.vx = b.vx - 2 * dot * nx
      b.vy = b.vy - 2 * dot * ny
    }

    for (let j = i + 1; j < list.length; j++) {
      const b2 = list[j]
      const b1Cx = b.x + b.width / 2
      const b1Cy = b.y + b.height / 2
      const b2Cx = b2.x + b2.width / 2
      const b2Cy = b2.y + b2.height / 2

      const dx = b2Cx - b1Cx
      const dy = b2Cy - b1Cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = b.radius + b2.radius

      if (dist < minDist && dist > 0) {
        const nx = dx / dist
        const ny = dy / dist

        const overlap = (minDist - dist) / 2
        b.x -= nx * overlap
        b.y -= ny * overlap
        b2.x += nx * overlap
        b2.y += ny * overlap

        const kx = b.vx - b2.vx
        const ky = b.vy - b2.vy
        const p = 2 * (nx * kx + ny * ky) / 2

        b.vx -= p * nx
        b.vy -= p * ny
        b2.vx += p * nx
        b2.vy += p * ny
      }
    }
  }

  rafId = requestAnimationFrame(updatePhysics)
}

function handleResize() {
  initPhysics()
}

onMounted(() => {
  initPhysics()
  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(updatePhysics)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.skills-physics-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 120;
  pointer-events: none;
}

.physics-skill-badge {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  font-size: clamp(0.75rem, 1.05vw, 0.84rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(250, 250, 250, 0.92);
  background: rgba(18, 5, 8, 0.45);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 6px 16px;
  border-radius: var(--radius-full, 9999px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  white-space: nowrap;
  user-select: none;
  will-change: transform;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}
</style>
