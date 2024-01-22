import { url } from '@/config';
import request from '../axios'
export const getList = (params) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Query.json',
  method: 'get',
  params: params
});



export const getObj = (Kvid) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Read.json',
  method: 'POST',
  data: {
    Kvid
  }
});

export const addObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Create.json',
  method: 'post',
  data: {
    Item: data
  }
});
export const updateObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Update.json',
  method: 'post',
  data: {
    Item: data
  }
});



export const delObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Delete.json',
  method: 'post',
  params: {
    Kvids: id
  }
});
