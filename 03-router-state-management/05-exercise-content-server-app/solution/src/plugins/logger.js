/**
 * Pinia Logger Plugin
 *
 * Logs all action calls with timing information
 * Useful for debugging and performance monitoring
 *
 * Note: Should only be used in development mode
 */

export function loggerPlugin({ store }) {
  // Log when actions are called
  store.$onAction(({ name, args, after, onError }) => {
    const startTime = Date.now()
    const timestamp = new Date().toLocaleTimeString()

    console.group(`🔵 [${store.$id}] ${name} @ ${timestamp}`)
    console.log('Arguments:', args)

    after((result) => {
      const duration = Date.now() - startTime
      console.log(`✅ Success (${duration}ms)`)
      if (result !== undefined) {
        console.log('Result:', result)
      }
      console.groupEnd()
    })

    onError((error) => {
      const duration = Date.now() - startTime
      console.log(`❌ Error (${duration}ms)`)
      console.error('Error:', error)
      console.groupEnd()
    })
  })

  // Log state changes (optional - can be very verbose)
  // Uncomment to see all state mutations
  /*
  store.$subscribe((mutation, state) => {
    console.log(`[${store.$id}] State changed:`, {
      type: mutation.type,
      storeId: mutation.storeId,
      payload: mutation.payload
    })
  })
  */
}
