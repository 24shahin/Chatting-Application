import React, { useState } from "react";
import "../css/logPages.css";
import Registration from "../components/Registration";
import Login from "../components/Login";
import Hi from "../assets/hi33.gif";
import Hi2 from "../assets/hi2.png";

function LogPages() {
  const [moved, setMoved] = useState(false);
  const [style, setStyle] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleMove = () => {
    setMoved(!moved);
  };

  const handleStyle = () => {
    setStyle(!style);
    setMoved(false);
  };

  const handleRegistrationComplete = () => {
    setMoved(false);
  };

  return (
    <>
      <div className="d">
        {" "}
        <button
          className={`stylebtn ${!style ? "style1btn" : ""}`}
          onClick={handleStyle}
          disabled={style ? false : true}
        >
          1
        </button>
        <button
          className={`stylebtn ${style ? "style2btn" : ""}`}
          onClick={handleStyle}
          disabled={style ? true : false}
        >
          2
        </button>
      </div>
      <div className="containerBox">
        <div className={`singcontainer ${style ? "style1" : "style2"}`}>
          <div className="box">
            {registrationComplete ? (
              <Login />
            ) : (
              <>
                <div className={`overlay ${moved ? "move" : "move2"}`}></div>
                <div className={`logInPart`}>
                  <div
                    className={` ${
                      moved ? "signUpInputpart" : "signUpinputMove"
                    }`}
                  >
                    <div className="signUpInputInner">
                      <h2>Welcom Back!</h2>
                      <p>
                        Enter your personal details to use all of site features
                      </p>
                      <button onClick={handleMove}>signIn</button>
                      <img src={Hi2} alt="" className="regimg2" />
                    </div>
                  </div>
                  <div
                    className={` ${
                      moved ? "signInButtonMove" : "singInButton"
                    }`}
                  >
                    <div className="signInButtonInner">
                      <Login />
                    </div>
                  </div>
                </div>

                <div className={`signUp`}>
                  <div
                    className={` ${
                      moved ? "signUpButton" : "signUpButtonMove"
                    }`}
                  >
                    <div className="singUpButtonInner">
                      <Registration
                        onRegistrationComplete={handleRegistrationComplete}
                      />
                    </div>
                  </div>
                  <div
                    className={` ${
                      moved ? "signInInputMove" : "signIninputPart"
                    }`}
                  >
                    <div className="signInInputInner">
                      <h2>Hello, Friend!</h2>
                      <p>
                        Register with your personal details to use all of site
                        features
                      </p>
                      <button onClick={handleMove}>signUp</button>
                      <img src={Hi} alt="" className="regimg" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogPages;
