import React, { useState } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlice";
import ImagesCropper from "./ImagesCropper";

function Navbar() {
  // log out modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // UserImg Modal
  const [userImg, setUserImg] = useState(false);
  const handleOpenUserImg = () => setUserImg(true);
  const handleCloseUserImg = () => setUserImg(false);

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
  let dispatch = useDispatch();
  let userinfo = useSelector((state) => state?.user?.value);

  const auth = getAuth();
  let Navigate = useNavigate();
  let location = useLocation();

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
        localStorage.removeItem("user");
        dispatch(activeUser(null));
        Navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="navbox">
      <div className="userProfile">
        <img
          src={userinfo.photoURL}
          className={"userImg"}
          alt=""
          onClick={handleOpenUserImg}
        />
        <h2 style={{ fontSize: "20px" }}>{userinfo.displayName}</h2>
        <Modal
          open={userImg}
          onClose={handleCloseUserImg}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ImagesCropper />
          </Box>
        </Modal>
      </div>
      <div className="navitem">
        <Link
          to={"/pages/home"}
          className={`${
            location.pathname == "/pages" || location.pathname == "/pages/home"
              ? "active"
              : null
          } Navicon`}
        >
          <FaHome className="Navicon" />
        </Link>
        <Link
          to={"/pages/massage"}
          className={`${
            location.pathname == "/pages/massage" ? "active" : null
          } Navicon`}
        >
          {" "}
          <FaMessage className="Navicon" />
        </Link>
        <Link
          to={"/pages/notifications"}
          className={`${
            location.pathname == "/pages/notifications" ? "active" : null
          } Navicon`}
        >
          <IoIosNotifications className="Navicon" />
        </Link>
        <Link
          to={"/pages/settings"}
          className={`${
            location.pathname == "/pages/settings" ? "active" : null
          } Navicon`}
        >
          <IoSettings className="Navicon" />
        </Link>
      </div>
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
