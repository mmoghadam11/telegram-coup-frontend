import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { motion } from "motion/react";
import CoinStack from "./CoinStack";

const ROLE_IMAGES: Record<string, string> = {
  duke: "/assets/images/cards/minimal/duke.png",
  captain: "/assets/images/cards/minimal/captain.png",
  ambassador: "/assets/images/cards/minimal/ambassador.png",
  princess: "/assets/images/cards/minimal/princess.png",
  assassin: "/assets/images/cards/minimal/assassin.png",
  contessa: "/assets/images/cards/minimal/contessa.png",
};

export interface GameTablePlayer {
  id: string;
  name: string;
  connected: boolean;
  coins: number;
  roleCount: number;
  revealedRoles: string[];
  isAlive: boolean;

  // عکس پروفایل تلگرام
  photo_url?: string | null;
}

interface PlayerSeatProps {
  player: GameTablePlayer;
  isMe: boolean;
  isCurrentTurn: boolean;
}

export default function PlayerSeat({
  player,
  isMe,
  isCurrentTurn,
}: PlayerSeatProps) {
  const avatarLetter = player.name?.charAt(0) || "?";

  return (
    <Box
      sx={{
        width: {
          xs: 88,
          sm: 110,
        },

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        userSelect: "none",

        opacity: player.isAlive ? 1 : 0.45,

        position: "relative",
      }}
    >
      {/* Avatar */}
      <motion.div
        animate={
          isCurrentTurn
            ? {
                scale: [1, 1.045, 1],
              }
            : {
                scale: 1,
              }
        }
        transition={
          isCurrentTurn
            ? {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {
                duration: 0.2,
              }
        }
        style={{
          borderRadius: "50%",
          padding: 4,
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            padding: "3px",

            background: isCurrentTurn
              ? "linear-gradient(135deg, #fff6b0, #e0a52f, #fff6b0)"
              : isMe
                ? "linear-gradient(135deg, #ffe9a3, #b98524)"
                : "rgba(255,255,255,.22)",

            boxShadow: isCurrentTurn
              ? `
                0 0 8px 3px rgba(255,193,7,.7),
                0 0 24px 7px rgba(255,193,7,.35)
              `
              : isMe
                ? "0 0 10px rgba(255,193,7,.35)"
                : "0 4px 12px rgba(0,0,0,.45)",

            transition: "all .3s ease",
          }}
        >
          <Avatar
            src={player.photo_url || undefined}
            alt={player.name}
            imgProps={{
              referrerPolicy: "no-referrer",
            }}
            sx={{
              width: {
                xs: 48,
                sm: 60,
              },
              height: {
                xs: 48,
                sm: 60,
              },

              bgcolor: "background.paper",
              color: "text.primary",

              border: "2px solid",
              borderColor: "background.paper",

              fontSize: {
                xs: 20,
                sm: 25,
              },

              fontWeight: 700,
            }}
          >
            {avatarLetter}
          </Avatar>
        </Box>
      </motion.div>

      {/* وضعیت اتصال */}
      <Box
        sx={{
          position: "absolute",

          top: {
            xs: 40,
            sm: 50,
          },

          right: {
            xs: 13,
            sm: 16,
          },

          width: 11,
          height: 11,

          borderRadius: "50%",

          backgroundColor: player.connected
            ? "#31d158"
            : "#777",

          border: "2px solid",
          borderColor: "background.paper",

          zIndex: 3,
        }}
      />

      {/* Name */}
      <Box
        sx={{
          mt: 0.5,

          px: {
            xs: 1,
            sm: 1.5,
          },

          py: 0.35,

          minWidth: 70,
          maxWidth: 110,

          borderRadius: 10,

          backgroundColor: "rgba(0,0,0,.72)",

          border: "1px solid",

          borderColor: isCurrentTurn
            ? "rgba(255,193,7,.8)"
            : isMe
              ? "rgba(255,193,7,.55)"
              : "rgba(255,255,255,.12)",

          textAlign: "center",

          boxShadow: isCurrentTurn
            ? "0 0 10px rgba(255,193,7,.25)"
            : "none",
        }}
      >
        <Typography
          noWrap
          sx={{
            fontSize: {
              xs: 10,
              sm: 12,
            },

            fontWeight:
              isMe || isCurrentTurn
                ? 800
                : 500,

            color: isMe
              ? "warning.light"
              : "#fff",
          }}
        >
          {player.name}
          {isMe ? " (شما)" : ""}
        </Typography>
      </Box>

      {/* Coins */}
      <Box sx={{ mt: 0.6 }}>
        <CoinStack count={player.coins} />
      </Box>

      {/* Revealed Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",

          mt: 0.7,

          minHeight: {
            xs: 42,
            sm: 50,
          },
        }}
      >
        {player.revealedRoles.map((role, index) => {
          const image = ROLE_IMAGES[role];

          if (!image) return null;

          return (
            <Box
              key={`${player.id}-${role}-${index}`}
              component="img"
              src={image}
              alt={role}
              sx={{
                width: {
                  xs: 28,
                  sm: 36,
                },

                height: {
                  xs: 40,
                  sm: 50,
                },

                objectFit: "cover",

                borderRadius: "4px",

                border:
                  "1px solid rgba(255,255,255,.5)",

                boxShadow:
                  "0 2px 6px rgba(0,0,0,.55)",

                ml: index === 0 ? 0 : -1.3,

                zIndex: index,
              }}
            />
          );
        })}
      </Box>

      {/* Dead player */}
      {!player.isAlive && (
        <Typography
          sx={{
            position: "absolute",

            top: {
              xs: 16,
              sm: 20,
            },

            fontSize: {
              xs: 22,
              sm: 28,
            },

            zIndex: 5,

            filter:
              "drop-shadow(0 2px 3px rgba(0,0,0,.7))",
          }}
        >
          ☠️
        </Typography>
      )}
    </Box>
  );
}