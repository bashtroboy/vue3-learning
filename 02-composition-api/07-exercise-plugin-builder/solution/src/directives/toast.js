export const vToast = {
  mounted(el, binding, vnode) {
    const showToast = () => {
      const notify = vnode.appContext.config.globalProperties.$notify ||
                     vnode.appContext.provides[Symbol.for('notification')]
      if (notify && typeof binding.value === 'string') {
        notify.info(binding.value)
      }
    }
    el.addEventListener('click', showToast)
    el._toastCleanup = () => el.removeEventListener('click', showToast)
  },
  unmounted(el) {
    el._toastCleanup?.()
  }
}
