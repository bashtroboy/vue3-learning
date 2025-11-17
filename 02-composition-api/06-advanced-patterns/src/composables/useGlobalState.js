import { ref } from 'vue'

const theme = ref('light')
const user = ref(null)

export function useGlobalState() {
  function setUser(newUser) {
    user.value = newUser
  }

  return {
    theme,
    user,
    setUser
  }
}
