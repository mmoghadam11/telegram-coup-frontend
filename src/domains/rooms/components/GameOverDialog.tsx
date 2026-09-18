import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,
  Stack, Table, TableHead, TableRow, TableCell, TableBody, Chip, Divider,
} from "@mui/material";

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
  open: boolean;
  winnerName?: string;
  players: PlayerRow[];
  isCreator: boolean;
  onRestart: (reopenForJoining: boolean) => void;
  onCloseRoom: () => void;
  onLeaveRoom: () => void;
}

function findTop(players: PlayerRow[], key: keyof PlayerRow["stats"]) {
  const sorted = [...players].sort((a, b) => b.stats[key] - a.stats[key]);
  if (sorted.length === 0 || sorted[0].stats[key] === 0) return null;
  return sorted[0];
}

export default function GameOverDialog({
  open, winnerName, players, isCreator, onRestart, onCloseRoom, onLeaveRoom,
}: Props) {
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);

  const topBluffer = findTop(players, "successfulBluffs");
  const topKiller = findTop(players, "kills");
  const topStealer = findTop(players, "successfulSteals");
  const topChallenger = findTop(players, "correctChallenges");

  return (
    <>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>🏆 پایان بازی</DialogTitle>
        <DialogContent>
          <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
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
        </DialogContent>
        <DialogActions sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, p: 2 }}>
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
        </DialogActions>
      </Dialog>

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