import React from "react";

export default function ButtonDiv({ onClick, children }) {
  const style: React.CSSProperties = {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    userSelect: "none",
    width: "100px",
    transition: "background-color 0.2s",
    zIndex: "10",
  };

  const hoverStyle: React.CSSProperties = {
    ...style,
    filter: "brightness(0.6)",
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={isHovered ? hoverStyle : style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
