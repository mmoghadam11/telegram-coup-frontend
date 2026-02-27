import React, { useState } from "react";
import "./Envelope.css";

export default function Envelope() {
  const [open, setOpen] = useState(false);

  return (
    <div className="scene">
      <div
        className={`envelope ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {/* Letter */}
        <div className="letter">
          <div className="letter-content">
            <h3>سلام ✨</h3>
            <p>این نامه از بالای پاکت بیرون میاد 💌</p>
          </div>
        </div>

        {/* Front pocket (قسمت جلویی پاکت) */}
        <div className="pocket" />

        {/* Flap */}
        <div className="flap" />

        {!open && <div className="seal">از طرف فلانی</div>}
      </div>
    </div>
  );
}
