<template>
  <div class="fractal-tree-wrap">
    <canvas ref="canvasEl" width="220" height="220" aria-label="Animated fractal tree growing dynamically"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let frameCount = 0
let angle = 0
let isVisible = false
let observer: IntersectionObserver | null = null

const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
}

const branch = (ctx: CanvasRenderingContext2D, len: number) => {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, -len)
  ctx.stroke()

  ctx.translate(0, -len)

  if (len > 4) {
    ctx.save()
    ctx.rotate(angle)
    branch(ctx, len * 0.67)
    ctx.restore()

    ctx.save()
    ctx.rotate(-angle)
    branch(ctx, len * 0.67)
    ctx.restore()
  }
}

const render = () => {
  const canvas = canvasEl.value
  if (!canvas) {
    rafId = requestAnimationFrame(render)
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  frameCount++

  const sinVal = Math.sin(frameCount * 0.012)
  angle = map(sinVal, -1, 1, Math.PI / 2.2, Math.PI / 14)

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height * 0.92)
  
  const grad = ctx.createLinearGradient(0, 0, 0, -50)
  grad.addColorStop(0, '#AE3B8B')
  grad.addColorStop(1, '#E17888')
  ctx.strokeStyle = grad
  ctx.lineWidth = 1.2
  
  branch(ctx, 42)
  ctx.restore()

  if (isVisible) {
    rafId = requestAnimationFrame(render)
  }
}

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
.fractal-tree-wrap {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 130px;
  vertical-align: middle;
  pointer-events: none;
  filter: drop-shadow(0 0 16px rgba(174, 59, 139, 0.6));
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
