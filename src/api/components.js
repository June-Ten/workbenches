import { url } from '@/config';
import request from '../axios'
export const getList = (params) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_component/Query.json',
  method: 'get',
  params: params
});



export const getObj = (Kvid) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_component/Read.json',
  method: 'post',
  params: {
    Kvid:Kvid
  }
  // Kvid: Kvid
});

export const addObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_component/Create.json',
  method: 'post',
  data: {
    Item: data
  }
});
export const updateObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_component/Update.json',
  method: 'post',
  data: {
    Item: data
  }
});



export const delObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_component/Delete.json',
  method: 'post',
  params: {
    Kvids: id
  }
});
