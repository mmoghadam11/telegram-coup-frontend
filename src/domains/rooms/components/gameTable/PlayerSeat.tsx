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

interface Player {
  id: string;
  name: string;
  connected: boolean;
  coins: number;
  roleCount: number;
  revealedRoles: string[];
  isAlive: boolean;
}

interface PlayerSeatProps {
  player: Player;
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
        width: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
        opacity: player.isAlive ? 1 : 0.45,
      }}
    >
      {/* Avatar */}
      <motion.div
        animate={
          isCurrentTurn
            ? {
                scale: [1, 1.06, 1],
              }
            : {
                scale: 1,
              }
        }
        transition={
          isCurrentTurn
            ? {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
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
              ? "linear-gradient(135deg, #fff3a0, #d69b24, #fff3a0)"
              : "rgba(255,255,255,.25)",
            boxShadow: isCurrentTurn
              ? "0 0 8px 3px rgba(255,193,7,.65), 0 0 25px rgba(255,193,7,.35)"
              : "0 3px 10px rgba(0,0,0,.35)",
            transition: "all .3s ease",
          }}
        >
          <Avatar
            sx={{
              width: 62,
              height: 62,
              bgcolor: "background.paper",
              color: "text.primary",
              border: "2px solid",
              borderColor: "background.paper",
              fontSize: 25,
              fontWeight: 700,
            }}
          >
            {avatarLetter}
          </Avatar>
        </Box>
      </motion.div>

      {/* Name */}
      <Box
        sx={{
          mt: 0.5,
          px: 1.5,
          py: 0.35,
          minWidth: 80,
          maxWidth: 115,
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,.65)",
          border: "1px solid",
          borderColor: isMe
            ? "rgba(255,193,7,.7)"
            : "rgba(255,255,255,.12)",
          textAlign: "center",
        }}
      >
        <Typography
          noWrap
          sx={{
            fontSize: 12,
            fontWeight: isMe || isCurrentTurn ? 700 : 500,
            color: isMe ? "warning.light" : "#fff",
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
          minHeight: 50,
        }}
      >
        {player.revealedRoles.map((role, index) => (
          <Box
            key={`${player.id}-${role}-${index}`}
            component="img"
            src={ROLE_IMAGES[role]}
            alt={role}
            sx={{
              width: 34,
              height: 48,
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,.4)",
              boxShadow: "0 2px 5px rgba(0,0,0,.4)",
              ml: index === 0 ? 0 : -1.2,
              zIndex: index,
            }}
          />
        ))}
      </Box>

      {/* Dead */}
      {!player.isAlive && (
        <Typography
          sx={{
            position: "absolute",
            fontSize: 25,
            mt: 1,
          }}
        >
          ☠️
        </Typography>
      )}
    </Box>
  );
}