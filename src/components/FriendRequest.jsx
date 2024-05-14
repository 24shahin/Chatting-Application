import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";

function FriendRequest() {
  const userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  // showing friend Request List
  const [friendrqstList, setFriendrqstList] = useState([]);
  useEffect(() => {
    const frndrqstRef = ref(db, "friendrequest/");
    onValue(frndrqstRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userinfo.uid == item.val().rqstreceiverid) {
          arr.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setFriendrqstList(arr);
    });
  }, []);
  // Accept friend Request
  const handleRqstAccept = (item) => {
    set(push(ref(db, "friends/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendrequest/" + item.id));
    });
  };
  // Delet friend Request
  const handleRqstDelet = (item) => {
    remove(ref(db, "friendrequest/" + item.id));
  };
  return (
    <div className="boxcontainer">
      <div className="tittlebar">
        <h2>Friend Request</h2>
      </div>
      {friendrqstList.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg">
            <img
              src={item.rqstsenderphoto}
              alt=""
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="username">
            <h3>{item.rqstsendername}</h3>
          </div>
          <div>
            {" "}
            <Button variant="contained" onClick={() => handleRqstAccept(item)}>
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: "15px" }}
              onClick={() => handleRqstDelet(item)}
            >
              Cancle
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendRequest;
