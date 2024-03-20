import {url} from '@/config';
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
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal/Delete.json' + '?id=' + id,
    method: 'post',
    data: {
        id: id
    }
});


export const getDIFList = () => request({
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/Query.json',
    method: 'post',
});


export const createDIF = (data) => request({
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/CreateOrUpdate.json',
    method: 'post',
    data
});


export const delDIF = (id) => request({
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/Delete.json' + '?id=' + id,
    method: 'post',
    data: {
        id: id
    }
});


export const getDIFInfo = (data) => request({
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/GetInfo.json' + '?id=' + data,
    method: 'post',
});

// 获取数据接口参数
export const getDIFP = (data) => request({
    url: url + '/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/GetInfoToSQL.json' + '?id=' + data,
    method: 'post',
});