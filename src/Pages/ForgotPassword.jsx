import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [loading, SetLoading] = useState(false);
  const auth = getAuth();
  const [value, setValue] = useState("");
  const Navigate = useNavigate();
  const handleClick = () => {
    SetLoading(true);
    sendPasswordResetEmail(auth, value)
      .then(() => {
        SetLoading(false);
        toast.success("Check Your Email for Reset Password", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setValue("");
        Navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <div className="forgotBox">
      <div className="forgotboxinn">
        <h2 style={{ paddingBottom: "10px" }}>Forgot Password</h2>
        <TextField
          id="outlined-basic"
          label="E-mail"
          variant="outlined"
          style={{ width: "100%", marginBottom: "20px" }}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button
          variant="contained"
          style={{
            width: "60%",
            borderRadius: "86px",
            marginBottom: "34px",
            marginTop: "34px",
            display: "flex",
            gap: "0 10px",
            padding: "26px 0",
          }}
          onClick={handleClick}
          disabled={loading ? true : false}
        >
          Submit
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
      </div>
    </div>
  );
}

export default ForgotPassword;
