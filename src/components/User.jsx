import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { getDatabase, ref, onValue, push, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";

function User() {
  const userinfo = useSelector((state) => state?.user?.value);
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const [userList, setUserList] = useState([]);
  // showing user
  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, async (snapshot) => {
      let arr = [];
      const promises = [];

      snapshot.forEach((item) => {
        if (userinfo.uid !== item.key) {
          const userItem = {
            userid: item.key,
            username: item.val().username,
            email: item.val().email,
            userphoto: item.val().photoURL,
          };
          arr.push(userItem);

          // Fetch user's photoURL from storage if it exists
          const photoURLPromise = getDownloadURL(
            storageRef(storage, `profilePic/${item.key}`)
          )
            .then((downloadURL) => {
              userItem.userphoto = downloadURL;
            })
            .catch((error) => {
              console.error("Error fetching user photo:", error);
              // Use default photo if error occurs (e.g., file not found)
              userItem.userphoto = item.val().photoURL;
            });

          promises.push(photoURLPromise);
        }
      });

      // Wait for all promises to complete
      await Promise.all(promises);
      setUserList(arr);
    });
  }, [db, storage, userinfo.uid]);
  // showing user photo when they update
  useEffect(() => {
    if (userinfo.uid) {
      getDownloadURL(storageRef(storage, `profilePic/${userinfo.uid}`))
        .then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            // Optional: Update local state or redux store if needed
          });
        })
        .catch((error) => {
          console.error("Error fetching user photo:", error);
        });
    }
  }, [auth, storage, userinfo.uid]);
  // showing whom send friend Request
  const handleFriendRequest = (item) => {
    set(push(ref(db, "friendrequest/")), {
      rqstsenderid: userinfo.uid,
      rqstsendername: userinfo.displayName,
      rqstsenderphoto: userinfo.photoURL,
      rqstreceiverid: item.userid,
      rqstreceivername: item.username,
      rqstreceiverphotourl: item.userphoto,
    });
  };

  return (
    <div className="boxcontainer">
      <div className="tittlebar">
        <h2>User List</h2>
      </div>
      {userList.map((item, index) => (
        <div className="boxinner" key={index}>
          <div className="userimg">
            <img
              src={item.userphoto}
              alt={item.username}
              style={{ width: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="username">
            <h3>{item.username}</h3>
          </div>
          <Button variant="contained" onClick={() => handleFriendRequest(item)}>
            +
          </Button>
        </div>
      ))}
    </div>
  );
}

export default User;
