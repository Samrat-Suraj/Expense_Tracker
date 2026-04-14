import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice"
import { userApi } from "./api/userApi";
import { balanceApi } from "./api/balanceApi";
import { expanceApi } from "./api/expanceApi";


let rootReducer = combineReducers({
    user : userSlice,
    [userApi.reducerPath] : userApi.reducer,
    [balanceApi .reducerPath] : balanceApi.reducer,
    [expanceApi.reducerPath] : expanceApi.reducer,
})

export default rootReducer