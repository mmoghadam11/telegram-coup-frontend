import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
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
  photo_url?: string | null;
}

interface PlayerSeatProps {
  player: GameTablePlayer;
  isMe: boolean;
  isCurrentTurn: boolean;
}

const AVATAR_SIZE = { xs: 30, sm: 36 };

export default function PlayerSeat({ player, isMe, isCurrentTurn }: PlayerSeatProps) {
  const avatarLetter = player.name?.charAt(0) || "?";

  return (
    <Stack
      alignItems="center"
      spacing={0.4}
      sx={{
        width: { xs: 108, sm: 128 },
        userSelect: "none",
        opacity: player.isAlive ? 1 : 0.45,
      }}
    >
      {/* ردیف ۱: آواتار + اسم، کنار هم و هم‌سطح */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.7}
        sx={{
          px: 0.8,
          py: 0.3,
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,.72)",
          border: "1px solid",
          borderColor: isCurrentTurn
            ? "rgba(255,193,7,.8)"
            : isMe
            ? "rgba(255,193,7,.55)"
            : "rgba(255,255,255,.12)",
          boxShadow: isCurrentTurn ? "0 0 10px rgba(255,193,7,.25)" : "none",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ position: "relative", lineHeight: 0, flexShrink: 0 }}>
          <motion.div
            animate={isCurrentTurn ? { scale: [1, 1.045, 1] } : { scale: 1 }}
            transition={
              isCurrentTurn
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
            style={{ borderRadius: "50%", display: "inline-block" }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                p: "2px",
                background: isCurrentTurn
                  ? "linear-gradient(135deg, #fff6b0, #e0a52f, #fff6b0)"
                  : isMe
                  ? "linear-gradient(135deg, #ffe9a3, #b98524)"
                  : "rgba(255,255,255,.22)",
                display: "inline-flex",
              }}
            >
              <Avatar
                src={player.photo_url || undefined}
                alt={player.name}
                imgProps={{ referrerPolicy: "no-referrer" }}
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  fontSize: { xs: 15, sm: 18 },
                  fontWeight: 500,
                }}
              >
                {avatarLetter}
              </Avatar>
            </Box>
          </motion.div>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: player.connected ? "#31d158" : "#777",
              border: "2px solid",
              borderColor: "background.paper",
              zIndex: 3,
            }}
          />

          {!player.isAlive && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: 14, sm: 17 },
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,.8))",
              }}
            >
              ☠️
            </Box>
          )}
        </Box>

        <Typography
          noWrap
          sx={{
            fontSize: { xs: 9, sm: 11 },
            fontWeight: isMe || isCurrentTurn ? 800 : 500,
            color: isMe ? "warning.light" : "#fff",
            minWidth: 0,
            flex: 1,
          }}
        >
          {player.name}
          {isMe ? " (شما)" : ""}
        </Typography>
      </Stack>

      {/* ردیف ۲: سکه + کارت‌های رو‌شده، کنار هم */}
      {(player.coins > 0 || player.revealedRoles.length > 0) && (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {player.coins > 0 && <CoinStack count={player.coins} />}
          {player.revealedRoles.length > 0 && (
            <Stack direction="row">
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
                      width: { xs: 20, sm: 26 },
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid rgba(255,255,255,.5)",
                      boxShadow: "0 2px 5px rgba(0,0,0,.5)",
                      ml: index === 0 ? 0 : -0.8,
                      zIndex: index,
                    }}
                  />
                );
              })}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}