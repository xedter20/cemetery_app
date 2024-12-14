import { appConfig } from '../config'
import {
  STO_TOKEN,
  STO_PERMISSION,
  STO_ROLE,
  CLIENT,
  STO_USER,
  ADMIN,
} from "../constants";


export const setUser = (data) => {
  localStorage.setItem(STO_USER, data);
};
export const getUser = () => {
  const data = localStorage.getItem(STO_USER);
  if (data) {
    return JSON.parse(data)
  }
  return null;
};
export const resetUser = () => {
  localStorage.removeItem(STO_USER);
};


export const setRole = (data) => {
  localStorage.setItem(STO_ROLE, data);
};
export const getRole = () => {
  return localStorage.getItem(STO_ROLE);
};
export const resetRole = () => {
  localStorage.removeItem(STO_ROLE);
};


export const setPermission = (data) => {
  localStorage.setItem(STO_PERMISSION, data);
};
export const getPermission = () => {
  const permissions = localStorage.getItem(STO_PERMISSION);
  if (permissions) {
    return JSON.parse(permissions);
  }
  return null
};
export const resetPermission = () => {
  localStorage.removeItem(STO_PERMISSION);
};


export const setToken = (data) => {
  localStorage.setItem(STO_TOKEN, data);
};
export const getToken = () => {
  return localStorage.getItem(STO_TOKEN);
};
export const resetToken = () => {
  localStorage.removeItem(STO_TOKEN);
};

