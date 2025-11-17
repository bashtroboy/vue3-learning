export const vTrack = {
  mounted(el, binding, vnode) {
    const track = () => {
      const analytics = vnode.appContext.provides[Symbol.for('analytics')]
      if (analytics) {
        analytics.track(binding.value || 'element_interaction', {
          action: binding.arg || 'click'
        })
      }
    }
    el.addEventListener(binding.arg || 'click', track)
    el._trackCleanup = () => el.removeEventListener(binding.arg || 'click', track)
  },
  unmounted(el) {
    el._trackCleanup?.()
  }
}
