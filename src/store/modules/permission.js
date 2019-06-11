import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

export function filterAsyncRouters(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        router.component = () => import(`@/views${router.component}`)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouters(router.children)
    }
    return true
  })
  return accessedRouters
}

const state = {
  routers: [],
  buttons: [],
  addRouters: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRouters({ commit }, { routers, buttons }) {
    return new Promise(resolve => {
      const accessedRouters = filterAsyncRouters(routers).concat(errorRoutes)
      commit('SET_ROUTERS', accessedRouters)
      commit('SET_BUTTONS', buttons)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
