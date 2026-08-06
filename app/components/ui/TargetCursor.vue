<template>
  <div class="relative w-full h-full min-h-[440px] flex flex-col items-center justify-center p-6 gap-6 select-none isolate">
    <!-- Interactive Target Playground Header -->
    <div class="text-center flex flex-col gap-1.5 max-w-md">
      <span class="text-[11px] font-mono tracking-widest uppercase text-rust dark:text-mustard font-bold">Target Lock Playground</span>
      <h4 class="text-lg font-bold tracking-tight text-ink dark:text-paper">Hover over any element below</h4>
      <p class="text-xs text-ink/60 dark:text-paper/60 leading-relaxed">
        The custom target cursor spins in idle mode, snaps corner brackets to targets matching <code class="px-1.5 py-0.5 rounded bg-paper-300 dark:bg-ink-800 text-rust font-mono text-[11px]">.cursor-target</code>, and transforms into an I-beam over inputs.
      </p>
    </div>

    <!-- Interactive Target Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-lg">
      <button
        type="button"
        class="cursor-target px-4 py-3 rounded-xl border border-rust/40 bg-rust/10 hover:bg-rust text-rust hover:text-paper font-semibold text-xs transition-colors flex items-center justify-center gap-2 btn-tactile shadow-sm"
      >
        <span>Lock Target Alpha</span>
      </button>

      <button
        type="button"
        class="cursor-target px-4 py-3 rounded-xl border border-teal-deep/40 bg-teal-deep/10 hover:bg-teal-deep text-teal-deep hover:text-paper font-semibold text-xs transition-colors flex items-center justify-center gap-2 btn-tactile shadow-sm"
      >
        <span>Lock Target Beta</span>
      </button>

      <button
        type="button"
        class="cursor-target px-4 py-3 rounded-xl border border-mustard/40 bg-mustard/10 hover:bg-mustard text-mustard hover:text-ink font-semibold text-xs transition-colors flex items-center justify-center gap-2 btn-tactile shadow-sm"
      >
        <span>Lock Target Gamma</span>
      </button>
    </div>

    <!-- Text Input Mode Demo -->
    <div class="w-full max-w-lg flex flex-col gap-2">
      <label class="text-[11px] font-mono text-ink/60 dark:text-paper/60">Hover over input for I-Beam mode:</label>
      <input
        type="text"
        placeholder="Type here to test I-beam text mode..."
        class="w-full px-4 py-2.5 rounded-xl border border-ink-200/80 dark:border-paper-400/20 bg-paper-100/90 dark:bg-ink-900/90 text-sm text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 outline-none focus:border-rust transition-colors shadow-inner"
      />
    </div>

    <!-- Target Cursor Fixed Overlay -->
    <Teleport to="body">
      <div
        v-if="enabled"
        ref="cursorRef"
        aria-hidden="true"
        class="tc-root"
        style="will-change: transform"
      >
        <!-- Central dot -->
        <div
          ref="dotRef"
          class="tc-dot"
          :style="{ willChange: 'transform', backgroundColor: activeColor }"
        />

        <!-- I-beam for text input fields -->
        <div
          ref="ibeamRef"
          class="tc-ibeam"
          :style="{ willChange: 'transform', color: activeColor, opacity: 0 }"
        >
          <div class="tc-ibeam-h" />
          <div class="tc-ibeam-v" />
          <div class="tc-ibeam-h" />
        </div>

        <!-- Four corner brackets (TL, TR, BR, BL) -->
        <div
          class="target-cursor-corner tc-corner tc-corner--tl"
          :style="{ willChange: 'transform', borderColor: activeColor }"
        />
        <div
          class="target-cursor-corner tc-corner tc-corner--tr"
          :style="{ willChange: 'transform', borderColor: activeColor }"
        />
        <div
          class="target-cursor-corner tc-corner tc-corner--br"
          :style="{ willChange: 'transform', borderColor: activeColor }"
        />
        <div
          class="target-cursor-corner tc-corner tc-corner--bl"
          :style="{ willChange: 'transform', borderColor: activeColor }"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

interface Props {
  targetSelector?: string
  spinDuration?: number
  hoverDuration?: number
  parallaxOn?: boolean
  cursorColor?: string
  cursorColorOnTarget?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetSelector: '.cursor-target',
  spinDuration: 5,
  hoverDuration: 0.2,
  parallaxOn: true,
  cursorColor: undefined,
  cursorColorOnTarget: undefined,
})

const CORNER = 12
const BORDER = 3
const IDLE_POS = [
  { x: -CORNER * 1.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: CORNER * 0.5 },
  { x: -CORNER * 1.5, y: CORNER * 0.5 },
]
const TEXT_ENTRY = 'input, textarea, [contenteditable="true"]'
const MOUNT_QUERY = '(pointer: fine) and (prefers-reduced-motion: no-preference)'

const enabled = ref(false)
const isDark = ref(false)
const cursorRef = ref<HTMLDivElement | null>(null)
const dotRef = ref<HTMLDivElement | null>(null)
const ibeamRef = ref<HTMLDivElement | null>(null)

const activeColor = computed(() => {
  if (props.cursorColor) return props.cursorColor
  return isDark.value ? '#F7F3EC' : '#14110F'
})

let ctx: gsap.Context | null = null
let mql: MediaQueryList | null = null
let darkObserver: MutationObserver | null = null

const handleMqChange = (e: MediaQueryListEvent | MediaQueryList) => {
  enabled.value = e.matches
}

function updateThemeState() {
  if (typeof document !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark')
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    updateThemeState()
    darkObserver = new MutationObserver(updateThemeState)
    darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    mql = window.matchMedia(MOUNT_QUERY)
    handleMqChange(mql)
    mql.addEventListener('change', handleMqChange)
  }
})

onBeforeUnmount(() => {
  if (mql) mql.removeEventListener('change', handleMqChange)
  if (darkObserver) darkObserver.disconnect()
  cleanupGsap()
})

watch(enabled, async (newVal) => {
  if (newVal) {
    await nextTick()
    initGsap()
  } else {
    cleanupGsap()
  }
})

watch(
  () => [activeColor.value, props.cursorColorOnTarget, props.targetSelector],
  () => {
    if (enabled.value) {
      cleanupGsap()
      nextTick(() => initGsap())
    }
  },
  { deep: true },
)

function cleanupGsap() {
  if (ctx) {
    ctx.revert()
    ctx = null
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('custom-cursor')
  }
}

function initGsap() {
  const cursor = cursorRef.value
  const dot = dotRef.value
  const ibeam = ibeamRef.value
  if (!cursor || !dot || !ibeam) return

  ctx = gsap.context(() => {
    const corners = Array.from(cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner'))
    const lockColor = props.cursorColorOnTarget ?? (isDark.value ? '#E3A008' : '#C1502E')

    document.body.classList.add('custom-cursor')

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    corners.forEach((c, i) => gsap.set(c, IDLE_POS[i]))
    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    gsap.set(ibeam, { xPercent: -50, yPercent: -50, scale: 0.5, autoAlpha: 0 })

    let spinTl: gsap.core.Timeline | null = null
    const startSpin = () => {
      spinTl?.kill()
      spinTl = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: props.spinDuration, ease: 'none' })
    }
    startSpin()

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3.out' })

    let activeTarget: Element | null = null
    let currentLeave: (() => void) | null = null
    let cornerTargets: { x: number; y: number }[] | null = null
    let ibeamMode = false
    const strength = { value: 0 }

    const setIbeam = (text: boolean) => {
      if (text === ibeamMode) return
      ibeamMode = text
      gsap.to(dot, { autoAlpha: text ? 0 : 1, scale: text ? 0.5 : 1, duration: 0.15, ease: 'power2.out' })
      gsap.to(ibeam, { autoAlpha: text ? 1 : 0, scale: text ? 1 : 0.5, duration: 0.15, ease: 'power2.out' })
    }

    const tick = () => {
      const ct = cornerTargets
      if (!ct || strength.value === 0) return
      const cx = gsap.getProperty(cursor, 'x') as number
      const cy = gsap.getProperty(cursor, 'y') as number
      corners.forEach((corner, i) => {
        const curX = gsap.getProperty(corner, 'x') as number
        const curY = gsap.getProperty(corner, 'y') as number
        const s = strength.value
        const finalX = curX + (ct[i].x - cx - curX) * s
        const finalY = curY + (ct[i].y - cy - curY) * s
        const duration = s >= 0.99 ? (props.parallaxOn ? 0.2 : 0) : 0.05
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto',
        })
      })
    }

    const paint = (color: string) => {
      gsap.to(corners, { borderColor: color, duration: 0.15, ease: 'power2.out' })
      gsap.to(dot, { backgroundColor: color, duration: 0.15, ease: 'power2.out' })
      gsap.to(ibeam, { color, duration: 0.15, ease: 'power2.out' })
    }

    const lockTo = (target: Element) => {
      if (target === activeTarget) return
      currentLeave?.()
      setIbeam(target.matches(TEXT_ENTRY))

      activeTarget = target
      corners.forEach((c) => gsap.killTweensOf(c, 'x,y'))
      spinTl?.pause()
      gsap.set(cursor, { rotation: 0 })
      paint(lockColor)

      const rect = target.getBoundingClientRect()
      const ct = [
        { x: rect.left - BORDER, y: rect.top - BORDER },
        { x: rect.right + BORDER - CORNER, y: rect.top - BORDER },
        { x: rect.right + BORDER - CORNER, y: rect.bottom + BORDER - CORNER },
        { x: rect.left - BORDER, y: rect.bottom + BORDER - CORNER },
      ]
      cornerTargets = ct

      gsap.to(strength, { value: 1, duration: props.hoverDuration, ease: 'power2.out' })
      gsap.ticker.add(tick)

      const cx = gsap.getProperty(cursor, 'x') as number
      const cy = gsap.getProperty(cursor, 'y') as number
      corners.forEach((corner, i) => {
        gsap.to(corner, { x: ct[i].x - cx, y: ct[i].y - cy, duration: 0.2, ease: 'power2.out' })
      })

      const leave = () => {
        if (target.isConnected && target.matches(':hover')) return
        target.removeEventListener('mouseleave', leave)
        if (activeTarget !== target) return
        activeTarget = null
        currentLeave = null
        gsap.ticker.remove(tick)
        cornerTargets = null
        gsap.killTweensOf(strength)
        strength.value = 0
        setIbeam(false)
        paint(activeColor.value)
        corners.forEach((c, i) => {
          gsap.killTweensOf(c, 'x,y')
          gsap.to(c, { ...IDLE_POS[i], duration: 0.3, ease: 'power3.out' })
        })
        startSpin()
      }
      currentLeave = leave
      target.addEventListener('mouseleave', leave)
    }

    const enter = (e: MouseEvent) => {
      const el = e.target as Element
      if (activeTarget && !activeTarget.isConnected) currentLeave?.()
      const target = el.closest?.(props.targetSelector) ?? el.closest?.(TEXT_ENTRY)
      if (!target) return
      lockTo(target)
    }

    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const down = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.3 })
      gsap.to(cursor, { scale: 0.9, duration: 0.2 })
    }
    const up = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 })
      gsap.to(cursor, { scale: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', enter, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', enter)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      gsap.ticker.remove(tick)
      spinTl?.kill()
      document.body.classList.remove('custom-cursor')
    }
  }, cursorRef.value)
}
</script>

<style>
/* Global: hide system cursor when custom cursor is active */
body.custom-cursor,
body.custom-cursor * {
  cursor: none !important;
}
</style>

<style scoped>
/* Zero-footprint root — GSAP positions this via transform */
.tc-root {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 0;
  height: 0;
}

/* Central dot */
.tc-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

/* I-beam for text inputs */
.tc-ibeam {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tc-ibeam-h {
  width: 8px;
  height: 2px;
  background: currentColor;
}

.tc-ibeam-v {
  width: 2px;
  height: 14px;
  background: currentColor;
}

/* Shared corner bracket base */
.tc-corner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border: 3px solid transparent;
}

/* Top-left: close right + bottom edges */
.tc-corner--tl {
  border-right: none;
  border-bottom: none;
}

/* Top-right: close left + bottom edges */
.tc-corner--tr {
  border-left: none;
  border-bottom: none;
}

/* Bottom-right: close left + top edges */
.tc-corner--br {
  border-left: none;
  border-top: none;
}

/* Bottom-left: close right + top edges */
.tc-corner--bl {
  border-right: none;
  border-top: none;
}
</style>
