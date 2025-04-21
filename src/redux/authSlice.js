// src/store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
};

const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogin: (state,action) => {
      state.isLogin = action.payload;
    }
  },
});

export const {setIsLogin } = counterSlice.actions;

export default counterSlice.reducer;
