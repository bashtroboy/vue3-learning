import { ref, computed } from 'vue'

const i18nKey = Symbol('i18n')

const translations = {
  en: {
    greeting: 'Hello!',
    welcome: 'Welcome to our application',
    description: 'This is a demonstration of the i18n plugin system',
    items: 'You have {count} items'
  },
  es: {
    greeting: '¡Hola!',
    welcome: 'Bienvenido a nuestra aplicación',
    description: 'Esta es una demostración del sistema de plugins i18n',
    items: 'Tienes {count} elementos'
  },
  fr: {
    greeting: 'Bonjour!',
    welcome: 'Bienvenue dans notre application',
    description: 'Ceci est une démonstration du système de plugins i18n',
    items: 'Vous avez {count} éléments'
  }
}

export default {
  install(app, options = {}) {
    const locale = ref(options.locale || 'en')
    const fallback = options.fallback || 'en'

    const t = (key, params = {}) => {
      let translation = translations[locale.value]?.[key] || translations[fallback]?.[key] || key

      // Replace parameters
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })

      return translation
    }

    const api = {
      locale,
      t,
      setLocale(newLocale) {
        if (translations[newLocale]) {
          locale.value = newLocale
        }
      }
    }

    app.provide(i18nKey, api)
    app.config.globalProperties.$t = t
    app.config.globalProperties.$i18n = api
  }
}

export { i18nKey }
