import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

export default function IsoPushButton({ size = 260, onClick }: { size: number, onClick: any }) {
  const [pressed, setPressed] = useState(false);
  const depth = pressed ? 6 : 16;
  const baseY = 176;
  const topY = baseY - depth;

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      onClick?.();
    }, 160);
  };

  return (
    <Box sx={{ width: size }}>
      <svg viewBox="0 0 420 340" width="100%" height="100%">
        <defs>
          <linearGradient id="top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dcdcdc" />
            <stop offset="100%" stopColor="#c8c8c8" />
          </linearGradient>

          <linearGradient id="left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5b5b5" />
            <stop offset="100%" stopColor="#9f9f9f" />
          </linearGradient>

          <linearGradient id="right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8a8a8" />
            <stop offset="100%" stopColor="#8f8f8f" />
          </linearGradient>

          <radialGradient id="btn" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff5a5a" />
            <stop offset="60%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#980000" />
          </radialGradient>
          <linearGradient id="btnSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9e0000" />
            <stop offset="50%" stopColor="#d40000" />
            <stop offset="100%" stopColor="#7a0000" />
          </linearGradient>

          <radialGradient id="btnTop" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff6a6a" />
            <stop offset="70%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#990000" />
          </radialGradient>
        </defs>

        {/* ===== مکعب اصلی ===== */}

        {/* وجه چپ */}
        <polygon
          points="110,160 110,240 190,290 190,200"
          fill="url(#left)"
        />

        {/* وجه راست */}
        <polygon
          points="110,160 270,160 350,200 190,200"
          fill="url(#right)"
        />

        {/* سطح بالا */}
        <polygon
          points="110,160 270,160 350,195 190,200"
          fill="url(#top)"
          opacity="0.95"
        />


        {/* ===== فرورفتگی بالا ===== */}

        {/* کف فرورفتگی */}
        <polygon
          points="150,165 245,165 305,190 210,190"
          fill="#bfbfbf"
        />



        {/* ===== دکمه قرمز داخل فرورفتگی ===== */}
        <g onClick={handlePress} style={{ cursor: "pointer" }}>

          {/* دیواره استوانه */}
          {/* کف ثابت */}
          <ellipse
            cx="225"
            cy={baseY}
            rx="40"
            ry="10"
            fill="url(#btnSide)"
          />

          {/* بدنه */}
          <rect
            x="185"
            y={topY}
            width="80"
            height={depth}
            fill="url(#btnSide)"
            style={{ transition: "all 0.16s cubic-bezier(.4,0,.2,1)" }}
          />

          {/* سطح بالا (حرکت می‌کند) */}
          <ellipse
            cx="225"
            cy={topY}
            rx="40"
            ry="16"
            fill="url(#btnTop)"
            style={{ transition: "all 0.16s cubic-bezier(.4,0,.2,1)" }}
          />

          {/* هایلایت */}
          <ellipse
            cx="212"
            cy={topY - 10}
            rx="12"
            ry="7"
            fill="white"
            opacity="0.35"
            style={{ transition: "all 0.16s cubic-bezier(.4,0,.2,1)" }}
          />
        </g>

        {/* ===== لبه جلویی فرورفتگی (روی دکمه میاد) ===== */}
        <polygon
          points="200,190 305,190 305,198 200,198"
          fill="#9a9a9a"
        />

        {/* ===== شیار کناری ===== */}
        <polygon
          points="125,205 165,230 165,255 125,230"
          fill="#7d7d7d"
        />
        {/* دیواره عقب فرورفتگی */}
        <polygon
          points="160,165 200,190 200,198 160,173"
          fill="#a5a5a5"
        />
        {/* سطح جلو */}
        <polygon
          points="190,200 350,195 350,285 190,290"
          fill="url(#top)"
        //   opacity="0.95"
        />
      </svg>
      <Box position={"relative"} bottom={80} left={"27%"}>
        <Typography>چالش</Typography>
      </Box>
    </Box>
  );
}
