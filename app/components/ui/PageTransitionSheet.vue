<template>
  <div 
    class="pink-sweep-sheet" 
    :class="[sweepStage, { 'red-mode': isBloodHovered || isScrollActive }]"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @wheel="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
  >
    <!-- Blood Droplets Canvas Layer -->
    <canvas ref="dropletsCanvasRef" class="blood-droplets-canvas" />

    <!-- Blade Slice Sparks Canvas Layer -->
    <canvas ref="sliceCanvasRef" class="slice-canvas" />

    <!-- Raycast ASCII Scramble & Implosion Particle Burst Stage -->
    <div 
      class="quote-editorial-wrapper font-display"
      :style="{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${implosionScale})`,
        opacity: implosionOpacity
      }"
    >
      <!-- Line 1: Giving up | is not in the | BLOOD | , sir, -->
      <div class="quote-line line-1">
        <span 
          class="phrase-medium"
          :style="{ transform: `translate(${offsetTL.x * implosionFactor}px, ${offsetTL.y * implosionFactor}px)` }"
        >
          {{ displayGivingUp }}
        </span>

        <span 
          class="phrase-medium"
          :style="{ transform: `translate(${offsetTR.x * implosionFactor}px, ${offsetTR.y * implosionFactor}px)` }"
        >
          {{ displayIsNotInThe1 }}
        </span>

        <span 
          ref="bloodWord1Ref"
          class="blood-giant"
          :style="{
            transform: `translate(${offsetTR.x * implosionFactor}px, ${offsetTR.y * implosionFactor}px) scale(${kineticScale1})`,
            fontWeight: kineticWeight1,
            letterSpacing: `${kineticSpacing1}em`
          }"
        >
          {{ displayBlood1 }}
        </span>

        <span 
          class="sir-delicate"
          :style="{ transform: `translate(${offsetTR.x * implosionFactor}px, ${offsetTR.y * implosionFactor}px)` }"
        >
          {{ displaySir }}
        </span>
      </div>
      
      <!-- Line 2: it's not in the | BLOOD. -->
      <div class="quote-line line-2">
        <span 
          class="phrase-medium"
          :style="{ transform: `translate(${offsetBL.x * implosionFactor}px, ${offsetBL.y * implosionFactor}px)` }"
        >
          {{ displayIsNotInThe2 }}
        </span>

        <span 
          ref="bloodWord2Ref"
          class="blood-giant"
          :style="{
            transform: `translate(${offsetBR.x * implosionFactor}px, ${offsetBR.y * implosionFactor}px) scale(${kineticScale2})`,
            fontWeight: kineticWeight2,
            letterSpacing: `${kineticSpacing2}em`
          }"
        >
          {{ displayBlood2 }}
        </span>
      </div>
    </div>

    <!-- Scroll Progress Indicator Bar -->
    <div v-if="sweepStage === 'full' && scrollProgress < 0.95" class="scroll-prompt font-mono">
      <span>SCROLL DOWN TO ANIMATE</span>
      <div class="scroll-track">
        <div class="scroll-thumb" :style="{ width: `${scrollProgress * 100}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  sweepStage?: 'idle' | 'halfway' | 'recoil' | 'full'
}>(), {
  sweepStage: 'full'
})

const isBloodHovered = ref(false)
const dropletsCanvasRef = ref<HTMLCanvasElement | null>(null)
const sliceCanvasRef = ref<HTMLCanvasElement | null>(null)
const bloodWord1Ref = ref<HTMLElement | null>(null)
const bloodWord2Ref = ref<HTMLElement | null>(null)

let dropletRafId: number | null = null
let sliceRafId: number | null = null

// 1. 3D Parallax Tilt State
const tiltX = ref(0)
const tiltY = ref(0)

// 2. Kinetic Variable Font Proximity States
const kineticWeight1 = ref(900)
const kineticSpacing1 = ref(-0.04)
const kineticScale1 = ref(1)

const kineticWeight2 = ref(900)
const kineticSpacing2 = ref(-0.04)
const kineticScale2 = ref(1)

// 3. Blade Slice Tracking
const isMouseDown = ref(false)
let lastMouseX = 0
let lastMouseY = 0

interface SliceParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}
let sliceParticles: SliceParticle[] = []
interface SliceTrail {
  x: number
  y: number
  alpha: number
}
let sliceTrail: SliceTrail[] = []

const scrollProgress = ref(0)
const isScrollActive = ref(false)
let accumScroll = 0
const maxScroll = 800

const asciiChars = '$#*%?@01XZΔΩΞΨØ█░▒'

function scrambleString(text: string, progress: number) {
  if (progress <= 0) return text
  const scrambleRatio = Math.min(1, progress / 0.55)
  return text
    .split('')
    .map((ch, idx) => {
      if (ch === ' ') return ' '
      const threshold = idx / text.length
      if (scrambleRatio > threshold * 0.4) {
        const seed = Math.floor((scrambleRatio * 17 + idx * 7) % asciiChars.length)
        return asciiChars[seed]
      }
      return ch
    })
    .join('')
}

const displayGivingUp = computed(() => scrambleString('Giving up', scrollProgress.value))
const displayIsNotInThe1 = computed(() => scrambleString('is not in the', scrollProgress.value))
const displayBlood1 = computed(() => scrambleString('BLOOD', scrollProgress.value))
const displaySir = computed(() => scrambleString(', sir,', scrollProgress.value))
const displayIsNotInThe2 = computed(() => scrambleString("it's not in the", scrollProgress.value))
const displayBlood2 = computed(() => scrambleString('BLOOD.', scrollProgress.value))

const implosionFactor = computed(() => {
  if (scrollProgress.value < 0.55) return 0
  return (scrollProgress.value - 0.55) / 0.45
})

const implosionScale = computed(() => {
  if (scrollProgress.value < 0.55) return 1.0
  const p = (scrollProgress.value - 0.55) / 0.45
  if (p < 0.6) return 1.0 - p * 0.4
  return 0.6 + (p - 0.6) * 1.5
})

const implosionOpacity = computed(() => {
  if (scrollProgress.value < 0.7) return 1.0
  if (scrollProgress.value >= 0.95) return 0.2
  return 1.0 - (scrollProgress.value - 0.7) / 0.25
})

const offsetTL = computed(() => ({ x: -200, y: -150 }))
const offsetTR = computed(() => ({ x: 200, y: -150 }))
const offsetBL = computed(() => ({ x: -200, y: 150 }))
const offsetBR = computed(() => ({ x: 200, y: 150 }))

function updateBloodHover(mx: number, my: number) {
  const r1 = bloodWord1Ref.value?.getBoundingClientRect()
  const r2 = bloodWord2Ref.value?.getBoundingClientRect()
  const pad = 24

  const inWord1 = r1 && (mx >= r1.left - pad && mx <= r1.right + pad && my >= r1.top - pad && my <= r1.bottom + pad)
  const inWord2 = r2 && (mx >= r2.left - pad && mx <= r2.right + pad && my >= r2.top - pad && my <= r2.bottom + pad)

  isBloodHovered.value = !!(inWord1 || inWord2)
}

function handleMouseMove(e: MouseEvent) {
  const { innerWidth, innerHeight } = window
  const mouseX = e.clientX
  const mouseY = e.clientY

  tiltX.value = (-(mouseY - innerHeight / 2) / (innerHeight / 2)) * 8
  tiltY.value = ((mouseX - innerWidth / 2) / (innerWidth / 2)) * 8

  updateKineticFont(mouseX, mouseY, bloodWord1Ref.value, kineticWeight1, kineticSpacing1, kineticScale1)
  updateKineticFont(mouseX, mouseY, bloodWord2Ref.value, kineticWeight2, kineticSpacing2, kineticScale2)
  updateBloodHover(mouseX, mouseY)

  const dx = mouseX - lastMouseX
  const dy = mouseY - lastMouseY
  const speed = Math.sqrt(dx * dx + dy * dy)

  sliceTrail.push({ x: mouseX, y: mouseY, alpha: 1.0 })
  if (sliceTrail.length > 25) sliceTrail.shift()

  if (speed > 16) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8
      const sparkSpeed = 3 + Math.random() * 7
      sliceParticles.push({
        x: mouseX,
        y: mouseY,
        vx: Math.cos(angle) * sparkSpeed,
        vy: Math.sin(angle) * sparkSpeed,
        life: 1.0,
        color: Math.random() > 0.4 ? '#FF2A5F' : '#ffffff'
      })
    }
  }

  lastMouseX = mouseX
  lastMouseY = mouseY
}

function updateKineticFont(
  mx: number,
  my: number,
  el: HTMLElement | null,
  weightRef: { value: number },
  spacingRef: { value: number },
  scaleRef: { value: number }
) {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)

  const maxDist = 280
  if (dist < maxDist) {
    const factor = 1 - dist / maxDist
    weightRef.value = Math.round(900 + factor * 100)
    spacingRef.value = -0.04 + factor * 0.08
    scaleRef.value = 1 + factor * 0.07
  } else {
    weightRef.value = 900
    spacingRef.value = -0.04
    scaleRef.value = 1
  }
}

function handleMouseDown() { isMouseDown.value = true }
function handleMouseUp() { isMouseDown.value = false }

function handleWheel(e: WheelEvent) {
  accumScroll += e.deltaY * 0.45
  accumScroll = Math.max(0, Math.min(maxScroll, accumScroll))
  scrollProgress.value = accumScroll / maxScroll
  isScrollActive.value = accumScroll > 0
}

let touchStartY = 0
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) touchStartY = e.touches[0].clientY
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 0) return
  const currentY = e.touches[0].clientY
  const deltaY = (touchStartY - currentY) * 0.75
  touchStartY = currentY

  accumScroll += deltaY
  accumScroll = Math.max(0, Math.min(maxScroll, accumScroll))
  scrollProgress.value = accumScroll / maxScroll
  isScrollActive.value = accumScroll > 0
}

interface BloodDroplet {
  x: number
  y: number
  radius: number
  length: number
  speed: number
  opacity: number
  color: string
}
let droplets: BloodDroplet[] = []

function initDroplets() {
  const canvas = dropletsCanvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  canvas.width = parent ? parent.clientWidth : 800
  canvas.height = parent ? parent.clientHeight : 500

  const sliceCanvas = sliceCanvasRef.value
  if (sliceCanvas) {
    sliceCanvas.width = parent ? parent.clientWidth : 800
    sliceCanvas.height = parent ? parent.clientHeight : 500
  }

  droplets = []
  const count = 42
  const darkRedShades = ['#800014', '#5A000D', '#9A0019', '#3D0008', '#6B0010']

  for (let i = 0; i < count; i++) {
    droplets.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 3 + Math.random() * 9,
      length: 10 + Math.random() * 26,
      speed: 1.2 + Math.random() * 2.8,
      opacity: 0.75 + Math.random() * 0.25,
      color: darkRedShades[Math.floor(Math.random() * darkRedShades.length)]
    })
  }
}

function renderDroplets() {
  const canvas = dropletsCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (isBloodHovered.value || isScrollActive.value) {
    droplets.forEach(d => {
      d.y += d.speed

      if (d.y > canvas.height + 40) {
        d.y = -30
        d.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.globalAlpha = d.opacity
      ctx.fillStyle = d.color
      ctx.shadowColor = '#240005'
      ctx.shadowBlur = 10

      ctx.beginPath()
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI)
      ctx.lineTo(d.x, d.y - d.length)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.15, d.radius * 0.32, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    })
  }

  dropletRafId = requestAnimationFrame(renderDroplets)
}

function renderSliceCanvas() {
  const canvas = sliceCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (sliceTrail.length > 1) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = '#FF2A5F'
    ctx.lineWidth = 2.5
    ctx.shadowColor = '#FF2A5F'
    ctx.shadowBlur = 12

    for (let i = 0; i < sliceTrail.length; i++) {
      const pt = sliceTrail[i]
      pt.alpha -= 0.04
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    }
    ctx.stroke()
    ctx.restore()
    
    sliceTrail = sliceTrail.filter(p => p.alpha > 0)
  }

  for (let i = sliceParticles.length - 1; i >= 0; i--) {
    const pt = sliceParticles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.life -= 0.035

    if (pt.life <= 0) {
      sliceParticles.splice(i, 1)
    } else {
      ctx.save()
      ctx.globalAlpha = Math.max(0, pt.life)
      ctx.fillStyle = pt.color
      ctx.shadowColor = pt.color
      ctx.shadowBlur = 8
      ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3)
      ctx.restore()
    }
  }

  sliceRafId = requestAnimationFrame(renderSliceCanvas)
}

function handleResize() {
  initDroplets()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  initDroplets()
  dropletRafId = requestAnimationFrame(renderDroplets)
  sliceRafId = requestAnimationFrame(renderSliceCanvas)
})

onBeforeUnmount(() => {
  if (dropletRafId) cancelAnimationFrame(dropletRafId)
  if (sliceRafId) cancelAnimationFrame(sliceRafId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pink-sweep-sheet {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: radial-gradient(circle at 50% 50%, #240b12 0%, #0d0506 65%, #000000 100%);
  border-top: 3px solid #AE3B8B;
  box-shadow: 0 -20px 90px rgba(0, 0, 0, 0.95), inset 0 0 140px rgba(174, 59, 139, 0.3);
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.42s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.42s ease, 
              box-shadow 0.42s ease;
}

.blood-droplets-canvas,
.slice-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.slice-canvas {
  z-index: 25;
}

.pink-sweep-sheet.red-mode {
  background: radial-gradient(circle at 50% 50%, #FF2A5F 0%, #B30030 55%, #5E0018 100%);
  border-top-color: #ffffff;
  box-shadow: 0 0 140px rgba(255, 42, 95, 0.85), inset 0 0 160px rgba(255, 255, 255, 0.25);
}

.quote-editorial-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 3vw, 32px);
  text-align: center;
  max-width: 1200px;
  padding: 0 var(--space-phi-lg, 32px);
  transform-style: preserve-3d;
  will-change: transform;
}

.quote-line {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: clamp(12px, 2.2vw, 24px);
  flex-wrap: wrap;
  line-height: 1.05;
  transform-style: preserve-3d;
}

.phrase-medium,
.blood-giant,
.sir-delicate {
  will-change: transform, opacity, font-weight, letter-spacing;
  transition: opacity 0.1s linear, color 0.4s ease;
}

.phrase-medium {
  font-size: clamp(1.5rem, 3.8vw, 2.8rem);
  font-weight: 600;
  color: #FAFAFA;
  opacity: 0.94;
}

.blood-giant {
  font-size: clamp(3.2rem, 8vw, 6rem);
  font-weight: 900;
  color: #FF2A5F;
  text-shadow: 0 0 32px rgba(255, 42, 95, 0.95),
               0 0 70px rgba(255, 42, 95, 0.55),
               0 0 110px rgba(174, 59, 139, 0.45);
  text-transform: uppercase;
  cursor: pointer;
}

.pink-sweep-sheet.red-mode .blood-giant {
  color: #000000;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.5);
}

.sir-delicate {
  font-size: clamp(1.2rem, 2.4vw, 2rem);
  font-weight: 400;
  font-style: italic;
  color: #E17888;
}

.pink-sweep-sheet.red-mode .sir-delicate {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
}

.scroll-prompt {
  position: absolute;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 20;
  color: #E17888;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
}

.scroll-track {
  width: 140px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.scroll-thumb {
  height: 100%;
  background: #FF2A5F;
  box-shadow: 0 0 10px #FF2A5F;
  transition: width 0.1s linear;
}
</style>
