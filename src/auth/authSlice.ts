import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, RegisterPayload } from "./authTypes";
import { loginUser, registerUser } from "./authAPI";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload) => {
    const res = await loginUser(data);
    return res;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload) => {
    const res = await registerUser(data);
    return res;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
  
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
  
        state.user = action.payload.user;
        state.token = action.payload.token;
  
        localStorage.setItem("token", action.payload.token);
      })
  
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      })
  
      // ✅ ADD THIS
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
  
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
  
        state.user = action.payload.user;
        state.token = action.payload.token;
  
        localStorage.setItem("token", action.payload.token);
      })
  
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.error = "Register failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
