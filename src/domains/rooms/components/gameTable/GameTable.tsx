import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PlayerSeat, {
  GameTablePlayer,
} from "./PlayerSeat";

interface GameTableProps {
  players: GameTablePlayer[];
  myUserId: string;
  currentTurnPlayerId: string;
}

export default function GameTable({
  players,
  myUserId,
  currentTurnPlayerId,
}: GameTableProps) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  /*
   * بازیکن خودمان همیشه index صفر است
   * و در پایین میز قرار می‌گیرد.
   */
  const orderedPlayers = [
    ...players.filter((p) => p.id === myUserId),
    ...players.filter((p) => p.id !== myUserId),
  ];

  const playerCount = orderedPlayers.length;

  /*
   * بازیکن‌ها روی محیط دایره قرار می‌گیرند.
   *
   * زاویه شروع:
   * -90deg یعنی اولین بازیکن در بالا قرار می‌گیرد.
   *
   * ولی چون بازیکن خودمان باید پایین باشد،
   * برای index صفر زاویه 90 درجه می‌گذاریم.
   */
  const getSeatPosition = (index: number) => {
    if (playerCount === 0) {
      return {
        top: 50,
        left: 50,
      };
    }

    /*
     * خودمان همیشه پایین
     */
    if (index === 0) {
      return {
        top: 94,
        left: 50,
      };
    }

    /*
     * بقیه بازیکن‌ها
     *
     * 90deg = پایین
     *
     * بازیکن‌های بعدی از سمت چپ و راست پخش می‌شوند.
     */
    const otherPlayers = playerCount - 1;

    const angleStep = 360 / otherPlayers;

    /*
     * شروع از 270 درجه (بالا)
     */
    const angle =
      -90 + (index - 1) * angleStep;

    /*
     * شعاع قرارگیری بازیکن‌ها
     */
    const radius = 45;

    const radians =
      (angle * Math.PI) / 180;

    return {
      top:
        50 +
        radius * Math.sin(radians),

      left:
        50 +
        radius * Math.cos(radians),
    };
  };

  return (
    <Box
      sx={{
        position: "relative",

        width: "100%",

        /*
         * میز کاملاً مربعی است
         * تا دایره واقعاً دایره باشد.
         */
        aspectRatio: "1 / 1",

        maxWidth: 720,

        mx: "auto",

        overflow: "visible",

        borderRadius: 4,

        background: isDark
          ? `
            radial-gradient(
              circle at center,
              #17100b 0%,
              #0b0704 65%,
              #050302 100%
            )
          `
          : `
            radial-gradient(
              circle at center,
              #ead5b6 0%,
              #c7a47a 65%,
              #9e7950 100%
            )
          `,

        transition:
          "background .35s ease",
      }}
    >
      {/* ========================= */}
      {/* میز چوبی */}
      {/* ========================= */}

      <Box
        sx={{
          position: "absolute",

          width: "76%",
          aspectRatio: "1 / 1",

          left: "12%",
          top: "12%",

          borderRadius: "50%",

          background: isDark
            ? `
              radial-gradient(
                circle,
                #7a3f1d 0%,
                #552813 40%,
                #35170c 70%,
                #1b0b05 100%
              )
            `
            : `
              radial-gradient(
                circle,
                #c98a4c 0%,
                #ad6935 40%,
                #86451f 70%,
                #5d2e16 100%
              )
            `,

          border: isDark
            ? "12px solid #241108"
            : "12px solid #6f391c",

          boxShadow: isDark
            ? `
              inset 0 0 0 3px rgba(255,200,120,.12),
              inset 0 0 55px rgba(0,0,0,.75),
              0 25px 55px rgba(0,0,0,.75)
            `
            : `
              inset 0 0 0 3px rgba(255,220,170,.28),
              inset 0 0 55px rgba(80,30,0,.25),
              0 25px 55px rgba(60,30,0,.35)
            `,

          transition:
            "background .35s ease, border .35s ease, box-shadow .35s ease",
        }}
      >
        {/* حلقه تزئینی وسط میز */}

        <Box
          sx={{
            position: "absolute",

            width: "42%",
            aspectRatio: "1 / 1",

            left: "29%",
            top: "29%",

            borderRadius: "50%",

            border:
              "2px solid rgba(255,210,140,.18)",

            boxShadow: `
              inset 0 0 30px rgba(0,0,0,.35),
              0 0 0 10px rgba(255,210,140,.035)
            `,
          }}
        />

        {/* حلقه دوم */}

        <Box
          sx={{
            position: "absolute",

            width: "30%",
            aspectRatio: "1 / 1",

            left: "35%",
            top: "35%",

            borderRadius: "50%",

            border:
              "1px solid rgba(255,210,140,.12)",
          }}
        />

        {/* Deck وسط میز */}

        <Box
          sx={{
            position: "absolute",

            left: "50%",
            top: "50%",

            transform:
              "translate(-50%, -50%)",

            width: {
              xs: 48,
              sm: 58,
            },

            height: {
              xs: 66,
              sm: 80,
            },

            borderRadius: 1.5,

            background: isDark
              ? "#151a2d"
              : "#29374e",

            border:
              "2px solid #c99a4a",

            boxShadow:
              "0 6px 15px rgba(0,0,0,.55)",

            display: "flex",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 22,
                sm: 30,
              },

              color: "#d5a94c",

              textShadow:
                "0 2px 4px rgba(0,0,0,.5)",
            }}
          >
            ♛
          </Typography>
        </Box>
      </Box>

      {/* ========================= */}
      {/* Players */}
      {/* ========================= */}

      {orderedPlayers.map((player, index) => {
        const position =
          getSeatPosition(index);

        const isCurrentTurn =
          player.id ===
          currentTurnPlayerId;

        const isMe =
          player.id === myUserId;

        return (
          <Box
            key={player.id}
            sx={{
              position: "absolute",

              top: `${position.top}%`,
              left: `${position.left}%`,

              transform:
                "translate(-50%, -50%)",

              zIndex: isCurrentTurn
                ? 30
                : 10,

              transition:
                "top .35s ease, left .35s ease",
            }}
          >
            <PlayerSeat
              player={player}
              isMe={isMe}
              isCurrentTurn={isCurrentTurn}
            />
          </Box>
        );
      })}
    </Box>
  );
}