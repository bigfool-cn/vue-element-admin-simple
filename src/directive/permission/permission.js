import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const buttons = store.getters && store.getters.buttons
    if (value && value.length > 0) {
      const permissionButton = value

      const hasPermission = buttons.includes(permissionButton)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need buttons! Like v-permission="system_button"`)
    }
  }
}
