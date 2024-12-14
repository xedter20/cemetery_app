import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import finderSlice from "../cemetery/finder/slice";
import loginSlice from "../cemetery/login/slice";
import registrationSlice from "../cemetery/registration/slice";
import mapViewSlice from "../cemetery/map-view/slice";

import { clientApi } from "../service/clientService";
import { adminApi } from "../service/adminService";

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    mapViewSlice,
    finderSlice,
    loginSlice,
    registrationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      clientApi.middleware
    ),
});

setupListeners(store.dispatch);