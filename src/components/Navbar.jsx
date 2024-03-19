import React from "react";
import Images from "./Images";
import profile from "../assets/profile.png";

function Navbar() {
  return (
    <div className="navbox">
      <Images src={profile} style={"userImg"} />
    </div>
  );
}

export default Navbar;
