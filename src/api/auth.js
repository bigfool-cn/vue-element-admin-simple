import request from '@/utils/request'

export function getAuthList(params) {
  return request({
    url: '/system/get-auth-list',
    method: 'get',
    params: params
  })
}
