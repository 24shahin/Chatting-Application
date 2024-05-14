import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

function Pages() {
  let data = useSelector((state) => state?.user?.value);
  let navigate = useNavigate();

  useEffect(() => {
    if (!data?.email) {
      navigate("/");
    }
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={1}>
        <Navbar />
      </Grid>
      <Grid item xs={11}>
        <Outlet />
      </Grid>
    </Grid>
  );
}

export default Pages;
