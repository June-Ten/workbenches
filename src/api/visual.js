import { url } from '@/config';
import { config } from '@/option/config'
import request from '../axios'
export const getList = (params) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/Query.json',
  method: 'get',
  params: params
});



export const copyObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/Copy.json',
  method: 'post',
  params: {
    Kvid: id
  }
});

export const getCategory = (params) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual_category/Query.json',
  method: 'get',
  params: params
});

export const getObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/detail.json',
  method: 'post',
  params: {
    Kvid:id
  }
});
export const uploadImg = (file) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/UploadFile.json',
  method: 'post',
  data: 'file=' + file,
  headers: { "Content-Type": "multipart/form-data" }
});

export const addObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/Save.json',
  method: 'post',
  data: {
    visual: {
      password: data.password,
      category_value: data.category_value,
      status: data.Status,
      title: data.title,
      background_url: '',
    },
    config: {
      detail: JSON.stringify(Object.assign(config, {
        name: data.title,
        width: data.width,
        height: data.height
      })),
      component: '[]'
    },
  }
});

export const updateComponent = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/Update.json',
  method: 'post',
  data: data
});

export const updateObj = (data) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/change.json',
  method: 'post',
  data: {
    "visual": {
      "Kvid": data.Kvid,
      "password": data.password,
      "category_value": data.category,
      "status": data.status,
      "title": data.title,
    }
  }
});

export const delObj = (id) => request({
  url: url + '/Restful/JinQue.DataV.Entities.blade_visual/Remove.json',
  method: 'post',
  params: {
    Kvids: id
  }
});
