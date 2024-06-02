import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

function GroupsList() {
  const db = getDatabase();
  let userinfo = useSelector((state) => state?.user?.value);
  const [mygrplist, setMyGrpList] = useState([]);
  useEffect(() => {
    const mygrpRef = ref(db, "grouplist/");
    onValue(mygrpRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userinfo.uid != item.val().adminid) {
          arr.push({ ...item.val(), mygrpid: item.key });
        }
      });
      setMyGrpList(arr);
    });
  }, []);
  const handleJoingrp = (item) => {
    set(push(ref(db, "grouprequest/")), {
      grpname: item.grpname,
      grptag: item.grptag,
      adminname: item.adminname,
      adminid: item.adminid,
      whosendrequestid: userinfo.uid,
      whosendrequestname: userinfo.displayName,
      whosendrequestphoto: userinfo.photoURL,
      grplistid: item.mygrpid,
    });
  };
  // showing join request is pendding
  const [penddinglist, setpendding] = useState([]);
  useEffect(() => {
    const grprqstRef = ref(db, "grouprequest/");
    onValue(grprqstRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().grplistid + item.val().whosendrequestid);
      });
      setpendding(arr);
    });
  }, []);
  // showing join request is accept
  const [joinedList, setJoinedList] = useState([]);
  useEffect(() => {
    const joinedRef = ref(db, "memberlist/");
    onValue(joinedRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().grplistid + item.val().whosendrequestid);
      });
      setJoinedList(arr);
    });
  }, []);

  return (
    <div className="boxcontainer relative">
      <div className="tittlebar">
        <h2>Groups List</h2>
      </div>

      {mygrplist.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg">
            <img
              src={userinfo.grpphotoURL}
              alt=""
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          </div>
          <div>
            <div className="username">
              <h2>{item.grpname}</h2>
            </div>
            <div className="username">
              <h3>{item.grptag}</h3>
            </div>
            <div className="username">
              <h3>Admin Name: {item.adminname}</h3>
            </div>
          </div>
          <div className="grpbtns">
            {penddinglist.includes(item.mygrpid + userinfo.uid) ? (
              <>
                <p style={{ fontWeight: "bold" }}>Join Request Sent</p>
              </>
            ) : joinedList.includes(item.mygrpid + userinfo.uid) ? (
              <>
                <p style={{ fontWeight: "bold" }}>You are Joined</p>
              </>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleJoingrp(item)}
              >
                join
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
