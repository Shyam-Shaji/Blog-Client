import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserAPI } from "./userAPI";

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
};

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      console.log("updateUser thunk - Data:", data);
      const res = await updateUserAPI(data);
      return res.user || res;
    } catch (err: any) {
       console.error("updateUser thunk - Error:", err);
       const errorMessage = err.response?.data?.message || err.message || "Failed to update user";
       return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
