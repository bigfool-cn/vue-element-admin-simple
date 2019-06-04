import request from '@/utils/request'

// 角色列表
export function getRole(roleId) {
  return request({
    url: '/system/role/get-role',
    method: 'get',
    params: { role_id: roleId }
  })
}

// 角色列表
export function getRoleList(params) {
  return request({
    url: '/system/role/role-list',
    method: 'get',
    params: params
  })
}

// 新增角色
export function createRole(data) {
  return request({
    url: '/system/role/create-role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role/update-role',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: '/system/role/delete-role',
    method: 'post',
    data
  })
}

// 更新角色可用状态
export function updateRoleEnable(data) {
  return request({
    url: '/system/role/update-role-enable',
    method: 'post',
    data
  })
}
