import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiConfig } from '../config';
import {
  getToken,
  process401Response,
  resetStorage,
  storeUserTokenPermission
} from '../utility';

export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: fetchBaseQuery(apiConfig),
  endpoints: builder => ({
    clientLogin: builder.mutation({
      query: body => ({
        url: `/guest/login`,
        method: 'POST',
        body
      }),
      transformErrorResponse: response => {
        console.log('transformErrorResponse', response);
        if (response) {
          resetStorage();
        }
        return {
          status: response?.status,
          message: response.data?.message
        };
      },
      transformResponse: response => {
        if (response) {
          storeUserTokenPermission({
            token: response.token ?? null,
            user: response.user ? JSON.stringify(response?.user) : null,
            permissions: response.permissions
              ? JSON.stringify(response?.permissions)
              : null
          });
        }
        return {
          status: 200,
          message: 'Successfully login'
        };
      }
    }),
    clientRegister: builder.mutation({
      query: body => ({
        url: `/register/client`,
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }),
      transformErrorResponse: response => {
        return response;
      },
      transformResponse: response => {
        return response;
      }
    }),
    clientSearchDeceased: builder.query({
      query: fullname => ({
        url: `/guest/search`,
        method: 'GET',
        params: { fullname },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }),
      transformErrorResponse: response => {
        console.log('clientRegister', response);
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        console.log('clientRegister', response);
        return response;
      }
    }),
    clientSearchDeceasedResultListDex: builder.query({
      query: fullname => ({
        url: `/guest/searchAll`,
        method: 'GET',
        params: { fullname },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }),
      transformErrorResponse: response => {
        console.log('clientRegister', response);
        if (response?.status == 401) {
          process401Response(response);
        }
        return response;
      },
      transformResponse: response => {
        console.log('useLazyClientSearchDeceasedResultListDexQuery', response);
        return response;
      }
    })
  })
});

export const {
  useClientLoginMutation,
  useClientRegisterMutation,
  useClientSearchDeceasedQuery,
  useLazyClientSearchDeceasedQuery,
  useLazyClientSearchDeceasedResultListDexQuery
} = clientApi;
