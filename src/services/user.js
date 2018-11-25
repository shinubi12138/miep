import request from '../utils/request'
import config from '../config'

const { domain } = config

export const login = params => request(`${domain}user/login`, { method: 'POST', body: JSON.stringify(params) })
export const getUserInfo = () => request(`${domain}user/info`, { method: 'POST'})