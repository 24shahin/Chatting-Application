import React from "react";
import Images from "./Images";
import profile from "../assets/profile.png";
import { FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

function Navbar() {
  return (
    <div className="navbox">
      <Images src={profile} style={"userImg"} />
      <FaHome className="icon"/>
    </div>
  );
}

export default Navbar;
