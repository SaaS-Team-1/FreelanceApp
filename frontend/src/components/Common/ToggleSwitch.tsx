
"use client";

import { useState } from "react";

export function ToggleSwitch() {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => setIsOn(!isOn);
  
    return (
      <div
        onClick={handleToggle}
        className="flex cursor-pointer items-center"
        style={{
          width: "50px",
          height: "26px",
          backgroundColor: isOn ? "rgba(67, 227, 126, 0.58)" : "rgba(200, 200, 200, 1)", // green for "on", gray for "off"
          //backgroundColor: isOn ? "rgba(68, 176, 232, 1)" : "rgba(200, 200, 200, 1)", // blue for "on", gray for "off"
          borderRadius: "9999px",
          padding: "2px",
          position: "relative",
          transition: "background-color 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* White Circle (Toggle Knob) */}
        <div
          style={{
            width: "22px",
            height: "22px",
            backgroundColor: "white",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: isOn ? "calc(100% - 24px)" : "2px", // Moves circle based on toggle state
            transition: "left 0.3s ease",
            boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.2)", // Adds a shadow for visibility
          }}
        />
      </div>
    );
  }