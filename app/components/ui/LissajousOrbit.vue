<template>
  <div class="lissajous-backdrop-wrap" :class="{ expanding: isStarted }">
    <canvas ref="canvasEl" width="500" height="500" aria-label="Large background Lissajous harmonic orbit"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  isStarted?: boolean
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let t = 0
let isVisible = false
let observer: IntersectionObserver | null = null

const render = () => {
  const canvas = canvasEl.value
  if (!canvas) {
    rafId = requestAnimationFrame(render)
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const R = 200

  let delta: number
  if (props.isStarted) {
    delta = Math.PI / 2
  } else {
    t += 0.008
    delta = t * 0.75
  }

  ctx.beginPath()
  const a = 3
  const b = 2

  for (let i = 0; i <= 360; i += 1.5) {
    const rad = (i * Math.PI) / 180
    const x = cx + R * Math.sin(a * rad + delta)
    const y = cy + R * Math.sin(b * rad)

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  grad.addColorStop(0, 'rgba(174, 59, 139, 0.75)')
  grad.addColorStop(0.5, 'rgba(225, 120, 136, 0.55)')
  grad.addColorStop(1, 'rgba(245, 184, 209, 0.45)')

  ctx.strokeStyle = grad
  ctx.lineWidth = 1.6
  ctx.stroke()

  if (isVisible && !props.isStarted) {
    rafId = requestAnimationFrame(render)
  }
}

watch(() => props.isStarted, (started) => {
  if (started) {
    render()
  }
})

onMounted(() => {
  if (canvasEl.value) {
    observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting
      if (isVisible) {
        rafId = requestAnimationFrame(render)
      } else {
        if (rafId) cancelAnimationFrame(rafId)
      }
    })
    observer.observe(canvasEl.value)
  }
})

onBeforeUnmount(() => {
  if (observer && canvasEl.value) {
    observer.unobserve(canvasEl.value)
    observer.disconnect()
  }
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.lissajous-backdrop-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 320px;
  height: 320px;
  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
  filter: drop-shadow(0 0 20px rgba(174, 59, 139, 0.45));
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
