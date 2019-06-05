import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'System',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'system', roles: ['admin'] },
    children: [
      {
        path: 'router',
        name: 'Router',
        component: () => import('@/views/system/router'),
        meta: { title: '路由管理', roles: ['admin'] }
      },
      {
        path: 'button',
        name: 'Button',
        component: () => import('@/views/system/button'),
        meta: { title: '按钮管理', roles: ['admin'] }
      },
      {
        path: '/system/user-manage',
        component: () => import('@/views/system/user-manage'),
        redirect: 'noRedirect',
        name: 'UserManage',
        alwaysShow: true,
        meta: { title: '用户管理', roles: ['admin'] },
        children: [
          {
            path: 'adminuser',
            name: 'AdminUser',
            component: () => import('@/views/system/user-manage/adminuser'),
            meta: { title: '管理员', roles: ['admin'] }
          },
          {
            path: 'adminuser/add',
            name: 'AdminUserAdd',
            component: () => import('@/views/system//user-manage/adminuser/add'),
            hidden: true,
            meta: { title: '管理员--新增', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'auth-manage',
        name: 'AuthManage',
        component: () => import('@/views/system/auth-manage'),
        alwaysShow: true,
        redirect: 'noRedirect',
        meta: { title: '权限管理', roles: ['admin'] },
        children: [
          {
            path: 'role',
            name: 'Role',
            component: () => import('@/views/system/auth-manage/role'),
            meta: { title: '角色管理', roles: ['admin'] }
          },
          {
            path: 'role/add',
            name: 'RoleAdd',
            component: () => import('@/views/system/auth-manage/role/add'),
            hidden: true,
            meta: { title: '角色管理--新增', roles: ['admin'] }
          },
          {
            path: 'role/edit',
            name: 'RoleEdit',
            component: () => import('@/views/system/auth-manage/role/edit'),
            hidden: true,
            meta: { title: '角色管理-修改', roles: ['admin'] }
          },
          {
            path: 'auth',
            name: 'Auth',
            component: () => import('@/views/system/auth-manage/auth'),
            meta: { title: '权限列表', roles: ['admin'] }
          }
        ]
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
