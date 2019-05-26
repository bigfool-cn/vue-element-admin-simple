import request from '@/utils/request'

// 按钮列表
export function getSystemButtonList(page, row) {
  return request({
    url: '/system/button-list',
    method: 'get',
    params: { page: page, row: row }
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
    url: '/system/update-button',
    method: 'post',
    data
  })
}

// 删除按钮
export function deleteSystemButton(data) {
  return request({
    url: '/system/delete-button',
    method: 'post',
    data
  })
}

// 删除按钮
export function updateSystemButtonEnable(data) {
  return request({
    url: '/system/update-button-enable',
    method: 'post',
    data
  })
}
