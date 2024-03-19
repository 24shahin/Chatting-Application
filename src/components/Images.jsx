import React from "react";

function Images({ src, altText, style }) {
  return <img src={src} alt={altText} className={style} />;
}

export default Images;
