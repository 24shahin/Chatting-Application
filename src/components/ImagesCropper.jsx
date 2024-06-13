import React, { useState, useEffect, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "@mui/material/Button";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlice";
import { getAuth, updateProfile } from "firebase/auth";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getDatabase, update } from "firebase/database"; // Import update from Firebase database

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

function ImagesCropper({ profilepic, groupId }) {
  const dispatch = useDispatch();
  const storage = getStorage();
  const userinfo = useSelector((state) => state?.user?.value);
  const auth = getAuth();
  const db = getDatabase(); // Initialize the database

  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

  // Define storage references inside useEffect to update when groupId changes
  const storageRef = ref(storage, `profilePic/${userinfo.uid}`);
  const storagegrpimgRef = ref(storage, `groupPic/${groupId}`);

  useEffect(() => {
    // Reset image and cropData when groupId changes
    setImage(defaultSrc);
    setCropData("#");
  }, [groupId]);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    const message4 = cropperRef.current?.cropper
      .getCroppedCanvas()
      .toDataURL();
    if (profilepic) {
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...userinfo, photoURL: downloadURL })
            );
            dispatch(activeUser({ ...userinfo, photoURL: downloadURL }));
          });
        });
      });
    } else {
      uploadString(storagegrpimgRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storagegrpimgRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Update group image URL in Firebase database
          update(ref(db, `grouplist/${groupId}`), {
            grpphotoURL: downloadURL,
          });
        });
      });
    }
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <h3>Photo Upload</h3>
        <br />
        <div className="box" style={{ width: "50%" }}>
          <h1>Preview</h1>
          <div
            className="img-preview"
            style={{
              width: "100%",
              float: "left",
              height: "250px",
              borderRadius: "50%",
            }}
          />
        </div>
        {/* <input type="file"  onChange={onChange}/> */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onChange={onChange}
        >
          Choose file
          <VisuallyHiddenInput type="file" />
        </Button>

        <Cropper
          ref={cropperRef}
          style={{ height: 300, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />
      </div>
      <div>
        <div className="box" style={{ width: "50%", float: "right" }}>
          <Button
            style={{ float: "right" }}
            onClick={getCropData}
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
          </Button>
        </div>
      </div>
      <br style={{ clear: "both" }} />
    </div>
  );
}

export default ImagesCropper;
