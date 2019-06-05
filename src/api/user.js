import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getAdminUserList(params) {
  return request({
    url: '/system/user/adminuser-list',
    method: 'get',
    params: params
  })
}

export function createAdminUser(data) {
  return request({
    url: '/system/user/create-adminuser',
    method: 'post',
    data
  })
}

export function updateAdminUserActive(data) {
  return request({
    url: '/system/user/update-adminuser-active',
    method: 'post',
    data
  })
}

export function updateAdminUserPassword(data) {
  return request({
    url: '/system/user/update-adminuser-password',
    method: 'post',
    data
  })
}

export function updateUserPassword(data) {
  return request({
    url: '/user/update-user-password',
    method: 'post',
    data
  })
}
