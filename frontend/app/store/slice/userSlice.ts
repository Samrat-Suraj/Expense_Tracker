import { createSlice, PayloadAction } from "@reduxjs/toolkit";


let userSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        errorMesaage: false,
    },
    reducers: {
        setUser: (state, action: PayloadAction<any | null>) => {
            state.user = action.payload.user
        },
        setErrorMessage: (state, action: PayloadAction<boolean>) => {
            state.errorMesaage = action.payload
        }
    }
})

export const { setUser, setErrorMessage } = userSlice.actions
export default userSlice.reducer