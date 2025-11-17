const httpKey = Symbol('http')

export default {
  install(app, options = {}) {
    const config = {
      baseURL: '',
      timeout: 10000,
      headers: {},
      ...options
    }

    const request = async (url, options = {}) => {
      const fullURL = url.startsWith('http') ? url : `${config.baseURL}${url}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      try {
        const response = await fetch(fullURL, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
            ...options.headers
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }
        throw error
      }
    }

    const api = {
      async get(url, options = {}) {
        return request(url, { ...options, method: 'GET' })
      },

      async post(url, data, options = {}) {
        return request(url, {
          ...options,
          method: 'POST',
          body: JSON.stringify(data)
        })
      },

      async put(url, data, options = {}) {
        return request(url, {
          ...options,
          method: 'PUT',
          body: JSON.stringify(data)
        })
      },

      async delete(url, options = {}) {
        return request(url, { ...options, method: 'DELETE' })
      }
    }

    app.provide(httpKey, api)
    app.config.globalProperties.$http = api
  }
}

export { httpKey }
