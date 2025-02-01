import React, { useEffect, useMemo, useState } from 'react';
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from 'react-router-dom';
import {
  ADMIN,
  ROUTE_ABOUT,
  ROUTE_ADMIN,
  ROUTE_ADMIN_DASHBOARD,
  ROUTE_ADMIN_LOGIN,
  ROUTE_ADMIN_LOGS,
  ROUTE_ADMIN_MAP_SETTING,
  ROUTE_ADMIN_MAPPING,
  ROUTE_ADMIN_NOTIFICATION,
  ROUTE_ADMIN_PROFILING,
  ROUTE_ADMIN_REPORTS,
  ROUTE_ADMIN_USER_MANAGEMENT,
  ROUTE_CONTACT_US,
  ROUTE_FINDER,
  ROUTE_LOGIN,
  ROUTE_MAP_VIEW,
  ROUTE_REGISTRATION,
  TRESURER,
  ROUTE_ADMIN_PAYMENTS,
  ROUTE_GUEST_MAP_SETTING
} from './constants';
import {
  getToken,
  getUser,
  isNotEmpty,
  getPermission,
  getRole
} from './utility';

import { LoginPage } from './cemetery/login';
import { RegistrationPage } from './cemetery/registration';
import { Finder } from './cemetery/finder';
import { About } from './cemetery/about';
import { ContactUs } from './cemetery/contact-us';
import { MapView } from './cemetery/map-view';

import { AdminPanel } from './cemetery/admin/admin';
import { ErrorPage } from './cemetery/error-page';
//import { Logs } from "./cemetery/admin/logs";
import { Profiling } from './cemetery/admin/profiling';
import { Payments } from './cemetery/admin/payments';

import { Reports } from './cemetery/admin/reports';
import { Notification } from './cemetery/admin/notification';
import { UserManagement } from './cemetery/admin/user-management';
import { Dashboard } from './cemetery/admin/dashboard';
import { Mapping } from './cemetery/admin/mapping';
import { MapSetting } from './cemetery/admin/map-setting';
import { useNavigate } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { apiConfig } from './config/apiConfig';
import axios from 'axios';

console.log({ dex: `${apiConfig.baseUrl}api` })
axios.defaults.baseURL = `${apiConfig.baseUrl}api`

function ProtectedRoutes({ children, permission }) {
  const navigate = useNavigate();

  useEffect(() => {
    const responsePermission = getPermission();
    const token = getToken();
    const user = getUser();

    if (
      !responsePermission ||
      !token ||
      !user ||
      !responsePermission[permission]
    ) {
      navigate(ROUTE_LOGIN);
    }
  }, []);

  return <>{children}</>;
}

function AdminProtectedRoutes({ children, permission }) {
  const navigate = useNavigate();
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const responsePermission = getPermission();
    const token = getToken();
    const user = getUser();

    console.log(user?.accountType)
    console.log({ responsePermission: responsePermission[permission] })
    if (!responsePermission || !token || !user) {
      navigate(ROUTE_LOGIN);
    } else {
      const show =
        user?.accountType === 'admin'
          ? permission
            ? responsePermission[permission]
            : true
          : false;
      setShowChildren(true);
    }
  }, [getToken(), getUser(), getPermission()]);

  return <>{showChildren ? children : <>No rights to view this page</>}</>;
}

const appRoutes = [
  {
    path: ROUTE_LOGIN,
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: ROUTE_REGISTRATION,
    element: <RegistrationPage />
  },
  {
    path: ROUTE_ABOUT,
    element: (
      <ProtectedRoutes permission="canViewGuest">
        <About />
      </ProtectedRoutes>
    )
  },
  {
    path: ROUTE_CONTACT_US,
    element: (
      <ProtectedRoutes permission="canViewGuest">
        <ContactUs />
      </ProtectedRoutes>
    )
  },
  {
    path: ROUTE_FINDER,
    element: (
      <ProtectedRoutes permission="canViewGuest">
        <Finder />
      </ProtectedRoutes>
    )
  },
  {
    path: ROUTE_MAP_VIEW,
    element: (
      <ProtectedRoutes permission="canViewGuest">
        <MapView />
      </ProtectedRoutes>
    )
  },
  {
    path: ROUTE_ADMIN_MAP_SETTING,
    element: (
      <AdminProtectedRoutes permission="canViewMapping">
        <MapSetting />
      </AdminProtectedRoutes>
    )
  },

  {
    path: ROUTE_GUEST_MAP_SETTING,
    element: (
      <AdminProtectedRoutes permission="canViewMapping">
        <MapSetting />
      </AdminProtectedRoutes>
    )
  },

  {
    path: ROUTE_ADMIN_MAPPING,
    element: (
      <AdminProtectedRoutes permission="canViewMapping">
        <Mapping />
      </AdminProtectedRoutes>
    )
  },
  {
    path: ROUTE_ADMIN,
    element: (
      <AdminProtectedRoutes>
        <AdminPanel />
      </AdminProtectedRoutes>
    ),
    children: [
      {
        path: ROUTE_ADMIN_USER_MANAGEMENT,
        element: (
          <AdminProtectedRoutes permission="canViewUserManagement">
            <UserManagement />
          </AdminProtectedRoutes>
        )
      },
      {
        path: ROUTE_ADMIN_PROFILING,
        element: (
          <AdminProtectedRoutes permission="canViewProfiling">
            <Profiling />
          </AdminProtectedRoutes>
        )
      },

      {
        path: ROUTE_ADMIN_PAYMENTS,
        element: (
          <AdminProtectedRoutes permission="canViewProfiling">
            <Payments />
          </AdminProtectedRoutes>
        )
      },

      // {
      //   path: ROUTE_ADMIN_LOGS,
      //   element: (
      //     <AdminProtectedRoutes permission="canViewLogsX">
      //       <Logs />
      //     </AdminProtectedRoutes>
      //   ),
      // },
      {
        path: ROUTE_ADMIN_NOTIFICATION,
        element: (
          <AdminProtectedRoutes permission="canViewNotificationsX">
            <Notification />
          </AdminProtectedRoutes>
        )
      },
      {
        path: ROUTE_ADMIN_REPORTS,
        element: (
          <AdminProtectedRoutes permission="canViewReportsX">
            <Reports />
          </AdminProtectedRoutes>
        )
      },
      {
        path: ROUTE_ADMIN_DASHBOARD,
        element: (
          <AdminProtectedRoutes permission="canViewLocalEconomicEnterprise">
            <Dashboard />
          </AdminProtectedRoutes>
        )
      }
    ]
  }
];

function App() {
  return <RouterProvider router={createBrowserRouter(appRoutes)} />;
}

export default App;
