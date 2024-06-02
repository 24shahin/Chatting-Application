import React from "react";
import "../css/profile.css";
import Cover from "../assets/cover.jpg";
import { useSelector } from "react-redux";

function Profile() {
  const userinfo = useSelector((state) => state?.user?.value);
  return (
    <div>
      <div className="ProfileContainer">
        <div className="cover">
          <img src={Cover} alt="" className="coverpic" />
        </div>
        <div className="userdetails">
          <img src={userinfo.photoURL} alt="" className="userpic" />
          <div className="userdetailsinn">
            <h1>{userinfo.displayName}</h1>
            <h3></h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
