/**
 * Pinia Persistence Plugin
 *
 * Automatically saves and restores store state to/from localStorage
 *
 * Usage:
 * defineStore('myStore', () => {
 *   // ... store implementation
 * }, {
 *   persist: true  // Persist entire state
 *   // OR
 *   persist: ['field1', 'field2']  // Persist specific fields only
 * })
 */

export function persistencePlugin({ options, store }) {
  // Skip if persistence not enabled
  if (!options.persist) return

  const storageKey = `pinia-${store.$id}`

  // Determine which fields to persist
  const shouldPersistAll = options.persist === true
  const fieldsToSave = shouldPersistAll ? null : options.persist

  // Load saved state from localStorage
  try {
    const savedState = localStorage.getItem(storageKey)
    if (savedState) {
      const parsed = JSON.parse(savedState)

      if (shouldPersistAll) {
        // Restore all state
        store.$patch(parsed)
      } else {
        // Restore only specified fields
        const toRestore = {}
        for (const key of fieldsToSave) {
          if (key in parsed) {
            toRestore[key] = parsed[key]
          }
        }
        store.$patch(toRestore)
      }

      console.log(`[Persistence] Restored state for ${store.$id}`)
    }
  } catch (error) {
    console.error(`[Persistence] Failed to load state for ${store.$id}:`, error)
  }

  // Save state to localStorage on every change
  store.$subscribe((mutation, state) => {
    try {
      if (shouldPersistAll) {
        // Save all state
        localStorage.setItem(storageKey, JSON.stringify(state))
      } else {
        // Save only specified fields
        const toSave = {}
        for (const key of fieldsToSave) {
          if (key in state) {
            toSave[key] = state[key]
          }
        }
        localStorage.setItem(storageKey, JSON.stringify(toSave))
      }
    } catch (error) {
      console.error(`[Persistence] Failed to save state for ${store.$id}:`, error)
    }
  })
}
