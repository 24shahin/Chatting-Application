import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlice";

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
  let dispatch = useDispatch();
  let data = useSelector((state) => state?.user?.value);
  useEffect(() => {
    if (data?.email) {
      Navigate("/pages/home");
    }
  }, []);
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
            localStorage.setItem("user", JSON.stringify(userCredential.user));
            dispatch(activeUser(userCredential.user));
            Navigate("/pages");
          }
          // ====== if you want email verification does not need
          // toast.success("Login Success", {
          //   position: "top-center",
          //   autoClose: 3000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "dark",
          // });
          // SetRegData({ ...regData, password: "" });
          // localStorage.setItem("user", JSON.stringify(userCredential.user));
          // dispatch(activeUser(userCredential.user));
          // Navigate("/pages/home");
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
      <Grid item container>
        <Grid item xs={12} style={{ textAlign: "center", padding: "30px" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              color: "#11175D",
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
          <div style={{ width: "70%", margin: "0 auto" }}>
            <TextField
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
              width: "70%",
              borderRadius: "86px",
              margin: "34px auto 0",
              padding: "15px 0",
            }}
            onClick={handleClick}
            disabled={loading ? true : false}
          >
            Login to Continue
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
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
