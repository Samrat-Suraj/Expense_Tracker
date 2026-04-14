import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slice/userSlice";

export const USER_ENDPOINT = `https://expense-tracker-2dax.onrender.com/user`
export const userApi = createApi({
    tagTypes: ["User_Refech"], // Define tag type (like creating a label for cache)
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_ENDPOINT,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        loaderUser: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            }),
            providesTags: ["User_Refech"],  // Is data ko User_Refresh tag ke naam se cache me store karo
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(setUser({ user: result.data.user }))
                } catch (error: any) {
                    console.log(error.message)
                }
            },
            
        }),

        registerUser: builder.mutation({
            query: ({ formData }) => ({
                url: "/register",
                method: "POST",
                body: formData
            })
        }),

        verifyUser: builder.mutation({
            query: (token) => ({
                url: `/verify/${token}`,
                method: "POST"
            })
        }),

        loginUser: builder.mutation({
            query: ({ formData }) => ({
                url: "/login",
                method: "POST",
                body: formData
            }),
            invalidatesTags : ["User_Refech"]  // "Ye User_Refresh wala data ab old ho gaya"
                                              //  "Isko dobara fresh API call karke lao"
        }),

        forgetUser: builder.mutation({
            query: (email) => ({
                url: `forget`,
                method: "POST",
                body: { email }
            })
        }),

        resetPassword: builder.mutation({
            query: ({ newPassword, token }) => ({
                url: `/resetPass/${token}`,
                method: "POST",
                body: { password: newPassword }
            })
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: `/logout`,
                method: "POST",
            }),
            
        }),

    })
});

export const {
    useRegisterUserMutation,
    useVerifyUserMutation,
    useForgetUserMutation,
    useLoginUserMutation,
    useResetPasswordMutation,
    useLogoutUserMutation,
    useLoaderUserQuery,
} = userApi;