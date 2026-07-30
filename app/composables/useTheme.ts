import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
    applyTheme()
  }

  function applyTheme() {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        localStorage.setItem('noirsito-theme', 'dark')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
        localStorage.setItem('noirsito-theme', 'light')
      }
    }
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = localStorage.getItem('noirsito-theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        isDark.value = false
      }
      applyTheme()
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
}
