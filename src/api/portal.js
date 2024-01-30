import { url } from '@/config';
import request from '../axios'
export const getPortalList = () => request({
  url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Query.json',
  // url: 'https://test.jinzhiyuns.com/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Query.json',
  method: 'post',
  // params: params
  // data
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



export const delObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Delete.json',
  method: 'post',
  params: {
    Kvids: id
  }
});
