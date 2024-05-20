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

  return (
    <div className="boxcontainer relative">
      <div className="tittlebar">
        <h2>My Groups List</h2>
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
              <h4>{item.grpname}</h4>
            </div>
            <div className="username">
              <h5>{item.grptag}</h5>
            </div>
            <div className="username">
              <h5>Admin Name:{item.adminname}</h5>
            </div>
          </div>
          <div className="grpbtns">
            {penddinglist.includes(item.grplistid + userinfo.uid) ||
            penddinglist.includes(userinfo.uid + item.grplistid) ? (
              <>
                <p>Join Request Sent</p>
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
