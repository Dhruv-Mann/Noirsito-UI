<template>
  <div class="ribbon-canvas-wrapper" :class="{ broken: isCut }">
    <canvas ref="canvasEl" width="1920" height="1080" class="ribbon-canvas" @click="handleCut" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  (e: 'ribbonCut'): void
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let rafId: number | null = null
let time = 0

const isCut = ref(false)
let breakProgress = 0

interface RibbonParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}
let particles: RibbonParticle[] = []

let width = 0
let height = 0

function handleResize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent ? parent.clientWidth : 800
  height = canvas.height = parent ? parent.clientHeight : 400
}

function handleCut() {
  if (isCut.value) return
  isCut.value = true

  const centerX = width / 2
  const centerY = height / 2
  const colors = ['#ffffff', '#F5B8D1', '#E17888', '#AE3B8B']

  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 11
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1.5 + Math.random() * 3.5,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }

  setTimeout(() => {
    emit('ribbonCut')
  }, 480)
}

function render() {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  time += 0.0108

  const cy = height / 2
  const cx = width / 2

  if (isCut.value) {
    breakProgress += 0.042
  }

  const splitOffset = breakProgress * (width * 0.48)
  const delta = time * 0.90

  // Monochromatic Wireframe Gradient
  const grad = ctx.createLinearGradient(0, cy - 180, width, cy + 180)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
  grad.addColorStop(0.5, 'rgba(245, 184, 209, 0.35)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)')

  ctx.save()
  ctx.strokeStyle = grad
  ctx.lineWidth = 1.6

  // 1. END-TO-END HORIZONTAL LISSAJOUS TAILS
  const tailStrands = 5
  for (let s = 0; s < tailStrands; s++) {
    const phase = (s * Math.PI) / tailStrands

    // Left Tail: x = 0 to cx
    ctx.beginPath()
    for (let x = 0; x <= cx; x += 5) {
      const normX = (x / cx) * Math.PI
      const y = cy + Math.sin(3 * normX + delta + phase) * 26 * Math.cos(2 * normX)
      const drawX = x - splitOffset
      if (x === 0) ctx.moveTo(drawX, y)
      else ctx.lineTo(drawX, y)
    }
    ctx.stroke()

    // Right Tail: x = cx to width
    ctx.beginPath()
    for (let x = cx; x <= width; x += 5) {
      const normX = ((x - cx) / cx) * Math.PI
      const y = cy + Math.sin(3 * normX + delta + phase) * 26 * Math.cos(2 * normX)
      const drawX = x + splitOffset
      if (x === cx) ctx.moveTo(drawX, y)
      else ctx.lineTo(drawX, y)
    }
    ctx.stroke()
  }

  // 2. BUTTERFLY BOW-TIE RIBBON LOOPS
  const bowLayers = 4
  const R_bowX = Math.min(width * 0.22, 280)
  const R_bowY = Math.min(height * 0.26, 190)

  for (let layer = 0; layer < bowLayers; layer++) {
    const layerPhase = delta + (layer * Math.PI) / bowLayers

    // Left Flared Bow Wing
    ctx.beginPath()
    for (let i = 0; i <= 360; i += 2) {
      const rad = (i * Math.PI) / 180
      const rx = Math.pow(Math.sin(rad + layerPhase), 2) * Math.cos(rad) * R_bowX
      const ry = Math.sin(rad) * Math.cos(rad) * R_bowY * 1.35
      const bx = cx - Math.abs(rx)
      const by = cy + ry
      const drawX = bx - splitOffset

      if (i === 0) ctx.moveTo(drawX, by)
      else ctx.lineTo(drawX, by)
    }
    ctx.stroke()

    // Right Flared Bow Wing
    ctx.beginPath()
    for (let i = 0; i <= 360; i += 2) {
      const rad = (i * Math.PI) / 180
      const rx = Math.pow(Math.sin(rad + layerPhase), 2) * Math.cos(rad) * R_bowX
      const ry = Math.sin(rad) * Math.cos(rad) * R_bowY * 1.35
      const bx = cx + Math.abs(rx)
      const by = cy + ry
      const drawX = bx + splitOffset

      if (i === 0) ctx.moveTo(drawX, by)
      else ctx.lineTo(drawX, by)
    }
    ctx.stroke()
  }

  // 3. Central Tight Ribbon Knot Ring
  ctx.beginPath()
  ctx.arc(cx - splitOffset, cy, 14, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx + splitOffset, cy, 14, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()

  // 4. Render Ribbon Cut Spark Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.vx *= 0.92
    pt.vy *= 0.92
    pt.alpha -= 0.022

    if (pt.alpha <= 0) {
      particles.splice(i, 1)
    } else {
      ctx.save()
      ctx.globalAlpha = Math.max(0, pt.alpha)
      ctx.fillStyle = pt.color
      ctx.shadowColor = pt.color
      ctx.shadowBlur = 10
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size)
      ctx.restore()
    }
  }

  rafId = requestAnimationFrame(render)
}

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent ? parent.clientWidth : 800
  height = canvas.height = parent ? parent.clientHeight : 400

  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.ribbon-canvas-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 150;
  pointer-events: auto;
}

.ribbon-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
}

.bouncing-cursor-knot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 160;
  cursor: pointer;
  animation: bounce-jump 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  filter: drop-shadow(0 4px 14px rgba(255, 255, 255, 0.8));
  user-select: none;
}

@keyframes bounce-jump {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-14px) scale(1.1);
  }
}

.ribbon-canvas-wrapper.broken {
  pointer-events: none;
}
</style>
