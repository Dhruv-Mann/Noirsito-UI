<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isStarted?: boolean
}>()

const internalStarted = ref(props.isStarted ?? false)
watch(() => props.isStarted, (val) => {
  if (val !== undefined) internalStarted.value = val
})

function handleStart() {
  internalStarted.value = true
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

const targetText = 'CLICK ANYWHERE TO INITIALIZE SYSTEM'
const displayText = ref(targetText)
const asciiChars = ['#', '$', '%', '&', '*', '?', '@', '0', '1', 'X', 'Z', 'Δ', 'Ω', 'Ξ', 'Ψ', 'Ø', '█', '░', '▒']

let scrambleInterval: number | null = null
let autoTimer: number | null = null
let hoverInterval: number | null = null
let isScrambling = false
const isHovered = ref(false)

function handleMouseEnter() {
  isHovered.value = true
  if (scrambleInterval) clearInterval(scrambleInterval)
  if (hoverInterval) clearInterval(hoverInterval)

  hoverInterval = window.setInterval(() => {
    if (isHovered.value) {
      displayText.value = targetText
        .split('')
        .map((char) => {
          if (char === ' ') return ' '
          return asciiChars[Math.floor(Math.random() * asciiChars.length)]
        })
        .join('')
    }
  }, 40)
}

function handleMouseLeave() {
  isHovered.value = false
  if (hoverInterval) clearInterval(hoverInterval)
  displayText.value = targetText
}

function triggerScramble() {
  if (isScrambling || isHovered.value) return
  isScrambling = true
  let frame = 0
  const maxFrames = 18

  if (scrambleInterval) clearInterval(scrambleInterval)

  scrambleInterval = window.setInterval(() => {
    if (isHovered.value) {
      if (scrambleInterval) clearInterval(scrambleInterval)
      isScrambling = false
      return
    }

    frame++
    const progress = frame / maxFrames

    displayText.value = targetText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index / targetText.length < progress) {
          return char
        }
        return asciiChars[Math.floor(Math.random() * asciiChars.length)]
      })
      .join('')

    if (frame >= maxFrames) {
      if (scrambleInterval) clearInterval(scrambleInterval)
      displayText.value = targetText
      isScrambling = false
    }
  }, 32)
}

let mouseX = -1000
let mouseY = -1000

interface Shockwave {
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
}
let shockwaves: Shockwave[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}
let particles: Particle[] = []

interface PixelBlock {
  col: number
  row: number
  x: number
  y: number
  size: number
  alpha: number
  targetAlpha: number
  emergeDelay: number
  cornerType: 'bottom-right' | 'top-left' | 'bottom-left'
  microJitter: number
  currentScale: number
}

let pixelGrid: PixelBlock[] = []
let cols = 0
let rows = 0
let width = 0
let height = 0
const pixelSize = 20

function seededRandom(x: number, y: number) {
  const sinVal = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return sinVal - Math.floor(sinVal)
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent ? parent.clientWidth : 800
  height = canvas.height = parent ? parent.clientHeight : 400
  initDeterministicGrid()
}


function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const relY = e.clientY - rect.top

  // Bail out if cursor is outside the preview canvas bounding box
  if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) {
    mouseX = -1000
    mouseY = -1000
    return
  }

  // Scale CSS px coordinates to canvas buffer coordinates
  const scaleX = width / rect.width
  const scaleY = height / rect.height
  mouseX = relX * scaleX
  mouseY = relY * scaleY
}

function handleCanvasClick(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const relY = e.clientY - rect.top
  if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) return

  handleStart()

  // Scale to canvas buffer coordinates
  const scaleX = width / rect.width
  const scaleY = height / rect.height
  const canvasX = relX * scaleX
  const canvasY = relY * scaleY

  shockwaves.push({
    x: canvasX,
    y: canvasY,
    radius: 0,
    maxRadius: Math.max(width, height) * 0.75,
    speed: 18
  })

  const colors = ['#AE3B8B', '#E17888', '#ffffff', '#F5B8D1']
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2.5 + Math.random() * 6.5
    particles.push({
      x: canvasX,
      y: canvasY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 3,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }
}

function initDeterministicGrid() {
  pixelGrid = []
  if (width === 0 || height === 0) return

  cols = Math.ceil(width / pixelSize)
  rows = Math.ceil(height / pixelSize)

  const textFocusX = width * 0.28
  const textFocusY = height * 0.48

  const radiusX = Math.max(300, width * 0.38)
  const radiusY = Math.max(260, height * 0.38)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * pixelSize
      const y = r * pixelSize

      const dx = (x - textFocusX) / radiusX
      const dy = (y - textFocusY) / radiusY
      const dist = Math.sqrt(dx * dx + dy * dy)

      const seed = seededRandom(c, r)
      let densityProb = 1

      if (dist < 0.65) {
        densityProb = 0
      } else if (dist < 1.15) {
        const t = (dist - 0.65) / 0.5
        densityProb = t * t
      }

      if (densityProb <= 0 || seed > densityProb) {
        continue
      }

      const microJitter = seededRandom(c * 17.3, r * 31.7) * 0.18

      const distBR = Math.sqrt(Math.pow(cols - 1 - c, 2) + Math.pow(rows - 1 - r, 2))
      const isBRZone = (c / cols > 0.35 || r / rows > 0.45)

      if (isBRZone && seed < 0.825 * densityProb) {
        const delayBR = distBR * 0.045
        pixelGrid.push({
          col: c,
          row: r,
          x,
          y,
          size: pixelSize,
          alpha: 0,
          targetAlpha: 0.4 + seed * 0.6,
          emergeDelay: delayBR,
          cornerType: 'bottom-right',
          microJitter,
          currentScale: 0.2
        })
        continue
      }

      const distTL = Math.sqrt(Math.pow(c, 2) + Math.pow(r, 2))
      const isTLZone = (c / cols < 0.35 && r / rows < 0.35)

      if (isTLZone && seed < 0.22 * densityProb) {
        const delayTL = 0.9 + distTL * 0.063
        pixelGrid.push({
          col: c,
          row: r,
          x,
          y,
          size: pixelSize,
          alpha: 0,
          targetAlpha: 0.3 + seed * 0.5,
          emergeDelay: delayTL,
          cornerType: 'top-left',
          microJitter,
          currentScale: 0.2
        })
        continue
      }

      const distBL = Math.sqrt(Math.pow(c, 2) + Math.pow(rows - 1 - r, 2))
      const isBLZone = (c / cols < 0.4 && r / rows > 0.7)

      if (isBLZone && seed < 0.264 * densityProb) {
        const delayBL = 0.9 + distBL * 0.054
        pixelGrid.push({
          col: c,
          row: r,
          x,
          y,
          size: pixelSize,
          alpha: 0,
          targetAlpha: 0.35 + seed * 0.55,
          emergeDelay: delayBL,
          cornerType: 'bottom-left',
          microJitter,
          currentScale: 0.2
        })
      }
    }
  }
}

let startTime: number | null = null

function render(time: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#341514'
  ctx.fillRect(0, 0, width, height)

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i]
    sw.radius += sw.speed
    if (sw.radius > sw.maxRadius) {
      shockwaves.splice(i, 1)
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.vx *= 0.94
    pt.vy *= 0.94
    pt.alpha -= 0.024

    if (pt.alpha <= 0) {
      particles.splice(i, 1)
    } else {
      ctx.fillStyle = pt.color
      ctx.globalAlpha = Math.max(0, pt.alpha)
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size)
    }
  }

  if (internalStarted.value) {
    if (!startTime) startTime = time
    const elapsed = (time - startTime) / 1000

    pixelGrid.forEach(p => {
      const pixelEmergeTime = p.emergeDelay + p.microJitter

      if (elapsed > pixelEmergeTime) {
        p.currentScale += (1.0 - p.currentScale) * 0.16
        const easeProgress = Math.min(1, (elapsed - pixelEmergeTime) * 2.8)
        p.alpha += (p.targetAlpha * easeProgress - p.alpha) * 0.095

        const dx = mouseX - (p.x + p.size / 2)
        const dy = mouseY - (p.y + p.size / 2)
        const dist = Math.sqrt(dx * dx + dy * dy)
        let opacityMultiplier = 1

        if (dist < 140) {
          opacityMultiplier = 1.3 - (dist / 140) * 0.3
        }

        shockwaves.forEach(sw => {
          const swDx = (p.x + p.size / 2) - sw.x
          const swDy = (p.y + p.size / 2) - sw.y
          const swDist = Math.sqrt(swDx * swDx + swDy * swDy)
          const ringWidth = 60
          if (Math.abs(swDist - sw.radius) < ringWidth) {
            const waveIntensity = 1 - Math.abs(swDist - sw.radius) / ringWidth
            opacityMultiplier += waveIntensity * 0.65
          }
        })

        const renderSize = p.size * p.currentScale
        const renderOffsetX = (p.size - renderSize) / 2
        const renderOffsetY = (p.size - renderSize) / 2

        ctx.fillStyle = '#AE3B8B'
        ctx.globalAlpha = Math.min(1, p.alpha * opacityMultiplier)
        
        ctx.fillRect(p.x + renderOffsetX, p.y + renderOffsetY, renderSize, renderSize)
      }
    })
  }

  ctx.globalAlpha = 1
  animationFrameId = requestAnimationFrame(render)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent ? parent.clientWidth : 800
  height = canvas.height = parent ? parent.clientHeight : 400

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleCanvasClick)

  initDeterministicGrid()
  setTimeout(initDeterministicGrid, 50)

  autoTimer = window.setInterval(() => {
    if (!internalStarted.value && !isHovered.value) {
      triggerScramble()
    }
  }, 4000)

  animationFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (scrambleInterval) clearInterval(scrambleInterval)
  if (hoverInterval) clearInterval(hoverInterval)
  if (autoTimer) clearInterval(autoTimer)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('click', handleCanvasClick)
})
</script>

<template>
  <div class="pixel-canvas-wrapper">
    <canvas ref="canvasRef" class="pixel-canvas" />

    <Transition name="fade">
      <div v-if="!internalStarted" class="click-prompt-overlay" @click="handleStart">
        <div class="prompt-content">
          <div class="jumping-cursor">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#AE3B8B">
              <path d="M13.64 21.97l-3.22-6.66-3.83 3.83V2.5l14.7 11.47-5.4 1.13 3.22 6.66-5.47 2.21z" />
            </svg>
          </div>
          <span 
            class="prompt-text font-mono"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            {{ displayText }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pixel-canvas-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pixel-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.click-prompt-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: rgba(52, 21, 20, 0.4);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.prompt-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #ffffff;
  pointer-events: auto;
}

.jumping-cursor {
  animation: jump 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  filter: drop-shadow(0 4px 12px rgba(174, 59, 139, 0.6));
  pointer-events: none;
}

.prompt-text {
  font-size: 0.875rem;
  letter-spacing: 0.18em;
  color: #E17888;
  background: rgba(52, 21, 20, 0.85);
  padding: 8px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(174, 59, 139, 0.4);
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
}

.prompt-text:hover {
  color: #ffffff;
  border-color: #AE3B8B;
  box-shadow: 0 0 24px rgba(174, 59, 139, 0.6);
}

@keyframes jump {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-16px) scale(1.08);
  }
}

.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
</style>
