import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { getDatabase, ref, onValue, remove } from "firebase/database";

function BlockList() {
  const db = getDatabase();
  // showing block list
  const [blockList, setBlockList] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "blocklist/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), blockid: item.key });
      });
      setBlockList(arr);
    });
  }, []);
  // delet block user
  const handleUbblock = (item) => {
    remove(ref(db, "blocklist/" + item.blockid));
  };
  return (
    <div className="boxcontainer">
      <div className="tittlebar">
        <h2>Blocked List</h2>
      </div>
      {blockList.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg">
            <img
              src={item.blockeduserphoto}
              alt=""
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="username">
            <h3>{item.blockedusername}</h3>
          </div>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleUbblock(item)}
          >
            Unblock
          </Button>
        </div>
      ))}
    </div>
  );
}

export default BlockList;
