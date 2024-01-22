import { url } from '@/config';
import request from '../axios'
export const getList = (params) => {
  const data = {
    current: params.current,
    size: params.size
  }
  return request({
    url: url + '/Restful/JinQue.DataV.Entities.blade_visual_map/Query.json',
    method: 'get',
    params: data
  })
};




export const getObj = (Kvid) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_map/Read.json',
  method: 'get',
  params: {
    Kvid
  }
});

export const addObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_map/Create.json',
  method: 'post',
  data: {
    Item: data
  }
});
export const updateObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_map/Update.json',
  method: 'post',
  data: {
    Item: data
  }
});



export const delObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_map/Delete.json',
  method: 'post',
  params: {
    Kvids: id
  }
});
