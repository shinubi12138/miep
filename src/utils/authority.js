import { MANAGER, TEACHER } from './role'

const authorityKey = 'mini-program-cms-authority'

export function getAuthority() {
  // return localStorage.getItem(authorityKey)
  return 1;
}

export function setAuthority(role) {
  let authority = ''
  if (role === 1) {
    authority = TEACHER
  } else if (role === 2 || role === 3) { // 2 超级管理员 3 学校
    authority = MANAGER
  }
  return localStorage.setItem(authorityKey, authority)
}

export function removeAuthority() {
  return localStorage.removeItem(authorityKey)
}