import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Typedjs from "../components/Typedjs";
import imgSRC from "../assets/chatting.gif";
import imgSRC2 from "../assets/chatting2.gif";

function Pages() {
  let data = useSelector((state) => state?.user?.value);
  let navigate = useNavigate();

  useEffect(() => {
    if (!data?.email) {
      navigate("/");
    }
  }, []);
  return (
    <Grid container spacing={2} style={{ background: "rgb(229 222 140)" }}>
      <Grid item xs={2}>
        <Navbar />
      </Grid>
      <Grid item xs={7} style={{ marginTop: "9px" }}>
        <Outlet />
      </Grid>
      <Grid item xs={3} style={{ marginTop: "9px" }} className="imgdiv">
        <Typedjs />
        <img src={imgSRC2} alt="" className="imgup" />
        <img src={imgSRC} alt="" className="imgdown" />
      </Grid>
    </Grid>
  );
}

export default Pages;
