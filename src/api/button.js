import request from '@/utils/request'

// 按钮列表
export function getSystemButtonList(params) {
  return request({
    url: '/system/button/button-list',
    method: 'get',
    params: params
  })
}

// 新增按钮
export function createSystemButton(data) {
  return request({
    url: '/system/create-button',
    method: 'post',
    data
  })
}

// 修改按钮
export function updateSystemButton(data) {
  return request({
    url: '/system/button/update-button',
    method: 'post',
    data
  })
}

// 删除按钮
export function deleteSystemButton(data) {
  return request({
    url: '/system/button/delete-button',
    method: 'post',
    data
  })
}

// 删除按钮
export function updateSystemButtonEnable(data) {
  return request({
    url: '/system/button/update-button-enable',
    method: 'post',
    data
  })
}

// 全部按钮
export function getSystemButtonAll(is_enable) {
  return request({
    url: '/system/button/button-all',
    method: 'get',
    param: { is_enable: is_enable }
  })
}
