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

  async function getAndDisplayVectorData(type, data) {
    // 1. Declare 'result' outside the try block
    let result = null; 

    try {
      const response = await fetch(`https://backtrack.kaolun.site/getVector?type=${type}&data=${data}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If the response status is 4xx or 5xx
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      // Assign the successfully parsed data to 'result'
      result = await response.json();
      console.log("✅ Success:", result);

      // 2. Put the logic that uses 'result' INSIDE the try block
      
      // Safety check: Ensure the result is an array and has at least one item
      if (!Array.isArray(result) || result.length === 0) {
          console.error("❌ Error: Result is empty or not an array.");
          return; // Stop execution if data is bad
      }


      // 3. Remove unnecessary 'await' for property access
      const firstResult = result[0];
      let image = firstResult.metadata.image_data;
      image = `data:image/png;base64,${image}`
      console.log(image)
      let location = firstResult.metadata.location;
      let contact = firstResult.metadata.contact;
      
      // Call the display function
      displayResult({
          imageBase64: image,
          location: location,
          contact: contact,
      });

    } catch (error) {
      // This catches network errors, JSON parsing errors, and the error thrown above
      console.error("❌ Error processing vector data:", error.message);
    }
  }

  const search = () => {
    if (file || text) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let reqResult;
        if (file) {
          const base64String = (reader.result as string).split(",")[1];
          const output = { base64String, text };
          reqResult = getAndDisplayVectorData("image", base64String)
        } else {
          const output = { text }
        }
        
        console.log(result)
        // get response as a json, input it into dummy response, make sure to rename json name thing accordingly throughout code

        // Example dummy response
        displayResult({
          imageBase64: "fred",
          location: "town",
          contact: "425",
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        getAndDisplayVectorData("description", text)
    
      }
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
    console.log(response);
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
    backgroundColor: "#073F61",
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
          src={result.imageBase64 || placeHolderImg}
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
