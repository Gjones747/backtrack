import React, { useState, useRef } from "react";
import uploadImg from "../assets/download.png";
import placeHolderImg from "../assets/placeholder.png";
import "../css/Shake.css";

export default function LostContent() {
  const MAX_CHARS = 150;
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [stage, setStage] = useState<"input" | "result">("input");
  const [result, setResult] = useState<{
    imageBase64: string;
    location: string;
    contact: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const search = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        const output = { base64String, text };
        console.log(output);

        // get response as a json, input it into dummy response, make sure to rename json name thing accordingly throughout code

        // Example dummy response
        displayResult({
          imageBase64: "fred",
          location: "town",
          contact: "425",
        });
      };
      reader.readAsDataURL(file);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const displayResult = (response: {
    imageBase64: string;
    location: string;
    contact: string;
  }) => {
    setStage("result");
    setResult(response);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setText("");
    setStage("input");
    setResult(null);
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

  const clickableImageStyle: React.CSSProperties = {
    width: "75%",
    maxWidth: "400px",
    maxHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    border: "none",
    outline: "none",
    backgroundColor: "#f8f1d8",
    marginTop: "6px",
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

  if (stage === "result" && result) {
    return (
      <div
        style={{
          color: "black",
          textAlign: "center",
          height: "100vh", // take full screen height
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px", // tight spacing between elements
          padding: "12px",
        }}
      >
        <h3>We found a match!</h3>
        <img
          src={placeHolderImg || result.imageBase64}
          style={{ width: "75%" }}
          alt="response"
        />
        <div>
          <strong>Location:</strong> {result.location}
        </div>
        <div>
          <strong>Contact:</strong> {result.contact}
        </div>
        <button style={buttonStyle} onClick={reset}>
          Search again
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ color: "black" }}>Upload an image of your item.</div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={fileUpdate}
        style={{ display: "none" }}
      />

      <button
        style={clickableImageStyle}
        className={shake ? "shake" : ""}
        onClick={handleUploadClick}
      >
        <img src={preview || uploadImg} alt="Preview" style={imageStyle} />
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
