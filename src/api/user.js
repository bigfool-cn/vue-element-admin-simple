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

export function getAdminUsers(page, row) {
  return request({
    url: '/user/adminuser-list',
    method: 'get',
    params: { page: page, row: row }
  })
}

export function createAdminUser(data) {
  return request({
    url: '/user/create-adminuser',
    method: 'post',
    data
  })
}

export function updateAdminUserActive(data) {
  return request({
    url: '/user/update-adminuser-active',
    method: 'post',
    data
  })
}

export function updateAdminUserPassword(data) {
  return request({
    url: '/user/update-adminuser-password',
    method: 'post',
    data
  })
}
