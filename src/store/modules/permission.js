import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

export function filterAsyncRoutes(asyncRouter) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRoutes = []
  asyncRouter.forEach(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = () => import(`@/views${component}`)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRoutes(router.children)
    }
    accessedRoutes.push(router)
  })
  return accessedRoutes
}

const state = {
  routes: [],
  buttons: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRoutes({ commit }, { routers, buttons }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(routers).concat(errorRoutes)
      commit('SET_ROUTERS', accessedRoutes)
      commit('SET_BUTTONS', buttons)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
