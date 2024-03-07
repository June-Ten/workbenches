// import request from '@/utils/request'
import { url } from '@/config';
import request from '@/axios'
export const createPortal = (data) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Create.json',
  method: 'post',
  data: {
    Item: data
  }
});

// 获取门户信息
export const getPortalInfo = (data) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Query.json' + '?id=' + data,
  method: 'post',
});


// 修改门户
export const updatePortal = (data) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Update.json' + '?id=' + data,
  method: 'post',
  data: {
    Item: data
  }
});

//创建门户详细信息
export const createPortalInfo = (data) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data/CreateOrUpdate.json',
  method: 'post',
  data
});
//门户详细信息
export const getPortalXXInfo = (data) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data/GetInfoByID.json' + '?id=' + data,
  method: 'post',
});
// // 获取门户信息
// export function getPortalInfo(id) {
//   return request({
//     url: `/api/visualdev/Portal/${id}`,
//     method: 'get'
//   })
// }
// // 删除门户
// export function Delete(id) {
//   return request({
//     url: `/api/visualdev/Portal/${id}`,
//     method: 'DELETE'
//   })
// }
// // 修改门户
// export function Update(data) {
//   return request({
//     url: `/api/visualdev/Portal/${data.id}`,
//     method: 'PUT',
//     data
//   })
// }
// // 新建门户
// export function Create(data) {
//   return request({
//     url: '/api/visualdev/Portal',
//     method: 'post',
//     data
//   })
// }
// // 复制门户
// export function Copy(id) {
//   return request({
//     url: `/api/visualdev/Portal/${id}/Actions/Copy`,
//     method: 'POST'
//   })
// }
// // 导出门户
// export function exportTemplate(id) {
//   return request({
//     url: `/api/visualdev/Portal/${id}/Actions/ExportData`,
//     method: 'POST'
//   })
// }
// // 获取门户下拉框列表
// export function getPortalSelector(type) {
//   return request({
//     url: '/api/visualdev/Portal/Selector?platform=Web',
//     method: 'GET',
//     data: { type }
//   })
// }
// // 切换用户门户默认显示
// export function SetDefault(id) {
//   return request({
//     url: `/api/visualdev/Portal/${id}/Actions/SetDefault?platform=Web`,
//     method: 'PUT'
//   })
// }
// // 获取门户展示数据(权限)
// export function getAuthPortal(id, data) {
//   return request({
//     url: `/api/visualdev/Portal/${id}/auth`,
//     method: 'GET',
//     data
//   })
// }
// // 获取全国省市区
// export function getAtlas() {
//   return request({
//     url: `/api/system/atlas`,
//     method: 'get',
//   })
// }
// // 获取地图json
// export function getMapData(id) {
//   return request({
//     url: `/api/system/atlas/geojson`,
//     method: 'get',
//     data: {
//       code: id,
//     }
//   })
// }
// // 用户拖拽后更新
// export function UpdateCustomPortal(id, data) {
//   return request({
//     url: `/api/visualdev/Portal/Custom/Save/${id}`,
//     method: 'PUT',
//     data
//   })
// }
//
// //禁用
// export function EnabledMark(id) {
//   return request({
//     url: `/api/visualdev/Portal/EnabledMark/${id}`,
//     method: 'PUT',
//   })
// }