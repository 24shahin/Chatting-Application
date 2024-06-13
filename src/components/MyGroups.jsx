import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { GiCrossedBones } from "react-icons/gi";
import { HiDotsVertical } from "react-icons/hi";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
} from "firebase/database";
import ImagesCropper from "./ImagesCropper";

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
const defaultGroupImage = "https://path-to-your-default-group-image.jpg";
function MyGroups() {
  const db = getDatabase();
  const userinfo = useSelector((state) => state?.user?.value);
  const [open, setOpen] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null); // Track current group for image update
  const handleModalClose = () => setOpen(false);
  const handleModalOpen = (groupId) => {
    console.log(groupId);
    setCurrentGroupId(groupId);
    setOpen(true);
  };

  // group request show
  const [groupjoinList, setGroupjoinList] = useState([]);
  const [openreq, setOpenreq] = useState(false);
  const handleModalreqClose = () => setOpenreq(false);
  const handleModalreqOpen = (item) => {
    setOpenreq(true);

    const grpreqstRef = ref(db, "grouprequest/");
    onValue(grpreqstRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((info) => {
        if (item.mygrpid == info.val().grplistid) {
          arr.push({ ...info.val(), grprqstid: info.key });
        }
      });
      setGroupjoinList(arr);
    });
  };
  const [createGroupButtonShow, setCreateGroupButtonShow] = useState(false);
  const [createGroupInput, setCreateGroupInput] = useState({
    grpname: "",
    grptag: "",
  });
  const [mygrplist, setMyGrpList] = useState([]);
  const [optionOpen, setOptionOpen] = useState(null); // Track open options by group ID

  // Array of refs for each group
  const menuRefs = useRef([]);

  useEffect(() => {
    const mygrpRef = ref(db, "grouplist/");
    onValue(mygrpRef, (snapshot) => {
      const arr = [];
      snapshot.forEach((item) => {
        if (userinfo.uid === item.val().adminid) {
          arr.push({ ...item.val(), mygrpid: item.key });
        }
      });
      setMyGrpList(arr);
      // Initialize refs
      menuRefs.current = arr.map(
        (_, i) => menuRefs.current[i] || React.createRef()
      );
    });
  }, [db, userinfo.uid]);

  const handleChange = (e) => {
    setCreateGroupInput((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreatGRP = () => {
    set(push(ref(db, "grouplist/")), {
      grpname: createGroupInput.grpname,
      grptag: createGroupInput.grptag,
      adminname: userinfo.displayName,
      adminid: userinfo.uid,
      grpphotoURL:
        "https://firebasestorage.googleapis.com/v0/b/chatting-application-b6c69.appspot.com/o/avatar%2Favatar.jpg?alt=media&token=133ca0e4-fa6d-4881-ac34-27d9956bb3fe",
    }).then(() => {
      setCreateGroupButtonShow(false);
    });
  };

  const handleGRPdelet = (item) => {
    remove(ref(db, "grouplist/" + item.mygrpid));
  };

  const handleOptionClick = (groupId) => {
    setOptionOpen((prevOptionOpen) =>
      prevOptionOpen === groupId ? null : groupId
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRefs.current.some(
          (ref) => ref.current && ref.current.contains(event.target)
        )
      ) {
        return;
      }
      setOptionOpen(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // accept group request
  const handlegrprqstAccept = (item) => {
    console.log(item);
    set(push(ref(db, "memberlist/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.grprqstid));
    });
  };
  // delet group request
  const handlegrprqstCancle = (item) => {
    remove(ref(db, "grouprequest/" + item.grprqstid));
  };
  // member show
  const [groupmemList, setGroupMemList] = useState([]);
  const [openmem, setOpenmem] = useState(false);
  const handleModalmemClose = () => setOpenmem(false);
  const handleModalmemOpen = (item) => {
    setOpenmem(true);

    const memberRef = ref(db, "memberlist/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((info) => {
        if (item.mygrpid == info.val().grplistid) {
          arr.push({ ...info.val(), memberid: info.key });
        }
      });
      setGroupMemList(arr);
    });
  };
  // member delet
  const handlememberDelet = (item) => {
    remove(ref(db, "memberlist/" + item.memberid));
  };
  // invite user to join group
  const [inviteList, setInviteList] = useState([]);
  const [openInvite, setOpenInvite] = useState(false);
  const handleModalinviteClose = () => setOpenInvite(false);
  const handleModalinviteOpen = (item) => {
    setOpenInvite(true);

    const memberRef = ref(db, "users/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val() });
      });
      setInviteList(arr);
    });
  };
  // const handleImageSave = (url, groupId) => {
  //   set(ref(db, `grouplist/${groupId}/grpphotoURL`), url);
  // };
  
  return (
    <div className="boxcontainer relative">
      <div className="tittlebar">
        <h2>My Groups List</h2>
        {!createGroupButtonShow && (
          <Button
            variant="contained"
            onClick={() => setCreateGroupButtonShow(!createGroupButtonShow)}
          >
            Create Group
          </Button>
        )}
        {createGroupButtonShow && (
          <Button
            variant="contained"
            onClick={() => setCreateGroupButtonShow(!createGroupButtonShow)}
          >
            <GiCrossedBones style={{ fontSize: "18px", padding: "4px" }} />
          </Button>
        )}
      </div>
      {createGroupButtonShow && (
        <div className="grpinputbox">
          <TextField
            label="Group Name"
            variant="outlined"
            style={{ width: "100%", marginTop: "34px" }}
            onChange={handleChange}
            name="grpname"
            className="Nunito"
          />
          <TextField
            label="Group Tag"
            variant="outlined"
            style={{ width: "100%", marginTop: "34px" }}
            onChange={handleChange}
            name="grptag"
            className="Nunito"
          />
          <Button
            variant="contained"
            style={{
              width: "340px",
              borderRadius: "86px",
              margin: "34px auto",
              padding: "15px 0",
            }}
            onClick={handleCreatGRP}
            className="Nunito"
          >
            Create Group
          </Button>
        </div>
      )}
      {mygrplist.map((item, index) => (
        <div className="boxinner relative" key={index}>
          <div className="userimg">
            <img
              src={item.grpphotoURL || defaultGroupImage} // Use default image if no group image is available
              alt=""
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              onClick={() => handleModalOpen(item.mygrpid)}
            />
            <Modal
              open={open}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <ImagesCropper
                  profilepic={false}
                  // onSave={(url) => handleImageSave(url, item.mygrpid)}
                  groupId={currentGroupId}
                />
              </Box>
            </Modal>
          </div>
          <div>
            <div className="username">
              <h2>{item.grpname}</h2>
            </div>
            <div className="username">
              <h3>{item.grptag}</h3>
            </div>
            <div className="username">
              <h3>Admin Name:{item.adminname}</h3>
            </div>
          </div>
          <div className="grpbtns">
            <Button
              variant="contained"
              onClick={() => handleModalreqOpen(item)}
            >
              Requests
            </Button>
            <Modal
              open={openreq}
              onClose={handleModalreqClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Your Group Request to Join
                </Typography>
                {groupjoinList.map((item, index) => (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    key={index}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={item.whosendrequestphoto}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.whosendrequestname}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.whosendrequestname}
                            </Typography>
                            {`---Wants to join ${item.grpname}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <div style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        onClick={() => handlegrprqstAccept(item)}
                      >
                        {" "}
                        accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "15px" }}
                        onClick={() => handlegrprqstCancle(item)}
                      >
                        {" "}
                        delet
                      </Button>
                    </div>
                    <br />
                    <Divider variant="inset" component="li" />
                  </List>
                ))}
              </Box>
            </Modal>
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              onClick={() => handleModalmemOpen(item)}
            >
              Members
            </Button>
            <Modal
              open={openmem}
              onClose={handleModalmemClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Members, You had accepted
                </Typography>
                {groupmemList.map((item, index) => (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    key={index}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={item.whosendrequestphoto}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.whosendrequestname}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.whosendrequestname}
                            </Typography>
                            {`---is a member of ${item.grpname}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <div style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        onClick={() => handlememberDelet(item)}
                      >
                        {" "}
                        delet membership
                      </Button>
                    </div>
                    <br />
                    <Divider variant="inset" component="li" />
                  </List>
                ))}
              </Box>
            </Modal>
          </div>
          <div ref={menuRefs.current[index]}>
            <HiDotsVertical
              style={{ fontSize: "28px", cursor: "pointer" }}
              onClick={() => handleOptionClick(item.mygrpid)}
            />
            {optionOpen === item.mygrpid && (
              <div className="optionBox">
                <Button
                  variant="contained"
                  onClick={() => handleModalinviteOpen(item)}
                >
                  Invite
                </Button>
                <Button
                  variant="contained"
                  style={{ marginLeft: "15px" }}
                  color="error"
                  onClick={() => handleGRPdelet(item)}
                >
                  Delete this group
                </Button>
              </div>
            )}
          </div>
          <Modal
            open={openInvite}
            onClose={handleModalinviteClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="showuserBox">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  User where you can invite
                </Typography>
                {inviteList.map((item, index) => (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    key={index}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={item.photoURL} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            ></Typography>
                            {`Invite to join This Group`}
                          </React.Fragment>
                        }
                      />
                      <Button variant="contained" color="success">
                        {" "}
                        invite
                      </Button>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                ))}
              </div>
            </Box>
          </Modal>
        </div>
      ))}
    </div>
  );
}

export default MyGroups;
