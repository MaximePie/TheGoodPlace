import React from 'react';

export default function UploadButton({onChange, text}) {
  return (
    <p className="UploadButton">
      <button className="UploadButton__banner-button">{text}</button>
      <input
        type="file"
        className="UploadButton__banner-input"
        onChange={onChange}
      />
    </p>
  );
}
