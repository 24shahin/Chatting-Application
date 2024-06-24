import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import chatwithperson from "./Slices/chatwithperson";
import groupchat from "./Slices/groupchat";

export default configureStore({
  reducer: {
    user: userSlice,
    chatwithperson: chatwithperson,
    groupchat: groupchat,
  },
});
