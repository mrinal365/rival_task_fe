import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  isLoading: boolean;
}

const initialState: TaskState = {
  isLoading: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = taskSlice.actions;
export default taskSlice.reducer;
