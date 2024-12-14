import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiConfig } from '../config';
import {
  process401Response,
  storeUserTokenPermission
} from '../utility/response-util';
import { ROUTE_LOGIN } from '../constants';
import { getToken } from '../utility';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery(apiConfig),
  endpoints: builder => ({
    adminLogin: builder.mutation({
      query: body => ({
        url: `/guest/login`,
        method: 'POST',
        body
      }),
      transformErrorResponse: response => {
        console.log('transformErrorResponse', response);
        return response;
      },
      transformResponse: response => {
        console.log('transformResponse', response);
        if (response?.data) {
          const { user, token, permission } = response?.data;
          if (user && token && permission) {
            storeUserTokenPermission(response);
          }
        }
        return response;
      }
    }),

    adminRegisterUser: builder.mutation({
      query: body => ({
        url: `/register/admin`,
        method: 'POST',
        body,
        headers: {
          'account-type': body?.role,
          Authorization: `Bearer ${getToken()}`
        }
      }),
      transformErrorResponse: response => {
        //remove permission, token, user from the localstorage
        if (response?.status == 401) {
          process401Response(response);
        }
      },
      transformResponse: response => {
        console.log('transformResponse', response);
        return response;
      }
    }),

    adminAddDeceased: builder.mutation({
      query: body => ({
        url: `/admin/deceased`,
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }),
      transformErrorResponse: response => {
        //remove permission, token, user from the localstorage
        if (response?.status == 401) {
          process401Response(response);
        }
      },
      transformResponse: response => {
        console.log('transformResponse', response);
        return response;
      }
    }),

    adminFetchDeceased: builder.query({
      query: () => ({
        url: `/admin/deceased`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` }
      }),
      transformErrorResponse: response => {
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        return response.deceased.map(item => ({
          id: item.deceasedId,
          firstName: item.firstName,
          lastName: item.lastName,
          born: item.born,
          died: item.died,
          place: item.cemeteryLocation,
          ...item
        }));
      }
    }),

    adminFetchDeceasedById: builder.query({
      query: id => ({
        url: `admin/deceased/${id}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` }
      }),
      transformErrorResponse: response => {
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        return response;
      }
    }),

    adminPatchDeceasedById: builder.mutation({
      query: body => ({
        url: `admin/deceased/${body.deceasedId}`,
        method: 'PATCH',
        body,
        headers: { Authorization: `Bearer ${getToken()}` }
      }),
      transformErrorResponse: response => {
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        return response;
      }
    }),

    adminFetchUsers: builder.query({
      query: () => ({
        url: `/admin/user`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` }
      }),
      transformErrorResponse: response => {
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        return response.list.map(item => ({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          userName: item.userId,
          position: item.accountType,
          ...item
        }));
      }
    })
  })
});

export const {
  useAdminLoginMutation,
  useAdminRegisterUserMutation,
  useAdminFetchDeceasedQuery,
  useLazyAdminFetchDeceasedQuery,
  useAdminFetchDeceasedByIdQuery,
  useAdminPatchDeceasedByIdMutation,
  useAdminAddDeceasedMutation,
  useLazyAdminFetchUsersQuery
} = adminApi;
