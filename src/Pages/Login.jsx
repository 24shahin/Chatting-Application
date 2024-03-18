import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [regData, SetRegData] = useState({
    email: "",
    password: "",
  });
  const [regerror, SetRegerror] = useState({
    email: "",
    password: "",
  });
  const [openEye, SetOpenEye] = useState(false);
  const [loading, SetLoading] = useState(false);
  const Navigate = useNavigate();
  const handleChange = (e) => {
    SetRegData({ ...regData, [e.target.name]: e.target.value });
    SetRegerror({ ...regerror, [e.target.name]: "" });
  };
  const handleClick = () => {
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regData.email) {
      SetRegerror({ ...regerror, email: "E-mail required" });
    } else if (!pattern.test(regData.email)) {
      SetRegerror({ ...regerror, email: "Vaild E-mail required" });
    } else if (!regData.password) {
      SetRegerror({ ...regerror, password: "password required" });
    } else if (regData.password.length < 6) {
      SetRegerror({ ...regerror, password: "password must 6 length" });
    } else {
      SetLoading(true);
      const auth = getAuth();
      signInWithEmailAndPassword(auth, regData.email, regData.password)
        .then((userCredential) => {
          SetLoading(false);
          toast.success("Login Success", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          SetRegData({ ...regData, password: "" });
          Navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          SetLoading(false);

          if (errorMessage.includes("auth/invalid-credential")) {
            SetRegerror({ ...regerror, email: "Email or Password is Wrong" });
          }
          console.log();
        });
    }
  };
  return (
    <div>
      <Grid container>
        <Grid xs={6} style={{ padding: "225px 59px 117px 120px" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              color: "#11175D",
              paddingBottom: "13px",
            }}
            className="Nunito"
          >
            Get started with easily register
          </h2>
          <p style={{ fontSize: "21px", color: "black", paddingBottom: "5px" }}>
            Free register and you can enjoy it
          </p>
          <div style={{ width: "90%" }}>
            <TextField
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              style={{ width: "100%", marginTop: "34px" }}
              onChange={handleChange}
              name="email"
              className="Nunito"
              value={regData.email}
            />
            {regerror.email && (
              <Alert
                severity="error"
                style={{ width: "93%" }}
                className="Nunito"
              >
                {regerror.email}
              </Alert>
            )}
          </div>

          <div className="password">
            <TextField
              id="outlined-basic"
              label="Password"
              type={openEye ? "text" : "password"}
              variant="outlined"
              style={{ width: "100%" }}
              onChange={handleChange}
              name="password"
              value={regData.password}
            />
            {!openEye && (
              <FaRegEye className="eye" onClick={() => SetOpenEye(!openEye)} />
            )}
            {openEye && (
              <FaRegEyeSlash
                className="eye"
                onClick={() => SetOpenEye(!openEye)}
              />
            )}
          </div>
          {regerror.password && (
            <Alert severity="error" style={{ width: "93%" }} className="Nunito">
              {regerror.password}
            </Alert>
          )}
          <Button
            variant="contained"
            style={{
              width: "368px",
              borderRadius: "86px",
              marginBottom: "34px",
              marginTop: "34px",
              display: "flex",
              gap: "0 10px",
            }}
            onClick={handleClick}
            className="Nunito"
            disabled={loading ? true : false}
          >
            Sign Up
            {loading && (
              <RotatingLines
                visible={true}
                height="30"
                width="30"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            )}
          </Button>

          <span style={{ color: "#03014C" }} className="Nunito">
            Already have an account ?{" "}
            <Link to="/registration" style={{ color: "#EA6C00" }}>
              Sign Up
            </Link>
          </span>
        </Grid>
        <Grid xs={6}>
          <img
            src="../src/assets/login.png"
            alt=""
            style={{ height: "100%", objectFit: "cover", width: "100%" }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
