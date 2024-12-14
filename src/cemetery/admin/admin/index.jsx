import { useEffect } from "react";
import ResponsiveDrawer from "../../../shared/layout/drawer-layout";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from '../../../hooks/useUser'
import { redirect } from "react-router-dom";
import { ROUTE_ADMIN_DASHBOARD, ROUTE_LOGIN } from "../../../constants";
import { process401Response, resetStorage } from "../../../utility";

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useUser()
  
  const onLogout = () => {
    resetStorage()
    navigate(ROUTE_LOGIN)
  }

  return (
    <ResponsiveDrawer
      user={{ user }}
      onLogout={onLogout}
      content={<Outlet />}
    />
  );
};
