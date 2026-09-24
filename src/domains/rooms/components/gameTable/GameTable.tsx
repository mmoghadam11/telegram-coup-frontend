import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PlayerSeat, { GameTablePlayer } from "./PlayerSeat";

interface GameTableProps {
  players: GameTablePlayer[];
  myUserId: string;
  currentTurnPlayerId: string;
}

const BOTTOM_GAP_DEGREES = 70;
const SEAT_RADIUS_PERCENT = 20;
const MY_SEAT_TOP_PERCENT = 85;
const PLAYER_ARC_DEGREES = 160;

export default function GameTable({ players, myUserId, currentTurnPlayerId }: GameTableProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const myIndex = players.findIndex((p) => p.id === myUserId);

  const orderedPlayers =
    myIndex === -1
      ? players
      : [
        ...players.slice(myIndex),
        ...players.slice(0, myIndex),
      ];
  const otherPlayers = orderedPlayers.length - 1;

  const getSeatPosition = (index: number) => {
    // خودمان همیشه پایین میز
    if (index === 0) {
      return {
        top: MY_SEAT_TOP_PERCENT,
        left: 50,
      };
    }

    if (otherPlayers === 1) {
      return {
        top: 30,
        left: 50,
      };
    }

    /*
     * بازیکنان دیگر روی نیم‌دایره‌ی بالای میز قرار می‌گیرند.
     *
     * 180°  = چپ
     * 270°  = بالا
     * 360°  = راست
     */
    const startAngle = 180;
    const angleStep =
      PLAYER_ARC_DEGREES / (otherPlayers - 1);

    const angle =
      startAngle + (index - 1) * angleStep;

    const radians = (angle * Math.PI) / 180;

    return {
      top:
        50 +
        SEAT_RADIUS_PERCENT * Math.sin(radians),

      left:
        50 +
        SEAT_RADIUS_PERCENT * Math.cos(radians),
    };
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        boxSizing: "border-box",
        // موبایل: باکس بلندتر از عریض (فضای عمودی بیشتر برای بازیکن بالا/پایین)
        // دسکتاپ: نزدیک مربع، چون عرض کافیه
        // aspectRatio: { xs: "3 / 4", sm: "4 / 4.4", md: "1 / 1" },
        aspectRatio: { xs: "4 / 3", sm: "4 / 4.4", md: "1 / 1" },
        overflow: "visible",
        borderRadius: 4,
        background: isDark
          ? `radial-gradient(circle at center, #17100b 0%, #0b0704 65%, #050302 100%)`
          : `radial-gradient(circle at center, #ead5b6 0%, #c7a47a 65%, #9e7950 100%)`,
        transition: "background .35s ease",
      }}
    >
      {/* میز چوبی — همیشه دقیق وسط، مستقل از نسبت باکس بیرونی */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "68%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: isDark
            ? `radial-gradient(circle, #7a3f1d 0%, #552813 40%, #35170c 70%, #1b0b05 100%)`
            : `radial-gradient(circle, #c98a4c 0%, #ad6935 40%, #86451f 70%, #5d2e16 100%)`,
          border: isDark ? "12px solid #241108" : "12px solid #6f391c",
          boxShadow: isDark
            ? `inset 0 0 0 3px rgba(255,200,120,.12), inset 0 0 55px rgba(0,0,0,.75), 0 25px 55px rgba(0,0,0,.75)`
            : `inset 0 0 0 3px rgba(255,220,170,.28), inset 0 0 55px rgba(80,30,0,.25), 0 25px 55px rgba(60,30,0,.35)`,
          transition: "background .35s ease, border .35s ease, box-shadow .35s ease",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "42%",
            aspectRatio: "1 / 1",
            left: "29%",
            top: "29%",
            borderRadius: "50%",
            border: "2px solid rgba(255,210,140,.18)",
            boxShadow: `inset 0 0 30px rgba(0,0,0,.35), 0 0 0 10px rgba(255,210,140,.035)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "30%",
            aspectRatio: "1 / 1",
            left: "35%",
            top: "35%",
            borderRadius: "50%",
            border: "1px solid rgba(255,210,140,.12)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 44, sm: 56 },
            height: { xs: 60, sm: 76 },
            borderRadius: 1.5,
            background: isDark ? "#151a2d" : "#29374e",
            border: "2px solid #c99a4a",
            boxShadow: "0 6px 15px rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: 20, sm: 28 }, color: "#d5a94c", textShadow: "0 2px 4px rgba(0,0,0,.5)" }}>
            ♛
          </Typography>
        </Box>
      </Box>

      {/* بازیکن‌ها */}
      {orderedPlayers.map((player, index) => {
        const position = getSeatPosition(index);
        const isCurrentTurn = player.id === currentTurnPlayerId;
        const isMe = player.id === myUserId;

        return (
          <Box
            key={player.id}
            sx={{
              position: "absolute",
              top: `${position.top}%`,
              left: `${position.left}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isCurrentTurn ? 30 : 10,
              transition: "top .35s ease, left .35s ease",
            }}
          >
            <PlayerSeat player={player} isMe={isMe} isCurrentTurn={isCurrentTurn} />
          </Box>
        );
      })}
    </Box>
  );
}