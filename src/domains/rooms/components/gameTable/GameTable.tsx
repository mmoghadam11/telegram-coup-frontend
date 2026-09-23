import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PlayerSeat from "./PlayerSeat";

interface Player {
  id: string;
  name: string;
  connected: boolean;
  coins: number;
  roleCount: number;
  revealedRoles: string[];
  isAlive: boolean;
}

interface GameTableProps {
  players: Player[];
  myUserId: string;
  currentTurnPlayerId: string;
}

type SeatPosition = {
  top: string;
  left: string;
};

const SEAT_POSITIONS: Record<number, SeatPosition[]> = {
  2: [
    { top: "88%", left: "50%" },
    { top: "12%", left: "50%" },
  ],

  3: [
    { top: "88%", left: "50%" },
    { top: "25%", left: "15%" },
    { top: "25%", left: "85%" },
  ],

  4: [
    { top: "88%", left: "50%" },
    { top: "50%", left: "10%" },
    { top: "12%", left: "50%" },
    { top: "50%", left: "90%" },
  ],

  5: [
    { top: "88%", left: "50%" },
    { top: "48%", left: "9%" },
    { top: "12%", left: "27%" },
    { top: "12%", left: "73%" },
    { top: "48%", left: "91%" },
  ],

  6: [
    { top: "88%", left: "50%" },
    { top: "58%", left: "8%" },
    { top: "20%", left: "18%" },
    { top: "8%", left: "50%" },
    { top: "20%", left: "82%" },
    { top: "58%", left: "92%" },
  ],

  7: [
    { top: "88%", left: "50%" },
    { top: "62%", left: "7%" },
    { top: "25%", left: "12%" },
    { top: "8%", left: "35%" },
    { top: "8%", left: "65%" },
    { top: "25%", left: "88%" },
    { top: "62%", left: "93%" },
  ],
};

export default function GameTable({
  players,
  myUserId,
  currentTurnPlayerId,
}: GameTableProps) {
  const theme = useTheme();

  /*
   * خودمان را اول قرار می‌دهیم تا همیشه پایین میز باشیم.
   */
  const orderedPlayers = [
    ...players.filter((p) => p.id === myUserId),
    ...players.filter((p) => p.id !== myUserId),
  ];

  const positions =
    SEAT_POSITIONS[orderedPlayers.length] || SEAT_POSITIONS[7];

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / .78",
        minHeight: 560,
        overflow: "hidden",
        borderRadius: 4,

        background: isDark
          ? "radial-gradient(circle at center, #17100b 0%, #080604 100%)"
          : "radial-gradient(circle at center, #e7d0ae 0%, #b9966b 100%)",

        transition: "background .3s ease",
      }}
    >
      {/* میز */}
      <Box
        sx={{
          position: "absolute",
          width: "82%",
          height: "72%",
          left: "9%",
          top: "14%",

          borderRadius: "50%",

          background: isDark
            ? `
              radial-gradient(
                ellipse at center,
                #7a3f1d 0%,
                #4a2413 45%,
                #29130b 75%,
                #160a06 100%
              )
            `
            : `
              radial-gradient(
                ellipse at center,
                #c98a4c 0%,
                #a86632 45%,
                #7c421f 75%,
                #562b15 100%
              )
            `,

          border: isDark
            ? "12px solid #241108"
            : "12px solid #6f391c",

          boxShadow: isDark
            ? `
              inset 0 0 0 3px rgba(255,200,120,.15),
              inset 0 0 50px rgba(0,0,0,.7),
              0 20px 50px rgba(0,0,0,.7)
            `
            : `
              inset 0 0 0 3px rgba(255,220,170,.3),
              inset 0 0 50px rgba(80,30,0,.25),
              0 20px 50px rgba(60,30,0,.35)
            `,

          transition: "all .3s ease",
        }}
      >
        {/* طرح وسط میز */}
        <Box
          sx={{
            position: "absolute",
            width: "38%",
            height: "42%",
            left: "31%",
            top: "29%",
            borderRadius: "50%",
            border: "2px solid rgba(255,210,140,.18)",
            boxShadow: `
              inset 0 0 25px rgba(0,0,0,.3),
              0 0 0 12px rgba(255,210,140,.04)
            `,
          }}
        />

        {/* دسته کارت وسط */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 82,
            borderRadius: 2,
            background: isDark ? "#171d35" : "#27364f",
            border: "2px solid #c99a4a",
            boxShadow: "0 5px 12px rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              color: "#d5a94c",
            }}
          >
            ♛
          </Typography>
        </Box>
      </Box>

      {/* بازیکن‌ها */}
      {orderedPlayers.map((player, index) => {
        const position = positions[index];

        if (!position) return null;

        return (
          <Box
            key={player.id}
            sx={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <PlayerSeat
              player={player}
              isMe={player.id === myUserId}
              isCurrentTurn={player.id === currentTurnPlayerId}
            />
          </Box>
        );
      })}
    </Box>
  );
}