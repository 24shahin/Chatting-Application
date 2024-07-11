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
import { useDispatch, useSelector } from "react-redux";
import { chatwithperson } from "../Slices/chatwithperson";
import { useNavigate } from "react-router-dom";

function Friends() {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  const Navigate = useNavigate();
  // showing who are user's friends
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().rqstsenderid == userinfo.uid ||
          item.val().rqstreceiverid == userinfo.uid
        ) {
          arr.push({ ...item.val(), friendsid: item.key });
        }
      });
      setFriendList(arr);
    });
  }, []);
  // block from friend List
  const handleBlock = (item) => {
    if (userinfo.uid == item.rqstsenderid) {
      set(push(ref(db, "blocklist/")), {
        blockeduserid: item.rqstreceiverid,
        blockedusername: item.rqstreceivername,
        blockeduserphoto: item.rqstreceiverphotourl,
        blockedbyuserphoto: userinfo.photoURL,
        blockedbyid: userinfo.uid,
        blockedbyname: userinfo.displayName,
      }).then(() => {
        remove(ref(db, "friends/" + item.friendsid));
      });
    } else if (userinfo.uid == item.rqstreceiverid) {
      set(push(ref(db, "blocklist/")), {
        blockeduserid: item.rqstsenderid,
        blockedusername: item.rqstsendername,
        blockeduserphoto: item.rqstsenderphoto,
        blockedbyuserphoto: userinfo.photoURL,
        blockedbyid: userinfo.uid,
        blockedbyname: userinfo.displayName,
      }).then(() => {
        remove(ref(db, "friends/" + item.friendsid));
      });
    }
  };
  // chat site
  const handlechat = (item) => {
    if (userinfo.uid == item.rqstreceiverid) {
      Navigate("/pages/massage");
      dispatch(
        chatwithperson({
          chatwithpersonid: item.rqstsenderid,
          chatwithpersonname: item.rqstsendername,
          chatwithpersonphoto: item.rqstsenderphoto,
          type: "friendmsg",
        })
      );
    } else {
      Navigate("/pages/massage");
      dispatch(
        chatwithperson({
          chatwithpersonid: item.rqstreceiverid,
          chatwithpersonname: item.rqstreceivername,
          chatwithpersonphoto: item.rqstreceiverphotourl,
          type: "friendmsg",
        })
      );
    }
  };
  return (
    <div className="boxcontainer">
      <div className="tittlebar">
        <h2>Friends List</h2>
      </div>
      {friendList.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg">
            <img
              src={
                userinfo.uid == item.rqstreceiverid
                  ? item.rqstsenderphoto
                  : item.rqstreceiverphotourl
              }
              alt=""
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="username" style={{ cursor: "pointer" }}>
            {userinfo.uid == item.rqstreceiverid ? (
              <h3 onClick={() => handlechat(item)}>{item.rqstsendername}</h3>
            ) : (
              <h3 onClick={() => handlechat(item)}>{item.rqstreceivername}</h3>
            )}
          </div>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleBlock(item)}
          >
            Block
          </Button>
        </div>
      ))}
    </div>
  );
}

export default Friends;
