import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    isLoggedIn: boolean;
    userName: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    userName: "",
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      login: (state) => {
        state.isLoggedIn = true
      },
      logout: (state) => {
        state.isLoggedIn = false
      },
      setUserName: (state, action: PayloadAction<string>) => {
        state.userName += action.payload
      },
    },
  })

export const {login, logout, setUserName} = userSlice.actions;

export default userSlice.reducer;  