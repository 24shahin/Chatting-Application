import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "groupchat",
  initialState: {
    value: localStorage.getItem("groupchat")
      ? JSON.parse(localStorage.getItem("groupchat"))
      : null,
  },
  reducers: {
    groupchat: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { groupchat } = userSlice.actions;

export default userSlice.reducer;
