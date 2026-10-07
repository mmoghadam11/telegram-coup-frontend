import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,
  Stack, Table, TableHead, TableRow, TableCell, TableBody, Chip, Divider,
  Box, LinearProgress, Paper,
} from "@mui/material";
import ConfettiOnOpen from "components/confetti/ConfettiOnOpen";

interface PlayerRow {
  id: string;
  name: string;
  stats: {
    successfulBluffs: number;
    caughtBluffs: number;
    correctChallenges: number;
    wrongChallenges: number;
    successfulSteals: number;
    kills: number;
  };
}

interface Props {
  // ❌ open حذف شد چون دیگه Dialog نیست
  winnerName?: string;
  players: PlayerRow[];
  isCreator: boolean;
  isMatchmaking?: boolean;
  countdownEndsAt?: number | null;
  onRestart: (reopenForJoining: boolean) => void;
  onCloseRoom: () => void;
  onLeaveRoom: () => void;
}

function findTop(players: PlayerRow[], key: keyof PlayerRow["stats"]) {
  const sorted = [...players].sort((a, b) => b.stats[key] - a.stats[key]);
  if (sorted.length === 0 || sorted[0].stats[key] === 0) return null;
  return sorted[0];
}

export default function GameOverPannel({
  winnerName, players, isCreator, onRestart, onCloseRoom, onLeaveRoom, isMatchmaking, countdownEndsAt
}: Props) {
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!isMatchmaking || !countdownEndsAt) {
      setRemaining(0);
      return;
    }
    const update = () => {
      const left = Math.max(0, Math.ceil((countdownEndsAt - Date.now()) / 1000));
      setRemaining(left);
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [isMatchmaking, countdownEndsAt]);

  const topBluffer = findTop(players, "successfulBluffs");
  const topKiller = findTop(players, "kills");
  const topStealer = findTop(players, "successfulSteals");
  const topChallenger = findTop(players, "correctChallenges");

  const totalSeconds = 8;
  const progress = isMatchmaking && remaining > 0
    ? ((totalSeconds - remaining) / totalSeconds) * 100
    : 0;

  return (
    <>
      {/* ✅ Confetti — active همیشه true چون کامپوننت فقط موقع نمایش mount می‌شه */}
      <ConfettiOnOpen active={true} scalar={2.2} />

      {/* ✅ به‌جای Dialog، یه Paper معمولی که توی صفحه رندر می‌شه */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          🏆 پایان بازی
        </Typography>

        <Typography variant="subtitle1" textAlign="center" sx={{ mb: 2 }}>
          برنده: {winnerName || "-"}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center" sx={{ mb: 2 }}>
          {topBluffer && <Chip label={`بلوف‌زن‌ترین: ${topBluffer.name}`} color="secondary" />}
          {topKiller && <Chip label={`قاتل‌ترین: ${topKiller.name}`} color="error" />}
          {topStealer && <Chip label={`دزدترین: ${topStealer.name}`} color="warning" />}
          {topChallenger && <Chip label={`چالش‌گیرترین: ${topChallenger.name}`} color="info" />}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>بازیکن</TableCell>
              <TableCell align="center">بلوف موفق</TableCell>
              <TableCell align="center">بلوف لورفته</TableCell>
              <TableCell align="center">چالش درست</TableCell>
              <TableCell align="center">چالش غلط</TableCell>
              <TableCell align="center">دزدی</TableCell>
              <TableCell align="center">کشتار</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell align="center">{p.stats.successfulBluffs}</TableCell>
                <TableCell align="center">{p.stats.caughtBluffs}</TableCell>
                <TableCell align="center">{p.stats.correctChallenges}</TableCell>
                <TableCell align="center">{p.stats.wrongChallenges}</TableCell>
                <TableCell align="center">{p.stats.successfulSteals}</TableCell>
                <TableCell align="center">{p.stats.kills}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isMatchmaking && countdownEndsAt && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              دست بعدی تا {remaining} ثانیه‌ی دیگه شروع می‌شه...
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {/* ✅ به‌جای DialogActions، یه Stack معمولی */}
        {!isMatchmaking && (
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={1}
            sx={{ mt: 3 }}
          >
            {isCreator && (
              <>
                <Button variant="contained" onClick={() => setRestartConfirmOpen(true)}>
                  شروع مجدد
                </Button>
                <Button variant="outlined" color="error" onClick={onCloseRoom}>
                  بستن کامل روم
                </Button>
              </>
            )}
            {!isCreator && (
              <Button variant="outlined" onClick={onLeaveRoom}>
                خروج از روم
              </Button>
            )}
          </Stack>
        )}
      </Paper>

      {/* ✅ دیالوگ تأیید restart همچنان Dialog می‌مونه */}
      <Dialog open={restartConfirmOpen} onClose={() => setRestartConfirmOpen(false)}>
        <DialogTitle>شروع مجدد بازی</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            روم برای بازیکن‌های جدید باز بمونه یا فقط با همین بازیکن‌ها ادامه بدیم؟ از بقیه هم خواسته می‌شه مشخص کنن می‌مونن یا می‌رن.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestartConfirmOpen(false)}>انصراف</Button>
          <Button
            onClick={() => {
              onRestart(false);
              setRestartConfirmOpen(false);
            }}
          >
            همین بازیکن‌ها (بسته)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onRestart(true);
              setRestartConfirmOpen(false);
            }}
          >
            باز برای ورود
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}