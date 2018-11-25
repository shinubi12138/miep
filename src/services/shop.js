import request from '../utils/request'
import config from '../config'

const { domain } = config

export const getAllShop = () => request(`${domain}shop/getAllShop`, { method: 'POST'})
export const addShop = (params) => request(`${domain}shop/addStore`, { method: 'POST', body: JSON.stringify(params)})
export const deleteShop = (params) => request(`${domain}shop/deleteStore`, { method: 'POST', body: JSON.stringify(params)})
export const getCommodityList = (params) => request(`${domain}shop/getCommodityList`, { method: 'POST', body: JSON.stringify(params)})