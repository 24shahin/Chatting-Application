import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "chatperson",
  initialState: {
    value: localStorage.getItem("chatperson")
      ? JSON.parse(localStorage.getItem("chatperson"))
      : null,
  },
  reducers: {
    chatwithperson: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { chatwithperson } = userSlice.actions;

export default userSlice.reducer;
