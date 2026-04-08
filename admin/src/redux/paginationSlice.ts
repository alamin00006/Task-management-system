import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
  page: number;
  size: number;
}

const initialState: PaginationState = {
  page: 1,
  size: 10,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
    },
  },
});

export const { setPage, setPageSize } = paginationSlice.actions;

export default paginationSlice.reducer;
