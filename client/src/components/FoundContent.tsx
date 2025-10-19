import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function FoundContent() {
  // capturing the image --------------------------
  const circleButtonStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "35%",
    backgroundColor: "white",
    outline: "3px solid #23415c",

    display: "flex",
    cursor: "pointer",
  };
  const squareButtonStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "12%",
    backgroundColor: "black",
    display: "flex",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };
  const webcamRef = useRef<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // store the screenshot
  const retake = () => setCapturedImage(null);

  const save = () => {
    // send the screen shot to jones
    // display or upload hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    retake();
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      console.log(imageSrc); // base64 image string
    }
  }, [webcamRef]);

  // setting the camera size --------------------------
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = dimensions;
  const isMobile = width < 768;

  return (
    <>
      {!capturedImage ? (
        <Webcam
          ref={webcamRef}
          width={isMobile ? width * 0.9 : width * 0.5}
          height={isMobile ? height * 0.4 : height * 0.5}
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

      {/* Button */}
      {!capturedImage ? (
        <button style={circleButtonStyle} onClick={capture}></button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <button style={squareButtonStyle} onClick={retake}>
            Redo
          </button>
          <button style={squareButtonStyle} onClick={save}>
            Save
          </button>
        </div>
      )}
    </>
  );
}
