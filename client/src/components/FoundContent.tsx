import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import "../css/Shake.css";

export default function FoundContent({ onClose }) {
  const circleButtonStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "35%",
    backgroundColor: "white",
    outline: "3px solid #23415c",
    display: "flex",
    cursor: "pointer",
    padding: "0",
    alignItems: "center",
    justifyContent: "center",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "75%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "10px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    alignSelf: "center",
  };

  const textAreaStyle: React.CSSProperties = {
    resize: "none",
    borderColor: "black",
    backgroundColor: "white",
    color: "black",
    width: "100%",
    height: "70px",
    boxSizing: "border-box",
    borderRadius: "8px",
    padding: "6px",
  };

  const squareButtonStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "12%",
    backgroundColor: "#073F61",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "center",
  };

  const MAX_CHARS = 75;
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showTextbox, setShowTextbox] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const [shake, setShake] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // ✅ new

  const handleLocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setLocation(e.target.value);
  const handleContactChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContact(e.target.value);

  const retake = () => setCapturedImage(null);

  const save = () => setShowTextbox(true);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  async function sendData(
    imageData: string,
    location: string,
    contact: string
  ) {
    const data = {
      image: imageData,
      location: location,
      description: "",
      contact: contact,
    };

    try {
      const response = await fetch("https://backtrack.kaolun.site/addVector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("✅ Success:", result);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }

  const handleFinalSave = () => {
    if (location && contact && capturedImage) {
      const cleaned = capturedImage.split(",")[1];
      const result = { cleaned, location, contact };
      console.log(result);

      sendData(cleaned, location, contact);

      setIsSaved(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = dimensions;
  const isMobile = width < 768;

  const thanksStyle: React.CSSProperties = {
    transition: "all 0.6s ease",
    transform: isSaved ? "scale(1)" : "scale(0.9)",
    opacity: isSaved ? 1 : 0,
    fontSize: "1.5rem",
    color: "black",
    textAlign: "center",
    padding: "30px",
    overflow: "hidden",
  };

  return (
    <>
      {!isSaved && !showTextbox && (
        <>
          {!capturedImage ? (
            <Webcam
              ref={webcamRef}
              width={isMobile ? width * 0.9 : width * 0.5}
              height={isMobile ? height * 0.4 : height * 0.5}
              videoConstraints={{
                facingMode: isMobile ? "user" : "environment",
              }}
              mirrored
              screenshotFormat="image/jpeg"
              style={{
                borderRadius: "12px",
                objectFit: "cover",
                maxWidth: "100%",
              }}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                borderRadius: "12px",
                width: isMobile ? width * 0.9 : width * 0.5,
                height: isMobile ? height * 0.4 : height * 0.5,
                objectFit: "cover",
                maxWidth: "100%",
              }}
            />
          )}

          {!capturedImage ? (
            <button style={circleButtonStyle} onClick={capture}>
              <FaCamera
                style={{ color: "#073F61", height: "50px%", width: "50%" }}
              />
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <button style={squareButtonStyle} onClick={retake}>
                Redo
              </button>
              <button style={squareButtonStyle} onClick={save}>
                Save
              </button>
            </div>
          )}
        </>
      )}

      {!isSaved && showTextbox && (
        <div style={containerStyle}>
          <div style={{ color: "black" }}>Describe the location:</div>
          <textarea
            style={textAreaStyle}
            value={location}
            maxLength={MAX_CHARS}
            onChange={handleLocationChange}
            required
          />

          <div style={{ color: "black" }}>What's your contact info?</div>
          <textarea
            style={textAreaStyle}
            value={contact}
            maxLength={MAX_CHARS}
            onChange={handleContactChange}
            required
          />

          <button
            style={buttonStyle}
            className={shake ? "shake" : ""}
            onClick={handleFinalSave}
          >
            Save
          </button>
        </div>
      )}

      {isSaved && (
        <div
          style={{
            ...thanksStyle,
            width: "100%",
            overflowX: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <b>Thanks!</b>
        </div>
      )}
    </>
  );
}
