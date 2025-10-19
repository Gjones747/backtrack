import React, { useState, useRef } from "react";
import placeHolImg from "../assets/download.png";
import "../css/Shake.css";

export default function LostContent() {
  const MAX_CHARS = 150;
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [shake, setShake] = useState(false); // 👈 add this
  const fileInputRef = useRef<HTMLInputElement>(null);

  const search = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log(base64String);
        const output = {base64String, text};
        console.log(output);
        // do something with this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      };
      reader.readAsDataURL(file);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400); // match animation duration
    }
  };

  const textUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const handleUploadClick = () => fileInputRef.current?.click();

  const fileUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const imageWrapperStyle: React.CSSProperties = {
    width: "75%",
    maxWidth: "400px",
    maxHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "6px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    alignSelf: "center",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "75%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  };

  const textAreaStyle: React.CSSProperties = {
    resize: "none",
    borderColor: "black",
    backgroundColor: "white",
    color: "black",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  };

  const counterStyle: React.CSSProperties = {
    textAlign: "right",
    fontSize: "12px",
    color: text.length === MAX_CHARS ? "red" : "gray",
    marginTop: "2px",
  };

  return (
    <>
      <div style={{ color: "black" }}>Upload an image of your item.</div>

      <div
        id="uploadImg"
        className={shake ? "shake" : ""} // 👈 conditionally add shake
        style={imageWrapperStyle}
      >
        <img src={preview || placeHolImg} alt="Preview" style={imageStyle} />
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={fileUpdate}
        style={{ display: "none" }}
      />

      <button style={buttonStyle} onClick={handleUploadClick}>
        Upload
      </button>

      <div style={{ color: "black" }}>
        Describing your image is also helpful.
      </div>

      <div style={containerStyle}>
        <textarea
          style={textAreaStyle}
          maxLength={MAX_CHARS}
          onChange={textUpdate}
          required
        />
        <div style={counterStyle}>
          {text.length}/{MAX_CHARS}
        </div>
        <button style={buttonStyle} onClick={search}>
          Find your item
        </button>
      </div>
    </>
  );
}
