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
