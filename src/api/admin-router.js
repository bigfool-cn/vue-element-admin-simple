import request from '@/utils/request'

export function getAdminRouterTree() {
  return request({
    url: '/system/router/router-tree',
    method: 'get'
  })
}

export function createAdminRouter(data) {
  return request({
    url: '/system/router/create-router',
    method: 'post',
    data
  })
}
export function updateAdminRouter(data) {
  return request({
    url: '/system/router/update-router',
    method: 'post',
    data
  })
}

export function deleteAdminRouter(data) {
  return request({
    url: '/system/router/delete-router',
    method: 'post',
    data
  })
}

export function getAdminRouter(id) {
  return request({
    url: '/system/router/get-admin-router',
    method: 'get',
    params: { id: id }
  })
}

export function updateAdminRouterSort(data) {
  return request({
    url: '/system/router/update-router-sort',
    method: 'post',
    data
  })
}
