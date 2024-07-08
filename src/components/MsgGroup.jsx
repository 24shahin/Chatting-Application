import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { chatwithperson } from "../Slices/chatwithperson";

function MsgGroup() {
  const db = getDatabase();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let userinfo = useSelector((state) => state?.user?.value);
  const [mygrplist, setMyGrpList] = useState([]);
  useEffect(() => {
    const mygrpRef = ref(db, "grouplist/");
    onValue(mygrpRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userinfo.uid == item.val().adminid) {
          arr.push({ ...item.val(), groupid: item.key });
        }
      });
      setMyGrpList(arr);
    });
  }, []);

  const [invitedJoined, setInvitedJoined] = useState([]);
  useEffect(() => {
    const joinedRef = ref(db, "memberlist/");
    onValue(joinedRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          userinfo.uid == item.val().whosendrequestid ||
          userinfo.uid == item.val().whominviteid
        ) {
          arr.push(item.val());
        }
      });
      setInvitedJoined(arr);
    });
  }, []);
  let maparray = [...mygrplist, ...invitedJoined];
  const handlegroupchat = (item) => {
    navigate("/pages/massage");
    dispatch(
      chatwithperson({
        groupid: item.groupid,
        groupname: item.groupname ,
        adminname: item.adminname,
        adminid: item.adminid,
        chatuser: userinfo.displayName,
        chatuserid: userinfo.uid,
        chatuserphoto: userinfo.photoURL,
        type: "groupmsg",
      })
    );
  };
  return (
    <div className="boxcontainer relative">
      <div className="tittlebar">
        <h2>Groups You Can Chat</h2>
      </div>

      {maparray.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg" style={{width:'40%'}}>
            <img
              src={userinfo.grpphotoURL}
              alt=""
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          </div>
          <div
            onClick={() => handlegroupchat(item)}
            style={{ cursor: "pointer", width:'60%' }}
          >
            <div className="username">
              <h2>{item.grpname || item.groupname}</h2>
            </div>
            <div className="username">
              <h3>{item.grptag}</h3>
            </div>
            <div className="username">
              <h3>Admin Name: {item.adminname}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MsgGroup;
