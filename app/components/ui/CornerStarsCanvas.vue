<template>
  <div class="corner-stars-wrapper" :class="{ hidden: isStarted }">
    <canvas ref="canvasEl" width="1920" height="1080" class="stars-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

const props = defineProps<{
  isStarted?: boolean
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let rafId: number | null = null
let time = 0

// Mouse tracking
let mouseX = -1000
let mouseY = -1000

interface StarNode {
  id: number
  slotIndex: number
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  points: number
  color: string
  rotation: number
  scale: number
  targetScale: number
}

interface ConstellationParticle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
}

let stars: StarNode[] = []
let particles: ConstellationParticle[] = []
let width = 0
let height = 0
let isCollapsing = false
let lastHoveredSlot = -1

const COLOR_PALETTE = ['#AE3B8B', '#E17888', '#FF2A5F', '#F5B8D1']

function getSlotCoordinates(slot: number, w: number, h: number) {
  const margin = Math.min(110, Math.min(w, h) * 0.13)
  switch (slot) {
    case 0: return { x: margin, y: margin } // Top-Left
    case 1: return { x: w - margin, y: margin } // Top-Right
    case 2: return { x: margin, y: h - margin } // Bottom-Left
    case 3: return { x: w - margin, y: h - margin } // Bottom-Right
    default: return { x: 0, y: 0 }
  }
}

function initStars() {
  if (width === 0 || height === 0) return

  stars = []
  for (let i = 0; i < 4; i++) {
    const pos = getSlotCoordinates(i, width, height)
    stars.push({
      id: i,
      slotIndex: i,
      currentX: pos.x,
      currentY: pos.y,
      targetX: pos.x,
      targetY: pos.y,
      points: i % 2 === 0 ? 12 : 16,
      color: COLOR_PALETTE[i % COLOR_PALETTE.length],
      rotation: 0,
      scale: 1,
      targetScale: 1
    })
  }
}

function handleResize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent ? parent.clientWidth : 800
  height = canvas.height = parent ? parent.clientHeight : 400
  initStars()
}

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasEl.value
  if (!canvas) return

  // Bail out immediately if cursor is outside the canvas bounding box
  const rect = canvas.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const relY = e.clientY - rect.top

  if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) {
    mouseX = -1000
    mouseY = -1000
    lastHoveredSlot = -1
    return
  }

  // Scale from CSS px to canvas buffer px
  const scaleX = width / rect.width
  const scaleY = height / rect.height
  mouseX = relX * scaleX
  mouseY = relY * scaleY

  if (props.isStarted || isCollapsing) return

  let insideAnySlot = false

  for (let slot = 0; slot < 4; slot++) {
    const slotPos = getSlotCoordinates(slot, width, height)
    const dx = mouseX - slotPos.x
    const dy = mouseY - slotPos.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 180) {
      insideAnySlot = true
      if (lastHoveredSlot !== slot) {
        lastHoveredSlot = slot
        triggerConstellationImplosion(slot)
      }
      break
    }
  }

  if (!insideAnySlot) {
    lastHoveredSlot = -1
  }
}

function triggerConstellationImplosion(hoveredSlot: number) {
  isCollapsing = true
  const centerX = width / 2
  const centerY = height / 2

  stars.forEach(star => {
    star.targetX = centerX
    star.targetY = centerY
    star.targetScale = 0.4
  })

  setTimeout(() => {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = 3 + Math.random() * 7
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        alpha: 1,
        color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
      })
    }

    stars.forEach(star => {
      star.slotIndex = (star.slotIndex + 1) % 4
      const newPos = getSlotCoordinates(star.slotIndex, width, height)
      star.targetX = newPos.x
      star.targetY = newPos.y
      star.targetScale = 1.3
      const colorIdx = (star.slotIndex + hoveredSlot + Math.floor(Math.random() * 2)) % COLOR_PALETTE.length
      star.color = COLOR_PALETTE[colorIdx]
    })

    setTimeout(() => {
      stars.forEach(star => {
        star.targetScale = 1.0
      })
      isCollapsing = false
      lastHoveredSlot = -1
    }, 300)
  }, 220)
}

function drawHarmonicStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  points: number,
  radius: number,
  rot: number,
  color: string,
  scale: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.rotate(rot)

  const numPoints = points * 4
  ctx.beginPath()

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * Math.PI * 2) / numPoints
    const r = radius * (0.65 + 0.35 * Math.sin(points * angle + time * 2))
    const px = r * Math.cos(angle)
    const py = r * Math.sin(angle)

    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.closePath()

  ctx.strokeStyle = color
  ctx.lineWidth = 1.8
  ctx.stroke()

  ctx.beginPath()
  for (let i = 0; i <= 360; i += 5) {
    const rad = (i * Math.PI) / 180
    const ix = (radius * 0.45) * Math.sin(3 * rad + time * 1.5)
    const iy = (radius * 0.45) * Math.sin(2 * rad)
    if (i === 0) {
      ctx.moveTo(ix, iy)
    } else {
      ctx.lineTo(ix, iy)
    }
  }
  ctx.strokeStyle = 'rgba(245, 184, 209, 0.65)'
  ctx.lineWidth = 1.0
  ctx.stroke()

  ctx.restore()
}

function render() {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  time += 0.015

  if (!props.isStarted) {
    ctx.beginPath()
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        ctx.moveTo(stars[i].currentX, stars[i].currentY)
        ctx.lineTo(stars[j].currentX, stars[j].currentY)
      }
    }
    ctx.strokeStyle = 'rgba(174, 59, 139, 0.12)'
    ctx.lineWidth = 1
    ctx.stroke()

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i]
      pt.x += pt.vx
      pt.y += pt.vy
      pt.vx *= 0.93
      pt.vy *= 0.93
      pt.alpha -= 0.03

      if (pt.alpha <= 0) {
        particles.splice(i, 1)
      } else {
        ctx.fillStyle = pt.color
        ctx.globalAlpha = Math.max(0, pt.alpha)
        ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3)
      }
    }
    ctx.globalAlpha = 1

    stars.forEach(star => {
      star.currentX += (star.targetX - star.currentX) * 0.18
      star.currentY += (star.targetY - star.currentY) * 0.18
      star.scale += (star.targetScale - star.scale) * 0.18
      star.rotation += 0.008

      ctx.save()
      ctx.shadowColor = star.color
      ctx.shadowBlur = 22

      drawHarmonicStar(
        ctx,
        star.currentX,
        star.currentY,
        star.points,
        55,
        star.rotation,
        star.color,
        star.scale
      )

      ctx.restore()
    })
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
  window.addEventListener('mousemove', handleMouseMove)

  initStars()
  rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.corner-stars-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  pointer-events: none;
  transition: opacity 0.8s ease;
}

.corner-stars-wrapper.hidden {
  opacity: 0;
}

.stars-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
