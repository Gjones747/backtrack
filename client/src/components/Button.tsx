import React from 'react';

// Custom "button" made from a div
export default function ButtonDiv({ label, onClick }) {
  const style: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    userSelect: 'none',
    textAlign: 'center',
    width: '100px',
    transition: 'background-color 0.2s',
  };

  const hoverStyle: React.CSSProperties = {
    ...style,
    backgroundColor: '#0056b3',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={isHovered ? hoverStyle : style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </div>
  );
}
