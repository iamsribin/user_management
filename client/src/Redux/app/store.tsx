import { configureStore } from "@reduxjs/toolkit";
import useReducer from "../features/userSlice";
import {thunk} from 'redux-thunk'

export const store = configureStore({
  reducer: {
    UserData: useReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
