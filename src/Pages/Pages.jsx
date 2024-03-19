import React from "react";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Pages() {
  return (
    <Grid container>
      <Grid xs={1} style={{ background: "red" }}>
        <Navbar />
      </Grid>
      <Grid xs={11} style={{ background: "green" }}>
        <Outlet />
      </Grid>
    </Grid>
  );
}

export default Pages;
