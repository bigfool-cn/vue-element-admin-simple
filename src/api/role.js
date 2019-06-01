import request from '@/utils/request'

export function getSystemButton() {
  return request({
    url: '/system/router-tree',
    method: 'get'
  })
}
