import request from '@/utils/request'

export function getAuthList(params) {
  return request({
    url: '/system/auth-list',
    method: 'get',
    params: params
  })
}
