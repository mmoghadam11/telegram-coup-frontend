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

const AVATAR_SIZE = { xs: 28, sm: 34 };

function AvatarBubble({
  player,
  isMe,
  isCurrentTurn,
}: {
  player: GameTablePlayer;
  isMe: boolean;
  isCurrentTurn: boolean;
}) {
  const avatarLetter = player.name?.charAt(0) || "?";
  return (
    <Box sx={{ position: "relative", lineHeight: 0, flexShrink: 0, zIndex: 2 }}>
      <motion.div
        animate={isCurrentTurn ? { scale: [1, 1.045, 1] } : { scale: 1 }}
        transition={
          isCurrentTurn ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }
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
              border: "2px solid",
              borderColor: "background.paper",
              fontSize: { xs: 14, sm: 17 },
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
            fontSize: { xs: 13, sm: 16 },
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,.8))",
          }}
        >
          ☠️
        </Box>
      )}
    </Box>
  );
}

function CoinsAndCards({ player }: { player: GameTablePlayer }) {
  if (player.coins <= 0 && player.revealedRoles.length === 0) return null;
  return (
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
                  width: { xs: 24, sm: 30 },
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
  );
}

function NameBadge({ player, isMe, isCurrentTurn }: { player: GameTablePlayer; isMe: boolean; isCurrentTurn: boolean }) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.25,
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
      <Typography
        noWrap
        sx={{
          fontSize: { xs: 9, sm: 11 },
          fontWeight: isMe || isCurrentTurn ? 800 : 500,
          color: isMe ? "warning.light" : "#fff",
        }}
      >
        {player.name}
        {isMe ? " (شما)" : ""}
      </Typography>
    </Box>
  );
}

export default function PlayerSeat({ player, isMe, isCurrentTurn }: PlayerSeatProps) {
  const opacity = player.isAlive ? 1 : 0.45;

  if (isMe) {
    // چیدمان مخصوص خودمون: سکه/کارت بالا، بعد آواتار که از بالا روی اسم می‌افته
    return (
      <Stack alignItems="center" sx={{ width: { xs: 100, sm: 118 }, userSelect: "none", opacity }}>
        <Box sx={{ mb: 0.5 }}>
          <CoinsAndCards player={player} />
        </Box>
        <AvatarBubble player={player} isMe={isMe} isCurrentTurn={isCurrentTurn} />
        <Box sx={{ mt: -0.4 }}>
          <NameBadge player={player} isMe={isMe} isCurrentTurn={isCurrentTurn} />
        </Box>
      </Stack>
    );
  }

  // چیدمان بقیه: آواتار+اسم کنار هم در یک ردیف، سکه/کارت زیرش
  return (
    <Stack alignItems="center" spacing={0.4} sx={{ width: { xs: 100, sm: 118 }, userSelect: "none", opacity }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.6}
        sx={{
          px: 0.7,
          py: 0.25,
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,.72)",
          border: "1px solid",
          borderColor: isCurrentTurn
            ? "rgba(255,193,7,.8)"
            : "rgba(255,255,255,.12)",
          boxShadow: isCurrentTurn ? "0 0 10px rgba(255,193,7,.25)" : "none",
          maxWidth: "100%",
        }}
      >
        <AvatarBubble player={player} isMe={isMe} isCurrentTurn={isCurrentTurn} />
        <Typography
          noWrap
          sx={{
            fontSize: { xs: 9, sm: 11 },
            fontWeight: isCurrentTurn ? 800 : 500,
            color: "#fff",
            minWidth: 0,
            flex: 1,
          }}
        >
          {player.name}
        </Typography>
      </Stack>
      <CoinsAndCards player={player} />
    </Stack>
  );
}