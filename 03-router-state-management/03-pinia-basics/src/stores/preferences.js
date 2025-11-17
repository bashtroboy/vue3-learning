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
    // Persist to localStorage
    localStorage.setItem('pinia-preferences-theme', newTheme)
    // Apply theme to document
    applyTheme()
  }

  function setItemsPerPage(count) {
    itemsPerPage.value = count
    // Persist to localStorage
    localStorage.setItem('pinia-preferences-itemsPerPage', String(count))
  }

  function setDefaultView(view) {
    defaultView.value = view
    // Persist to localStorage
    localStorage.setItem('pinia-preferences-defaultView', view)
  }

  function loadPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('pinia-preferences-theme')
    if (savedTheme) {
      theme.value = savedTheme
    }

    // Load items per page
    const savedItemsPerPage = localStorage.getItem('pinia-preferences-itemsPerPage')
    if (savedItemsPerPage) {
      itemsPerPage.value = parseInt(savedItemsPerPage)
    }

    // Load default view
    const savedDefaultView = localStorage.getItem('pinia-preferences-defaultView')
    if (savedDefaultView) {
      defaultView.value = savedDefaultView
    }

    // Apply theme
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function resetPreferences() {
    theme.value = 'light'
    itemsPerPage.value = 25
    defaultView.value = 'list'

    // Clear localStorage
    localStorage.removeItem('pinia-preferences-theme')
    localStorage.removeItem('pinia-preferences-itemsPerPage')
    localStorage.removeItem('pinia-preferences-defaultView')

    applyTheme()
  }

  // Load preferences on store creation
  loadPreferences()

  return {
    // State
    theme,
    itemsPerPage,
    defaultView,
    // Actions
    setTheme,
    setItemsPerPage,
    setDefaultView,
    loadPreferences,
    resetPreferences
  }
})
