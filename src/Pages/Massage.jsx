import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Friends from "../components/Friends";
import MsgGroup from "../components/MsgGroup";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import emojibutton from "../assets/emoji.gif";
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
import EmojiPicker from "emoji-picker-react";
import { IoIosAttach } from "react-icons/io";
import {
  getStorage,
  ref as imgref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import ReactPlayer from "react-player/lazy";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";

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
const styleimg = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "none !important",
};

function Massage() {
  const [sendmsg, setSendmsg] = useState("");
  const [sentmsg, setSentmsg] = useState("");
  const [sentimg, setSentimg] = useState("");
  const [sentvideo, setSentvideo] = useState("");
  const [sentAudio, setSentAudio] = useState("");
  const [showmsg, setShowmsg] = useState([]);
  const [showgrpmsg, setShowgrpmsg] = useState([]);
  const [emojiShow, setemojiShow] = useState(false);

  const userinfo = useSelector((state) => state?.user?.value);
  const db = getDatabase();
  const storage = getStorage();
  const chat = useSelector((state) => state?.chatwithperson?.value);

  // send msg
  const handlesendmsg = () => {
    if (chat == null) {
      return;
    }
    if (chat.type == "friendmsg") {
      console.log("friend");
      set(push(ref(db, "massage/")), {
        sendperson: userinfo.displayName,
        sendpersonid: userinfo.uid,
        sendpersonphoto: userinfo.photoURL,
        getpersonname: chat.chatwithpersonname,
        getpersonid: chat.chatwithpersonid,
        msg: sendmsg,
        date: `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      }).then(() => {
        setSendmsg("");
        setemojiShow(false);
      });
    } else if (chat.type == "groupmsg") {
      console.log("group");
      set(push(ref(db, "groupmassage/")), {
        sendperson: userinfo.displayName,
        sendpersonid: userinfo.uid,
        sendpersonphoto: userinfo.photoURL,
        getpersonname: chat.groupname,
        getpersonid: chat.groupid,
        msg: sendmsg,
        date: `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      }).then(() => {
        setSendmsg("");
        setemojiShow(false);
      });
    }
  };

  // showing person msg
  useEffect(() => {
    if (chat == null) {
      return;
    }
    const msgRef = ref(db, "massage/");
    onValue(msgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().sendpersonid === userinfo.uid &&
            item.val().getpersonid === chat.chatwithpersonid) ||
          (item.val().getpersonid === userinfo.uid &&
            item.val().sendpersonid === chat.chatwithpersonid)
        ) {
          arr.push({ ...item.val(), msgid: item.key });
        }
      });
      setShowmsg(arr);
    });
  }, [chat?.chatwithpersonid, userinfo.uid, db]);
  // showing group msg
  useEffect(() => {
    if (chat == null) {
      return;
    }
    const msgRef = ref(db, "groupmassage/");
    onValue(msgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), msgid: item.key });
      });
      setShowgrpmsg(arr);
    });
  }, [chat?.groupid, userinfo.uid, db]);

  const [selectedmsgId, setSelectedmsgId] = useState(null);
  const handlemsgbtn = (item) => {
    console.log(item);
    setSelectedmsgId(item.msgid === selectedmsgId ? null : item.msgid);
  };
  // msg forward
  const [friendList, setFriendList] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    if (item.msg) {
      setSentmsg(item.msg);
    } else if (item.img) {
      setSentimg(item.img);
    } else if (item.video) {
      setSentvideo(item.video);
    } else if (item.audio) {
      setSentAudio(item.audio);
    }
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
    console.log(item);

    if (item.rqstreceiverid === userinfo.uid) {
      set(push(ref(db, "massage/")), {
        sendperson: userinfo.displayName,
        sendpersonid: userinfo.uid,
        getpersonname: item.rqstsendername,
        getpersonid: item.rqstsenderid,
        msg: sentmsg,
        img: sentimg,
        video: sentvideo,
        audio: sentAudio,
        date: `${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      })
        .then(() => {
          if (item.img) {
            setSendmsg(false);
          } else if (item.msg) {
            setSentimg(false);
          }
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
        img: sentimg,
        video: sentvideo,
        audio: sentAudio,
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
    if (chat.type == "friendmsg") {
      if (userinfo.uid === item.sendpersonid) {
        remove(ref(db, "massage/" + item.msgid));
      }
    } else if (chat.type == "groupmsg") {
      if (userinfo.uid === item.sendpersonid) {
        remove(ref(db, "groupmassage/" + item.msgid));
      }
    }
  };
  // Edit msg
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataId, setDataId] = useState(null);
  const handleEdit = (item) => {
    if (chat.type == "friendmsg") {
      setSendmsg(item.msg);
      setIsUpdate(true);
      setDataId(item.msgid);
      console.log("friend");
    } else if (chat.type == "groupmsg") {
      setSendmsg(item.msg);
      setIsUpdate(true);
      setDataId(item.msgid);
      console.log("group");
    }
  };

  const handleUpdatemsg = () => {
    if (chat.type == "friendmsg") {
      console.log("friend");
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
    } else if (chat.type == "groupmsg") {
      console.log("friend");
      const msgRef = ref(db, `groupmassage/${dataId}`);
      onValue(
        msgRef,
        (snapshot) => {
          const currentData = snapshot.val();
          // Update only the msg field while keeping the other fields unchanged
          set(ref(db, `groupmassage/${dataId}`), {
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
    }
  };
  const handleemoji = (e) => {
    setSendmsg(sendmsg + e.emoji);
  };

  // image and video send

  const [fileType, setFileType] = useState("");

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".png",
  ];
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

  const checkFileType = (filename) => {
    const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else {
      return "unsupported";
    }
  };
  const handlefilesend = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = checkFileType(file.name);
      setFileType(type);

      if (type !== "unsupported") {
        // Upload the file
        console.log(`Uploading ${type} file: ${file.name}`);
        if (type == "image") {
          const storageRef = imgref(
            storage,
            `massageimage/${e.target.files[0].name + new Date()}`
          );
          uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              if (chat.type == "friendmsg") {
                console.log("friend");
                set(push(ref(db, "massage/")), {
                  sendperson: userinfo.displayName,
                  sendpersonid: userinfo.uid,
                  sendpersonphoto: userinfo.photoURL,
                  getpersonname: chat.chatwithpersonname,
                  getpersonid: chat.chatwithpersonid,
                  img: url,
                  date: `${new Date().getFullYear()}/${
                    new Date().getMonth() + 1
                  }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                }).then(() => {
                  setSendmsg("");
                  setemojiShow(false);
                });
              } else if (chat.type == "groupmsg") {
                console.log("group");
                set(push(ref(db, "groupmassage/")), {
                  sendperson: userinfo.displayName,
                  sendpersonid: userinfo.uid,
                  sendpersonphoto: userinfo.photoURL,
                  getpersonname: chat.groupname,
                  getpersonid: chat.groupid,
                  img: url,
                  date: `${new Date().getFullYear()}/${
                    new Date().getMonth() + 1
                  }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                }).then(() => {
                  setSendmsg("");
                  setemojiShow(false);
                });
              }
            });
            console.log("Uploaded a blob or file!");
          });
        } else if (type == "video") {
          const storageRef = imgref(
            storage,
            `massagevideo/${e.target.files[0].name + new Date()}`
          );
          uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              if (chat.type == "friendmsg") {
                console.log("friend");
                set(push(ref(db, "massage/")), {
                  sendperson: userinfo.displayName,
                  sendpersonid: userinfo.uid,
                  sendpersonphoto: userinfo.photoURL,
                  getpersonname: chat.chatwithpersonname,
                  getpersonid: chat.chatwithpersonid,
                  video: url,
                  date: `${new Date().getFullYear()}/${
                    new Date().getMonth() + 1
                  }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                }).then(() => {
                  setSendmsg("");
                  setemojiShow(false);
                });
              } else if (chat.type == "groupmsg") {
                console.log("group");
                set(push(ref(db, "groupmassage/")), {
                  sendperson: userinfo.displayName,
                  sendpersonid: userinfo.uid,
                  sendpersonphoto: userinfo.photoURL,
                  getpersonname: chat.groupname,
                  getpersonid: chat.groupid,
                  video: url,
                  date: `${new Date().getFullYear()}/${
                    new Date().getMonth() + 1
                  }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                }).then(() => {
                  setSendmsg("");
                  setemojiShow(false);
                });
              }
            });
            console.log("Uploaded a blob or file!");
          });
        }
      } else {
        console.log("Unsupported file type");
      }
    }
  };

  // image full screen
  const [openimg, setOpenimg] = useState(false);
  const [imgsrc, setImgsrc] = useState("");
  const handleCloseimg = () => {
    setOpenimg(false);
  };

  const handleOpenimg = (item) => {
    setOpenimg(true);
    setImgsrc(item.img);
  };
  // Audio send
  const addAudioElement = (blob) => {
    setSentAudio(blob);
    const storageRef = imgref(
      storage,
      `massageaudio/${sentAudio}_${new Date().toISOString()}`
    );
    uploadBytes(storageRef, blob).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadaudiourl) => {
        if (chat.type == "friendmsg") {
          console.log("friend");
          set(push(ref(db, "massage/")), {
            sendperson: userinfo.displayName,
            sendpersonid: userinfo.uid,
            sendpersonphoto: userinfo.photoURL,
            getpersonname: chat.chatwithpersonname,
            getpersonid: chat.chatwithpersonid,
            audio: downloadaudiourl,
            date: `${new Date().getFullYear()}/${
              new Date().getMonth() + 1
            }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
          }).then(() => {
            setSendmsg("");
            setemojiShow(false);
          });
        } else if (chat.type == "groupmsg") {
          console.log("group");
          set(push(ref(db, "groupmassage/")), {
            sendperson: userinfo.displayName,
            sendpersonid: userinfo.uid,
            sendpersonphoto: userinfo.photoURL,
            getpersonname: chat.groupname,
            getpersonid: chat.groupid,
            audio: downloadaudiourl,
            date: `${new Date().getFullYear()}/${
              new Date().getMonth() + 1
            }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
          }).then(() => {
            setSendmsg("");
            setemojiShow(false);
          });
        }
      });
      console.log("Uploaded a blob or file!");
    });
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
                  {" "}
                  {chat == null
                    ? "Please Select a Friend or Group"
                    : chat?.groupname || chat?.chatwithpersonname}
                </h2>
              </div>
              {
                <div className="textmsg">
                  <div className="textmsginn">
                    {chat == null ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <h2>Select a Friend Or Group for Chatting</h2>
                      </div>
                    ) : chat.type == "groupmsg" ? (
                      showgrpmsg.map((item, index) =>
                        item.sendpersonid === userinfo.uid &&
                        item.getpersonid === chat.groupid ? (
                          <div className="rightmsg" key={index}>
                            <div className="btnbox">
                              <Button
                                className="msgbtn"
                                onClick={() => handlemsgbtn(item)}
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
                            <div className="mssginner">
                              {item.msg ? (
                                <p>{item.msg}</p>
                              ) : item.img ? (
                                <img
                                  src={item.img}
                                  alt=""
                                  style={{
                                    width: "200px",
                                    borderRadius: "7px",
                                  }}
                                  onClick={() => handleOpenimg(item)}
                                />
                              ) : item.video ? (
                                <ReactPlayer
                                  url={item.video}
                                  controls
                                  className="videoplayer"
                                />
                              ) : item.audio ? (
                                <audio src={item.audio} controls />
                              ) : null}
                              <span style={{ fontSize: "14px" }}>
                                {moment(
                                  item.date,
                                  "YYYYMMDD h:mm:ss a"
                                ).fromNow()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          item.getpersonid === chat.groupid && (
                            <div className="leftmsg" key={index}>
                              <div className="mssginn">
                                <img
                                  src={item.sendpersonphoto}
                                  alt=""
                                  style={{
                                    width: "30px",
                                    marginRight: "15px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <div className="mssginner">
                                  <p
                                    style={{
                                      color: "#b3adad",
                                      background: "transparent",
                                      padding: "5px 0",
                                    }}
                                  >
                                    {item.sendperson}
                                  </p>
                                  {item.msg ? (
                                    <p>{item.msg}</p>
                                  ) : item.img ? (
                                    <img
                                      src={item.img}
                                      alt=""
                                      style={{
                                        width: "200px",
                                        borderRadius: "7px",
                                      }}
                                      onClick={() => handleOpenimg(item)}
                                    />
                                  ) : item.video ? (
                                    <ReactPlayer
                                      url={item.video}
                                      controls
                                      className="videoplayer"
                                    />
                                  ) : item.audio ? (
                                    <audio src={item.audio} controls />
                                  ) : null}
                                  <span style={{ fontSize: "14px" }}>
                                  {moment(
                                  item.date,
                                  "YYYYMMDD h:mm:ss a"
                                ).fromNow()}
                                  </span>
                                </div>
                              </div>
                              <div className="btnbox">
                                <Button
                                  className="msgbtn"
                                  onClick={() => handlemsgbtn(item)}
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
                      )
                    ) : (
                      chat.type == "friendmsg" &&
                      showmsg.map((item, index) =>
                        item.sendpersonid === userinfo.uid &&
                        item.getpersonid === chat.chatwithpersonid ? (
                          <div className="rightmsg" key={index}>
                            <div className="btnbox">
                              <Button
                                className="msgbtn"
                                onClick={() => handlemsgbtn(item)}
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
                            <div className="mssginner">
                              {item.msg ? (
                                <p>{item.msg}</p>
                              ) : item.img ? (
                                <img
                                  src={item.img}
                                  alt=""
                                  style={{
                                    width: "200px",
                                    borderRadius: "7px",
                                  }}
                                  onClick={() => handleOpenimg(item)}
                                />
                              ) : item.video ? (
                                <ReactPlayer
                                  url={item.video}
                                  controls
                                  className="videoplayer"
                                />
                              ) : item.audio ? (
                                <audio src={item.audio} controls />
                              ) : null}
                              <span style={{ fontSize: "14px" }}>
                                {moment(
                                  item.date,
                                  "YYYYMMDD h:mm:ss a"
                                ).fromNow()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          item.getpersonid === userinfo.uid &&
                          item.sendpersonid === chat.chatwithpersonid && (
                            <div className="leftmsg" key={index}>
                              <div className="mssginn">
                                <img
                                  src={item.sendpersonphoto}
                                  alt=""
                                  style={{
                                    width: "30px",
                                    marginRight: "15px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <div className="mssginner">
                                  {item.msg ? (
                                    <p>{item.msg}</p>
                                  ) : item.img ? (
                                    <img
                                      src={item.img}
                                      alt=""
                                      style={{
                                        width: "200px",
                                        borderRadius: "7px",
                                      }}
                                      onClick={() => handleOpenimg(item)}
                                    />
                                  ) : item.video ? (
                                    <ReactPlayer
                                      url={item.video}
                                      controls
                                      className="videoplayer"
                                    />
                                  ) : item.audio ? (
                                    <audio src={item.audio} controls />
                                  ) : null}
                                  <span style={{ fontSize: "14px" }}>
                                  {moment(
                                  item.date,
                                  "YYYYMMDD h:mm:ss a"
                                ).fromNow()}
                                  </span>
                                </div>
                              </div>
                              <div className="btnbox">
                                <Button
                                  className="msgbtn"
                                  onClick={() => handlemsgbtn(item)}
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
                      )
                    )}
                  </div>
                </div>
              }
              <div className="emoji">
                {emojiShow && <EmojiPicker onEmojiClick={handleemoji} />}
              </div>
              <div className={`writeInput`}>
                <div className={`inn ${emojiShow ? "writInput2" : ""}`}>
                  <input
                    type="text"
                    value={sendmsg}
                    onChange={(e) => setSendmsg(e.target.value)}
                  />
                  <div
                    onClick={() => setemojiShow(!emojiShow)}
                    style={{
                      width: "30px",
                      cursor: "pointer",
                      height: "30px",
                    }}
                  >
                    <img
                      src={emojibutton}
                      alt=""
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div style={{ lineHeight: "10px" }}>
                    <label htmlFor="file">
                      <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handlefilesend}
                      />
                      <IoIosAttach
                        style={{ fontSize: "30px", cursor: "pointer" }}
                      />
                    </label>
                  </div>
                  <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }}
                  />

                  {!isUpdate && (
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handlesendmsg}
                      disabled={
                        sendmsg == "" ||
                        sendmsg == null ||
                        chat == "" ||
                        chat == null
                          ? true
                          : false
                      }
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
              {/* image modal */}
              <Modal
                open={openimg}
                onClose={handleCloseimg}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleimg}>
                  <img src={imgsrc} alt="" className="viewImg" />
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
