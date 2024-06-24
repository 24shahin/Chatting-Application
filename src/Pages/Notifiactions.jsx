import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

function Notification() {
  let userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  const [inviteShow, setInviteShow] = useState([]);
  useEffect(() => {
    const notificationsRef = ref(db, "grpinvite/");
    onValue(notificationsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userinfo.uid == item.val().whominviteid) {
          arr.push({ ...item.val(), iviteid: item.key });
        }
      });
      setInviteShow(arr);
    });
  }, []);
  const handleacceptinvite = (item) => {
    console.log(item.val());
    // set(push(ref(db, "memberlist/")), {
    //   ...item.val(),
    // }).then(() => {
    //   remove(ref(db, "grpinvite/" + item.iviteid));
    // });
  };
  const handleRejectinvite = (item) => {
    remove(ref(db, "grpinvite/" + item.iviteid));
  };
  return (
    <div className="ContainerBox" style={{ height: "95.5%", width: "97.6%" }}>
      <div className="tittlebar">
        <h2>Notification</h2>
      </div>
      {inviteShow.map((item, index) => (
        <div key={index}>
          <p style={{ color: "#fff", fontSize: "22px", margin: "15px 0" }}>
            You have a Notifications from{" "}
            <span style={{ color: "#f27474", fontWeight: "bolder" }}>
              {item.groupname}
            </span>{" "}
            Group to Join
          </p>
          <Button
            variant="contained"
            onClick={() => handleacceptinvite(item)}
            style={{ marginBottom: "15px" }}
          >
            accept
          </Button>
          <Button
            variant="contained"
            onClick={() => handleRejectinvite(item)}
            style={{ marginBottom: "15px", marginLeft: "15px" }}
          >
            reject
          </Button>
          <Divider variant="inset" component="li" className="notiborder" />
        </div>
      ))}
    </div>
  );
}

export default Notification;
