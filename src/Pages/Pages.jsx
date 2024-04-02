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
