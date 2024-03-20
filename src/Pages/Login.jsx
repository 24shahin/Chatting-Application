import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gimages from "../assets/Glogin.png";
import images from "../assets/login.png";

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
  const provider = new GoogleAuthProvider();
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
          if (!userCredential.user.emailVerified) {
            toast.error("Please Varify Your Email First", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
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
            Navigate("/pages");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          SetLoading(false);

          if (errorMessage.includes("auth/invalid-credential")) {
            SetRegerror({ ...regerror, email: "Email or Password is Wrong" });
          }
        });
    }
  };
  const auth = getAuth();

  const handleGlogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
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
        Navigate("/pages");
      })
      .catch((error) => {});
  };
  return (
    <div>
      <Grid container>
        <Grid xs={6} style={{ padding: "225px 59px 117px 120px" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              color: "#03014C",
            }}
            className="openSans"
          >
            Login to your account!
          </h2>
          <img
            src={Gimages}
            alt=""
            style={{ marginTop: "29px", cursor: "pointer" }}
            onClick={handleGlogin}
          />
          <div style={{ width: "90%" }}>
            <TextField
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              style={{ width: "100%", marginTop: "30px" }}
              onChange={handleChange}
              name="email"
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
              <FaRegEye
                className="eye"
                onClick={() => SetOpenEye(!openEye)}
                style={{ color: "#03014C" }}
              />
            )}
            {openEye && (
              <FaRegEyeSlash
                className="eye"
                onClick={() => SetOpenEye(!openEye)}
                style={{ color: "#03014C" }}
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
              width: "90%",
              borderRadius: "86px",
              marginBottom: "34px",
              marginTop: "34px",
              display: "flex",
              gap: "0 10px",
              padding: "27px 0",
            }}
            onClick={handleClick}
            disabled={loading ? true : false}
          >
            Login to Continue
            {!loading && (
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
          <span
            className="openSans"
            style={{
              display: "block",
              marginBottom: "20px",
              color: "#03014C",
              marginTop: "20px",
            }}
          >
            Forgot Password ?{" "}
            <Link
              to="/forgotpassword"
              style={{ color: "#EA6C00", marginLeft: "5px" }}
            >
              Click Here
            </Link>
          </span>

          <span style={{ color: "#03014C" }} className="openSans">
            Don’t have an account ?
            <Link to="/" style={{ color: "#EA6C00", marginLeft: "5px" }}>
              Sign Up
            </Link>
          </span>
        </Grid>
        <Grid xs={6}>
          <img
            src={images}
            alt=""
            style={{ height: "100%", objectFit: "cover", width: "100%" }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
