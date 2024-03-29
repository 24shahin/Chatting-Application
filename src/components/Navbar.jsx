import React, { useState } from "react";
import Images from "./Images";
import profile from "../assets/profile.png";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const auth = getAuth();
  let Navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Log Out Success", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        Navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="navbox">
      <Images src={profile} style={"userImg"} />
      <FaHome className="Navicon" />
      <FaMessage className="Navicon" />
      <IoIosNotifications className="Navicon" />
      <IoSettings className="Navicon" />
      <FaSignOutAlt className="Navicon" onClick={handleOpen} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Log Out !
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure to LOG OUT?
          </Typography>
          <div className="logbuttons">
            <Button variant="contained" onClick={handleLogout}>
              Log Out
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(false)}
            >
              Cancle
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Navbar;
