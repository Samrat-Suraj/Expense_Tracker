import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export let EXPANCE_ENDPOINT = `http://localhost:5000/expances`

export const expanceApi = createApi({
    tagTypes : ["refresh_expance"],
    reducerPath : "expanceApi",
    baseQuery : fetchBaseQuery({
        credentials : "include",
        baseUrl : EXPANCE_ENDPOINT,
    }),
    endpoints : (builder) => ({
        createExpance : builder.mutation({
            query : (form) => ({
                url : "/create",
                method : "POST",
                body : form
            }),
            invalidatesTags : ["refresh_expance"],
        }),
        getAllExpances : builder.query({
            query : () => ({
                url : "/",
                method : "/GET",
            }),
        }),
        getExpanceById : builder.query({
            query : (id) => ({
                url : `/${id}`,
                method : "GET",
            }),
        }),
        updateExpance : builder.mutation({
            query : ({fromData , id}) => ({
                url : `/${id}`,
                method : "PUT",
                body : {fromData}
            }),
        }),
        deleteExpance : builder.mutation({
            query : (id) => ({
                url : `/${id}`,
                method : "DELETE",
            }),
        }),
        getTotalExpance : builder.query({
            query : () => ({
                url : '/totalexpance',
                method : "GET"
            }),
            providesTags : ["refresh_expance"]
        }),
        getMonthlyExpance : builder.query({
            query : () => ({
                url : "/monthly-expance",
                method : "GET"
            }),
            providesTags : ["refresh_expance"]
        }),
        
        getThisMonthExpance : builder.query({
            query : () => ({
                url : "/this-month-expance",
                method : "GET"
            }),
            providesTags : ["refresh_expance"]
        }),
        
        getThisYearExpance : builder.query({
            query : () => ({
                url : "/this-year-expance",
                method : "GET"
            }),
            providesTags : ["refresh_expance"]
        }),

        getTodayExpance : builder.query({
            query : () => ({
                url : "/today-expance",
                method : "GET"
            }),
            providesTags : ["refresh_expance"]
        }),
        
    })
})

export const {
    useCreateExpanceMutation,
    useDeleteExpanceMutation,
    useGetAllExpancesQuery,
    useGetExpanceByIdQuery,
    useUpdateExpanceMutation,
    useGetMonthlyExpanceQuery,
    useGetThisMonthExpanceQuery,
    useGetThisYearExpanceQuery,
    useGetTotalExpanceQuery,
    useGetTodayExpanceQuery,
} = expanceApi