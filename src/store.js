import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import chatwithperson from "./Slices/chatwithperson";

export default configureStore({
  reducer: {
    user: userSlice,
    chatwithperson: chatwithperson,
  },
});
