import {
  resetPermission,
  resetToken,
  resetUser,
  setPermission,
  setToken,
  setUser,
} from "./localstorage-manager";

export const resetStorage = () => {
  resetToken(null);
  resetUser(null);
  resetPermission(null);
};

export const process401Response = (response) => {
  if (response?.status == 401) {
    resetStorage()
  }
};

export const storeUserTokenPermission = ({ user, token, permissions }) => {
  if (user) {
    setUser(user);
  }
  if (token) {
    setToken(token);
  }
  if (permissions) {
    setPermission(permissions);
  }
};
