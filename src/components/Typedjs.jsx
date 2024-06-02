import React from "react";
import { ReactTyped } from "react-typed";

function Typedjs() {
  let typedText = [
    "Stay connected with our chat app: fast, secure, and user-friendly. Share messages, photos, and videos effortlessly with friends and family.",
    "ChatApp connects you instantly with friends and family. Share messages, photos, and videos seamlessly. Stay connected anytime, anywhere. Download now!",
    "Stay connected with our new chat app! Share messages, photos, and videos instantly. Download now for seamless communication and fun.",
  ];
  return (
    <div style={{ display: "flex" }}>
      <div className="typedinner">
        <ReactTyped
          strings={typedText}
          typeSpeed={40}
          loop
          style={{ fontSize: "30px" }}
        />
      </div>
    </div>
  );
}

export default Typedjs;
