import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Container, Typography, Chip, TextField, Button, Paper,
  Stack, List, ListItem, ListItemText, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Select,
} from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useRoomSocket } from "hooks/useRoomSocket";
import { CheckCircle } from "@mui/icons-material";


const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

const ACTIONS_NEEDING_TARGET = ["coup", "assassinate", "steal", "contessa_other"];

const ACTION_LABELS: Record<string, string> = {
  income: "درآمد", foreign_aid: "کمک خارجی", coup: "کودتا",
  tax: "مالیات (بزرگ‌زاده)", assassinate: "ترور (قاتل)", steal: "دزدی (فرمانده)",
  exchange: "تعویض (سفیر)", contessa_self: "تعویض کارت خودم (بازرس)",
  contessa_other: "اجبار به تعویض (بازرس)",
};

export default function Room() {
  const Auth = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    connected, loaded, gameState, privateState,
    startGame, sendChat, sendAction, respond, blockAction, respondToBlock, revealCard, restartGame, leaveRoom, closeRoom,
  } = useRoomSocket(roomId);

  // وقتی روم بسته می‌شه، خودکار برگرد به لابی
useEffect(() => {
  if (gameState?.phase === "room_closed") {
    if (Auth?.setUserInfo) Auth.setUserInfo({ ...Auth.userInfo, active_room_id: null });
    navigate("/lobby");
  }
}, [gameState?.phase]);
  const [input, setInput] = useState("");
  const [targetDialogAction, setTargetDialogAction] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState("");

  if (!connected || !loaded || !gameState) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const myUserId = String(Auth?.userInfo?.id);
  const isMyTurn = gameState.turnOrder[gameState.currentTurnIndex] === myUserId;
  const pending = gameState.pendingAction;
  const revealPending = gameState.revealPending;

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input);
    setInput("");
  };

  const handleActionClick = (action: string) => {
    if (ACTIONS_NEEDING_TARGET.includes(action)) {
      setTargetDialogAction(action);
      setSelectedTarget("");
    } else {
      sendAction(action);
    }
  };

  const confirmTargetAction = () => {
    if (targetDialogAction && selectedTarget) {
      sendAction(targetDialogAction, selectedTarget);
      setTargetDialogAction(null);
    }
  };

  const otherAlivePlayers = gameState.players.filter((p) => p.id !== myUserId && p.isAlive);

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">روم: {roomId}</Typography>
        <Chip size="small" color="success" label="متصل" />
      </Stack>

      {gameState.phase === "game_over" && (
        <Paper sx={{ p: 2, mb: 2, textAlign: "center" }}>
          {/* موقت برای دیباگ */}
          <Typography variant="caption" display="block" >
            myUserId={myUserId} 
          </Typography>
          <Typography variant="caption" display="block" >
            creatorId={gameState.creatorId} 
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🏆 {gameState.players.find((p) => p.id === gameState.winnerId)?.name} برنده شد!
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
            {gameState.creatorId === myUserId && (
              <>
                <Button variant="contained" onClick={restartGame}>شروع مجدد</Button>
                <Button variant="outlined" color="error" onClick={closeRoom}>بستن کامل روم</Button>
              </>
            )}
            <Button variant="outlined" onClick={() => { leaveRoom(); navigate("/lobby"); }}>
              خروج از روم
            </Button>
          </Stack>
        </Paper>
      )}

      {gameState.phase === "waiting_for_players" && gameState.creatorId === myUserId && (
        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={startGame}>
          شروع بازی ({gameState.players.length} بازیکن)
        </Button>
      )}

      {gameState.phase !== "waiting_for_players" && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>کارت‌های شما</Typography>
          <Stack direction="row" spacing={1}>
            {privateState?.yourRoles.map((role, i) => (
              <Chip
                key={i}
                label={ROLE_LABELS_FA[role] || role}
                color={privateState.yourRevealed[i] ? "default" : "primary"}
                variant={privateState.yourRevealed[i] ? "outlined" : "filled"}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ mb: 2 }}>
        <List dense>
          {gameState.players.map((p) => (
            <ListItem key={p.id} sx={{ opacity: p.isAlive ? 1 : 0.5 }}>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <span>{p.name} {p.id === myUserId ? "(شما)" : ""} {!p.isAlive ? "☠️" : ""}</span>
                    {p.connected && <CheckCircle sx={{ fontSize: 14, color: "success.main" }} />}
                  </Stack>
                }
                secondary={`سکه: ${p.coins} · کارت باز: ${p.roleCount}`}
              />
              {gameState.turnOrder[gameState.currentTurnIndex] === p.id && p.isAlive && (
                <Chip size="small" color="secondary" label="نوبت" />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* دکمه‌های اکشن — فقط وقتی نوبت خودمه و منتظر اکشن جدید هستیم */}
      {gameState.phase === "awaiting_action" && isMyTurn && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {Object.keys(ACTION_LABELS).map((action) => (
            <Button key={action} size="small" variant="outlined" onClick={() => handleActionClick(action)}>
              {ACTION_LABELS[action]}
            </Button>
          ))}
        </Stack>
      )}

      {/* اکشن یکی دیگه در انتظار پاسخ بقیه‌ست */}
      {gameState.phase === "awaiting_response" && pending && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            {gameState.players.find((p) => p.id === pending.actorId)?.name} ادعای{" "}
            {ACTION_LABELS[pending.action] || pending.action} کرد
            {pending.targetId && ` علیه ${gameState.players.find((p) => p.id === pending.targetId)?.name}`}
          </Typography>
          {pending.actorId !== myUserId && pending.awaitingResponseFrom.includes(myUserId) && !pending.responses[myUserId] && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => respond("allow")}>قبول</Button>
              {pending.claimedRole && (
                <Button size="small" color="warning" onClick={() => respond("challenge")}>چالش (بلوفه!)</Button>
              )}
              {["foreign_aid", "assassinate", "steal"].includes(pending.action) &&
                (pending.action !== "assassinate" && pending.action !== "steal" || pending.targetId === myUserId) && (
                <Button size="small" color="secondary" onClick={blockAction}>بلاک می‌کنم</Button>
              )}
            </Stack>
          )}
        </Paper>
      )}

      {/* یکی block کرده، منتظر پاسخ بقیه به همون بلاک */}
      {gameState.phase === "awaiting_block_response" && pending?.blockedBy && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            {gameState.players.find((p) => p.id === pending.blockedBy!.playerId)?.name} با ادعای{" "}
            {ROLE_LABELS_FA[pending.blockedBy.claimedRole]} بلاک کرد
          </Typography>
          {pending.blockedBy.playerId !== myUserId && !pending.blockChallengeResponses?.[myUserId] && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => respondToBlock("allow")}>قبول</Button>
              <Button size="small" color="warning" onClick={() => respondToBlock("challenge")}>چالش (بلوفه!)</Button>
            </Stack>
          )}
        </Paper>
      )}

      {/* دیالوگ انتخاب هدف برای اکشن‌هایی که نیاز به هدف دارن */}
      <Dialog open={!!targetDialogAction} onClose={() => setTargetDialogAction(null)}>
        <DialogTitle>انتخاب هدف</DialogTitle>
        <DialogContent>
          <Select fullWidth value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
            {otherAlivePlayers.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDialogAction(null)}>انصراف</Button>
          <Button variant="contained" onClick={confirmTargetAction} disabled={!selectedTarget}>تایید</Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ کور کردن کارت — وقتی نوبت خود شخصه که یه کارت رو ببازه */}
      <Dialog open={revealPending?.playerId === myUserId} disableEscapeKeyDown>
        <DialogTitle>باید یه کارت رو کور کنید</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {privateState?.yourRoles.map((role, i) =>
              !privateState.yourRevealed[i] ? (
                <Button key={i} variant="outlined" onClick={() => revealCard(i)}>
                  {ROLE_LABELS_FA[role]}
                </Button>
              ) : null
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="یه پیام بنویس" onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>ارسال</Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflowY: "auto" }}>
        {gameState.log.map((line, i) => (
          <Typography key={i} variant="body2" sx={{ p: 0.5 }}>{line}</Typography>
        ))}
      </Paper>
    </Container>
  );
}