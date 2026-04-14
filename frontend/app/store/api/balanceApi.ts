import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BALANCE_ENDPOINT = `${process.env.BACKEND_URL}/balance`

export const balanceApi = createApi({
    tagTypes : ["refresh_balance"],
    reducerPath : "balanceApi",
    baseQuery : fetchBaseQuery({
        baseUrl : BALANCE_ENDPOINT,
        credentials : "include",
    }),
    endpoints : (builder) => ({
        addBalance : builder.mutation({
            query : ({formData}) => ({
                method : "POST",
                url : "/add",
                body : formData
            }),
            invalidatesTags : ["refresh_balance"],
        }),
        getTotalBalance : builder.query({
            query : () => ({
                method : "GET",
                url : "/",
            }),
            providesTags : ["refresh_balance"],
        }),

        getRecentBalance : builder.query({
            query : () => ({
                url : "/recent",
                method : "GET"
            }),
            providesTags : ["refresh_balance"],
        }),
        
        
    })
})

export const {
    useAddBalanceMutation,
    useGetTotalBalanceQuery,
    useGetRecentBalanceQuery,
} = balanceApi;