import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Userpic from "../assets/user.png";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

function Friends() {
  const userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  // showing who are user's friends
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().rqstsenderid == userinfo.ui ||
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
    set(push(ref(db, "blocklist/")), {
      blockeduserid: item.rqstsenderid,
      blockedusername: item.rqstsendername,
      blockeduserphoto: item.rqstsenderphoto,
      blockedbyid: item.rqstreceiverid,
      blockedbyname: item.rqstreceivername,
    }).then(() => {
      remove(ref(db, "friends/" + item.friendsid));
    });
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
              src={item.rqstsenderphoto}
              alt=""
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="username">
            {item.rqstsenderid ? (
              <h3>{item.rqstsendername}</h3>
            ) : (
              <h3>{item.rqstreceivername}</h3>
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
