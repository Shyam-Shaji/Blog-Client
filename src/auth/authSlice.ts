import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, RegisterPayload } from "./authTypes";
import { loginUser, registerUser, getUserByIdAPI } from "./authAPI";

const initialState: AuthState = {
  user: null,
  selectedUser: null,
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

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await getUserByIdAPI(userId);
      console.log("getUserById API Response:", res);
      return res.user || res;
    } catch (err: any) {
      console.error("getUserById API Error:", err);
      return rejectWithValue(err.response?.data?.message || "Error fetching user");
    }
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
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
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
      })
      
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase("user/updateUser/fulfilled" as any, (state, action: any) => {
        // Always update the current user state when the updateUser thunk succeeds
        state.user = action.payload;
      });
  },
});

export const { logout, clearSelectedUser } = authSlice.actions;

export default authSlice.reducer;
