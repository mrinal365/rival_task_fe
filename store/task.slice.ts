import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      // Keep only 10 items to match pagination page size
      if (state.tasks.length > 10) {
        state.tasks = state.tasks.slice(0, 10);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setLoading, setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
