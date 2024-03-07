import { url } from '@/config';
import request from '../axios'

// 获取门户列表
export const getPortalList = () => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Query.json',
  method: 'post',
});
//登录接口
export const loginJk = () => request({
  url: url + '/auth/kivii.json?UserName=tcy&Password=tcy123456&UseTokenCookie=true',
  method: 'post',
});
//删除接口
export const Delete = (id) => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Delete.json'+'?id='+id,
  method: 'post',
  data: {
    id: id
  }
});

// export const getObj = (Kvid) => request({
//   url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Read.json',
//   method: 'POST',
//   data: {
//     Kvid
//   }
// });
//
// export const addObj = (data) => request({
//   url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Create.json',
//   method: 'post',
//   data: {
//     Item: data
//   }
// });
// export const updateObj = (data) => request({
//   url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Update.json',
//   method: 'post',
//   data: {
//     Item: data
//   }
// });



