import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Friends from "../components/Friends";
import MsgGroup from "../components/MsgGroup";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
} from "firebase/database";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Massage() {
  const [sendmsg, setSendmsg] = useState("");
  const [sendgrpmsg, setSendgrpmsg] = useState("");
  const [sentmsg, setSentmsg] = useState("");
  const [showmsg, setShowmsg] = useState([]);
  const [showgrpmsg, setShowgrpmsg] = useState([]);

  const userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  const chatfriend = useSelector((state) => state?.chatwithperson?.value);
  const groupchat = useSelector((state) => state?.groupchat?.value);

  // send msg
  const handlesendmsg = () => {
    set(push(ref(db, "massage/")), {
      sendperson: userinfo.displayName,
      sendpersonid: userinfo.uid,
      getpersonname: chatfriend.chatwithpersonname,
      getpersonid: chatfriend.chatwithpersonid,
      msg: sendmsg,
      date: `${new Date().getFullYear()}/${
        new Date().getMonth() + 1
      }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    }).then(() => {
      setSendmsg("");
    });
  };
  // send grp msg
  const handlesendgrpmsg = () => {
    set(push(ref(db, "groupmassage/")), {
      sendperson: userinfo.displayName,
      sendpersonid: userinfo.uid,
      getpersonname: groupchat.groupname,
      getpersonid: groupchat.groupid,
      msg: sendgrpmsg,
      date: `${new Date().getFullYear()}/${
        new Date().getMonth() + 1
      }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    }).then(() => {
      setSendgrpmsg("");
    });
  };
  // showing person msg
  useEffect(() => {
    const msgRef = ref(db, "massage/");
    onValue(msgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().sendpersonid === userinfo.uid &&
            item.val().getpersonid === chatfriend.chatwithpersonid) ||
          (item.val().getpersonid === userinfo.uid &&
            item.val().sendpersonid === chatfriend.chatwithpersonid)
        ) {
          arr.push({ ...item.val(), msgid: item.key });
        }
      });
      setShowmsg(arr);
    });
  }, [chatfriend.chatwithpersonid, userinfo.uid, db]);
  // showing group msg
  useEffect(() => {
    const msgRef = ref(db, "groupmassage/");
    onValue(msgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().sendpersonid === userinfo.uid &&
            item.val().getpersonid === groupchat.groupid) ||
          (item.val().getpersonid === userinfo.uid &&
            item.val().sendpersonid === groupchat.groupid)
        ) {
          arr.push({ ...item.val(), msgid: item.key });
        }
      });
      setShowgrpmsg(arr);
    });
  }, [groupchat.groupid, userinfo.uid, db]);

  const [selectedmsgId, setSelectedmsgId] = useState(null);
  const handlemsgbtn = (msgid) => {
    setSelectedmsgId(msgid === selectedmsgId ? null : msgid);
  };
  // msg forward
  const [friendList, setFriendList] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setSentmsg(item.msg);
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((fitem) => {
        if (
          fitem.val().rqstsenderid == userinfo.uid ||
          fitem.val().rqstreceiverid == userinfo.uid
        ) {
          arr.push({ ...fitem.val(), friendsid: fitem.key });
        }
      });
      setFriendList(arr);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleForward = (item) => {
    if (item.rqstreceiverid === userinfo.uid) {
      set(push(ref(db, "massage/")), {
        sendperson: userinfo.displayName,
        sendpersonid: userinfo.uid,
        getpersonname: item.rqstsendername,
        getpersonid: item.rqstsenderid,
        msg: sentmsg,
        date: `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      })
        .then(() => {
          setSendmsg("");
        })
        .then(() => {
          setOpen(false);
        });
    } else {
      set(push(ref(db, "massage/")), {
        sendperson: userinfo.displayName,
        sendpersonid: userinfo.uid,
        getpersonname: item.rqstreceivername,
        getpersonid: item.rqstreceiverid,
        msg: sendmsg,
        date: `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      })
        .then(() => {
          setSendmsg("");
        })
        .then(() => {
          setOpen(false);
        });
    }
  };

  // msg deleting
  const handlemsgDelete = (item) => {
    if (userinfo.uid === item.sendpersonid) {
      remove(ref(db, "massage/" + item.msgid));
    }
  };
  // Edit msg
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataId, setDataId] = useState(null);
  const handleEdit = (item) => {
    setSendmsg(item.msg);
    setIsUpdate(true);
    setDataId(item.msgid);
  };

  const handleUpdatemsg = () => {
    const msgRef = ref(db, `massage/${dataId}`);
    onValue(
      msgRef,
      (snapshot) => {
        const currentData = snapshot.val();
        // Update only the msg field while keeping the other fields unchanged
        set(ref(db, `massage/${dataId}`), {
          ...currentData,
          msg: sendmsg,
        });
        setSendmsg("");
        setIsUpdate(false);
      },
      {
        onlyOnce: true,
      }
    );
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "100vh",
              rowGap: "20px",
              margin: "0",
            }}
          >
            <Friends />
            <MsgGroup />
          </Grid>
          <Grid item xs={6} style={{ height: "100vh" }}>
            <div className="boxcontainermsg ">
              <div className="msgheader">
                <h2>
                  {chatfriend?.chatwithpersonname || groupchat?.groupname}
                </h2>
              </div>
              <div className="textmsg">
                {showmsg.map((item, index) =>
                  item.sendpersonid === userinfo.uid &&
                  item.getpersonid === chatfriend.chatwithpersonid ? (
                    <div className="rightmsg" key={index}>
                      <div className="btnbox">
                        <Button
                          className="msgbtn"
                          onClick={() => handlemsgbtn(item.msgid)}
                        >
                          <BsThreeDotsVertical />
                        </Button>
                        {selectedmsgId === item.msgid && (
                          <div className="msgbtnInn">
                            <Button onClick={() => handleOpen(item)}>
                              Forward
                            </Button>
                            <Button onClick={() => handleEdit(item)}>
                              Edit
                            </Button>
                            <Button onClick={() => handlemsgDelete(item)}>
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="mssginn">
                        <p>{item.msg}</p>
                        <span style={{ fontSize: "14px" }}>
                          {moment(item.date, "YYYYMMDD h:mm:ss a").fromNow()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    item.getpersonid === userinfo.uid &&
                    item.sendpersonid === chatfriend.chatwithpersonid && (
                      <div className="leftmsg" key={index}>
                        <div className="mssginn">
                          <p>{item.msg}</p>
                          <span style={{ fontSize: "14px" }}>
                            {moment("2024/07/03", "YYYYMMDD").fromNow()}
                          </span>
                        </div>
                        <div className="btnbox">
                          <Button
                            className="msgbtn"
                            onClick={() => handlemsgbtn(item.msgid)}
                          >
                            <BsThreeDotsVertical />
                          </Button>
                          {selectedmsgId === item.msgid && (
                            <div className="msgbtnInn">
                              <Button onClick={() => handleOpen(item)}>
                                Forward
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
              <div className="writeInput">
                <div className="inn">
                  <input
                    type="text"
                    value={sendmsg}
                    onChange={(e) => setSendmsg(e.target.value)}
                  />
                  {!isUpdate && (
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handlesendmsg}
                    >
                      Send
                    </Button>
                  )}
                  {isUpdate && (
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleUpdatemsg}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
              {/* forward modal */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
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
                          <h3>{item.rqstsendername}</h3>
                        ) : (
                          <h3>{item.rqstreceivername}</h3>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        onClick={() => handleForward(item)}
                      >
                        Send
                      </Button>
                    </div>
                  ))}
                </Box>
              </Modal>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Massage;
