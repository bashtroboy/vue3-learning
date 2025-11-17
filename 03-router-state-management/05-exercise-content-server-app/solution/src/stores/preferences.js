import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  // State
  const theme = ref('light')
  const itemsPerPage = ref(25)
  const defaultView = ref('list')

  // Actions
  function setTheme(newTheme) {
    theme.value = newTheme
    applyTheme()
  }

  function setItemsPerPage(count) {
    itemsPerPage.value = count
  }

  function setDefaultView(view) {
    defaultView.value = view
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function resetPreferences() {
    theme.value = 'light'
    itemsPerPage.value = 25
    defaultView.value = 'list'
    applyTheme()
  }

  // Apply theme on load
  applyTheme()

  return {
    // State
    theme,
    itemsPerPage,
    defaultView,
    // Actions
    setTheme,
    setItemsPerPage,
    setDefaultView,
    resetPreferences
  }
}, {
  persist: true
})
