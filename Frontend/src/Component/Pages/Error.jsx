import React from "react";

const Error = () => {
  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "80px",
    margin: "0",
    color: "#dc3545",
  };

  const textStyle = {
    fontSize: "20px",
    margin: "10px 0",
    color: "#333",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={textStyle}>Oops! Page not found.</p>
      <button style={buttonStyle} onClick={() => window.location.href = "/"}>
        Go to Home
      </button>
    </div>
  );
};

export default Error;