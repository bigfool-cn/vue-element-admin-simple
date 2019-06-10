import { errorRouters, constantRouters } from '@/router'
import Layout from '@/layout'
// 获取组件的方法
const _import = require('@/router/_import_' + process.env.NODE_ENV)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param router
 */
// function hasPermission(roles, router) {
//   if (router.meta && router.meta.roles) {
//     return roles.some(role => router.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routers asyncrouters
 * @param roles
 */
// export function filterAsyncrouters(routers, roles) {
//   const res = []
//
//   routers.forEach(router => {
//     const tmp = { ...router }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncrouters(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }
export function filterAsyncRouters(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        router.component = _import(router.component)
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
  routers: constantRouters,
  buttons: [],
  addrouters: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addrouters = routers
    state.routers = constantRouters.concat(routers)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRouters({ commit }, { routers, buttons }) {
    return new Promise(resolve => {
      const accessedRouters = filterAsyncRouters(routers).concat(errorRouters)
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
