import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { userApi } from "./api/userApi";
import { balanceApi } from "./api/balanceApi";
import { expanceApi } from "./api/expanceApi";


let store = configureStore({
    reducer : rootReducer,
    middleware : (defaultMiddeware) => defaultMiddeware().concat(userApi.middleware , balanceApi.middleware , expanceApi.middleware ),
})



export default store