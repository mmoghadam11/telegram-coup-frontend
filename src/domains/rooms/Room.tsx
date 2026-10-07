import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Container, Typography, Chip, TextField, Button, Paper,
  Stack, List, ListItem, ListItemText, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Select,
  IconButton,
  ListItemButton,
  Grid,
} from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useRoomSocket } from "hooks/useRoomSocket";
import { BugReport, CheckCircle, RestartAlt } from "@mui/icons-material";
import ExchangeDialog from "./components/ExchangeDialog";
import ContessaDialog from "./components/ContessaDialog";
import DebugPanel from "./components/DebugPanel";
import GameOverDialog from "./components/GameOverDialog";
import RestartVoteDialog from "./components/RestartVoteDialog";
import BlockClaimDialog from "./components/proving/BlockClaimDialog";
import ProveCardDialog from "./components/proving/ProveCardDialog";
import ProveResultDialog from "./components/proving/ProveResultDialog";
import { useCardPreload } from "hooks/useCardPreload";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import AnarchistDialog from "./components/AnarchistDialog";
import { useSnackbar } from "hooks/useSnackbar";
import ActionCarousel from "components/cards/ActionCarousel";
import { ACTION_CARD_DATA } from "shared/constants/actionCards";
import GameTable from "./components/gameTable/GameTable";
import ActionButton from "./components/ActionButton";
import MatchmakingLobbyView from "./components/MatchmakingLobbyView";
import HandResultOverlay from "./components/HandResultOverlay";
import { MAX_PLAYERS_PER_ROOM, MIN_PLAYERS_TO_START } from "./constants/matchmaking";
import AwaitingResponses from "./components/AwaitingResponses";
import CoupCardItem from "./components/CoupCardItem";
import EliminationAnnouncement from "./components/EliminationAnnouncement";
import RevealResultDialog from "./components/RevealResultDialog";


const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

const ACTIONS_NEEDING_TARGET = ["coup", "assassinate", "steal", "contessa_other", "anarchist_attack"];

const ACTION_LABELS: Record<string, string> = {
  income: "درآمد", foreign_aid: "کمک خارجی", coup: "کودتا",
  tax: "مالیات (بزرگ‌زاده)", assassinate: "ترور (قاتل)", steal: "دزدی (فرمانده)",
  exchange: "تعویض (سفیر)", contessa_self: "تعویض کارت خودم (بازرس)",
  contessa_other: "اجبار به تعویض (بازرس)",
  anarchist_attack: "حمله‌ی آنارشیست", // این خط اضافه شد
};

export default function Room() {
  const { playRevealSound, startAnarchistLoop, stopAnarchistLoop } = useCardPreload();
  const Auth = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const lastLogLineRef = useRef<string | null>(null);
  const [showFullLog, setShowFullLog] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const {
    connected, loaded, gameState, privateState, mmLeave, fold,
    sendProveCard, proofEvent, clearProofEvent, anarchistRespond, anarchistBlockRespond, anarchistPass, anarchistNeutralize, revealResultEvent, clearRevealResultEvent,
    startGame, sendChat, sendAction, respond, blockAction, respondToBlock, revealCard, restartGame, leaveRoom, closeRoom, forceReset, sendContessaSelect, sendExchangeSelect, respondToRestartVote,
  } = useRoomSocket(roomId);

  useEffect(() => {
    if (gameState?.phase !== "game_over") {
      setShowGameOverDialog(false);
      return;
    }

    // اگه همین الان یه revealResultEvent باز هست، صبر کن تا بسته بشه
    if (revealResultEvent) return;

    setShowGameOverDialog(true);
  }, [gameState?.phase, revealResultEvent]);

  useEffect(() => {
    if (gameState?.phase === "anarchist_in_progress") {
      startAnarchistLoop();
    } else {
      stopAnarchistLoop();
    }
  }, [gameState?.phase]);

  useEffect(() => {
    if (!proofEvent) return;

    playRevealSound();
  }, [proofEvent, playRevealSound]);
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
  const [debugMode, setDebugMode] = useState(false);
  const [closeWaitingConfirmOpen, setCloseWaitingConfirmOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const BLOCKING_ROLES_FA: Record<string, string[]> = {
    foreign_aid: ["duke"],
    assassinate: ["princess"],
    steal: ["captain", "ambassador"],
  };

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
  // if (gameState.origin === "matchmaking" && gameState.roomPhase === "playing" && gameState.phase === "game_over" && gameState.handResultEndsAt) {
  //   return (
  //     <HandResultOverlay
  //       winnerName={gameState.players.find((p) => p.id === gameState.winnerId)?.name}
  //       handResultEndsAt={gameState.handResultEndsAt}
  //     />
  //   );
  // }
  // این بلوک جدید اضافه شد: برای روم‌های matchmaking، قبل از playing، صفحه‌ی لابی/شمارش معکوس رو نشون بده
  if (gameState.origin === "matchmaking" && (gameState.roomPhase === "waiting" || gameState.roomPhase === "starting")) {
    return (
      <MatchmakingLobbyView
        roomPhase={gameState.roomPhase}
        players={gameState.players}
        myUserId={myUserId}
        countdownEndsAt={gameState.countdownEndsAt}
        minPlayers={MIN_PLAYERS_TO_START}
        maxPlayers={MAX_PLAYERS_PER_ROOM}
        onLeave={() => {
          mmLeave();
          Auth?.setUserInfo({ ...Auth.userInfo, active_room_id: null });
          navigate("/");
        }}
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">روم: {gameState.roomName || roomId}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {gameState.creatorId === myUserId && gameState.phase !== "room_closed" && (
            <IconButton size="small" color="warning" onClick={() => setResetConfirmOpen(true)}>
              <RestartAlt />
            </IconButton>
          )}
          {
            Auth.userInfo?.role === "admin" &&
            <IconButton size="small" onClick={() => setDebugMode((d) => !d)}>
              <BugReport fontSize="small" />
            </IconButton>
          }
          <Chip size="small" color="success" label="متصل" />
        </Stack>
      </Stack>
      <Dialog open={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)}>
        <DialogTitle>ریست کردن بازی</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            این کار بازی فعلی رو کامل متوقف می‌کنه و از اول (با همین بازیکن‌ها) شروع می‌کنه.
            برای مواقعی که بازی گیر کرده یا نوبت کسی مشخص نیست استفاده کنید. مطمئنید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetConfirmOpen(false)}>انصراف</Button>
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              forceReset();
              setResetConfirmOpen(false);
            }}
          >
            بله، ریست کن
          </Button>
        </DialogActions>
      </Dialog>

      {gameState.phase === "game_over" && gameState.creatorId === myUserId && (
        <Button variant="contained" onClick={() => setRestartDialogOpen(true)}>
          شروع مجدد
        </Button>
      )}

      <Dialog open={restartDialogOpen} onClose={() => setRestartDialogOpen(false)}>
        <DialogTitle>شروع مجدد بازی</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            بازی جدید با همین بازیکن‌ها شروع می‌شه. روم برای بازیکن‌های جدید باز بمونه یا بسته؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestartDialogOpen(false)}>انصراف</Button>
          <Button
            onClick={() => {
              restartGame(false);
              setRestartDialogOpen(false);
            }}
          >
            همین بازیکن‌ها (بسته)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              restartGame(true);
              setRestartDialogOpen(false);
            }}
          >
            باز برای ورود
          </Button>
        </DialogActions>
      </Dialog>
      <DebugPanel
        debugMode={debugMode}
        data={{
          phase: gameState.phase,
          currentTurnIndex: gameState.currentTurnIndex,
          turnOrder: gameState.turnOrder,
          pendingAction: gameState.pendingAction,
          revealPending: gameState.revealPending,
          selectionPending: gameState.selectionPending,
          myUserId,
          privateState,
        }}
      />

      {gameState.phase === "waiting_for_players" && gameState.creatorId === myUserId && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button variant="contained" fullWidth onClick={startGame}>
            شروع بازی ({gameState.players.length} بازیکن)
          </Button>
          <Button variant="outlined" color="error" onClick={() => setCloseWaitingConfirmOpen(true)}>
            بستن روم
          </Button>
        </Stack>

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

      {/* <Paper variant="outlined" sx={{ mb: 2 }}>
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
                secondary={
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                    <span>سکه: {p.coins} · کارت باقی: {p.roleCount}</span>
                    {p.revealedRoles.map((role, i) => (
                      <Chip key={i} size="small" variant="outlined" label={ROLE_LABELS_FA[role]} sx={{ height: 18 }} />
                    ))}
                  </Stack>
                }
              />
              {gameState.turnOrder[gameState.currentTurnIndex] === p.id && p.isAlive && (
                <Chip size="small" color="secondary" label="نوبت" />
              )}
            </ListItem>
          ))}
        </List>
      </Paper> */}
      {gameState.phase !== "waiting_for_players" && (
        <GameTable
          players={gameState.players.map((p) => ({ ...p, photo_url: p.photoUrl }))}
          myUserId={myUserId}
          currentTurnPlayerId={
            gameState.turnOrder[
            gameState.currentTurnIndex
            ]
          }
        />
      )}

      {gameState.origin === "matchmaking" && gameState.phase === "awaiting_action" && (
        <Button size="small" color="warning" variant="outlined" onClick={fold} sx={{ mb: 1 }}>
          فولد (این دست رو بازی نکنم)
        </Button>
      )}

      {/* دکمه‌های اکشن — فقط وقتی نوبت خودمه و منتظر اکشن جدید هستیم */}
      {/* {gameState.phase === "awaiting_action" && isMyTurn && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {Object.keys(ACTION_LABELS).map((action) => (
            <Button key={action} size="small" variant="outlined" onClick={() => handleActionClick(action)}>
              {ACTION_LABELS[action]}
            </Button>
          ))}
        </Stack>
      )} */}
      {gameState.phase === "awaiting_action" && isMyTurn && !gameState.revealPending && (
        <Grid container spacing={1}>
          {/* ActionCarousel */}
          {(gameState.players.find((p) => p.id === myUserId)?.coins ?? 0) < 10 &&
            <Grid item xs={7}>
              <ActionCarousel
                actions={Object.keys(ACTION_CARD_DATA)
                  .filter((action) => {
                    if (["income", "foreign_aid", "coup", "coup1"].includes(action)) {
                      return false;
                    }
                    const myCoins = gameState.players.find((p) => p.id === myUserId)?.coins ?? 0;
                    return myCoins >= ACTION_CARD_DATA[action].cost;
                  })
                  .map((action) => ({
                    action,
                    ...ACTION_CARD_DATA[action],
                  }))}
                onSelect={handleActionClick}
              />
            </Grid>}
          {(gameState.players.find((p) => p.id === myUserId)?.coins ?? 0) < 10 &&
            <Grid item xs={5} display={"flex"}>
              {/* Income + Foreign Aid */}
              <Stack
                direction="column"
                spacing={1}
                sx={{ height: "100%" }}>
                <ActionButton
                  action="income"
                  onClick={handleActionClick}
                />

                <ActionButton
                  action="foreign_aid"
                  onClick={handleActionClick}
                />
              </Stack>
            </Grid>
          }
          {/* Coup */}
          {(gameState.players.find((p) => p.id === myUserId)?.coins ?? 0) >= ACTION_CARD_DATA.coup1.cost && (
            <Grid item xs={12}>
              {/* <ActionButton
                action="coup1"
                onClick={handleActionClick}
                sx={{
                  width: { xs: 70, sm: 85 },
                }}
              /> */}
              <CoupCardItem
                onClick={() => handleActionClick("coup")}
              />
            </Grid>
          )}
        </Grid>
      )}

      {/* اکشن یکی دیگه در انتظار پاسخ بقیه‌ست */}
      {gameState.phase === "awaiting_response" && pending && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            {gameState.players.find((p) => p.id === pending.actorId)?.name} ادعای{" "}
            {ACTION_LABELS[pending.action] || pending.action} کرد
            {pending.targetId && ` علیه ${gameState.players.find((p) => p.id === pending.targetId)?.name}`}
          </Typography>

          <AwaitingResponses
            players={pending.awaitingResponseFrom
              .map((id) => gameState.players.find((p) => p.id === id))
              .filter(Boolean) as any}
            respondedIds={Object.keys(pending.responses)}
          />

          {pending.actorId !== myUserId && pending.awaitingResponseFrom.includes(myUserId) && !pending.responses[myUserId] && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button size="small" variant="contained" onClick={() => respond("allow")}>قبول</Button>
              {pending.claimedRole && (
                <Button size="small" color="warning" onClick={() => respond("challenge")}>چالش (بلوفه!)</Button>
              )}
              {["foreign_aid", "assassinate", "steal"].includes(pending.action) &&
                (pending.action !== "assassinate" && pending.action !== "steal" || pending.targetId === myUserId) && (
                  <Button size="small" color="secondary" onClick={() => setBlockDialogOpen(true)}>
                    بلاک می‌کنم
                  </Button>
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

          <AwaitingResponses
            players={gameState.players.filter((p) => p.id !== pending.blockedBy!.playerId && p.isAlive)}
            respondedIds={Object.keys(pending.blockChallengeResponses || {})}
          />

          {pending.blockedBy.playerId !== myUserId && !pending.blockChallengeResponses?.[myUserId] && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
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
      {/* <Dialog open={revealPending?.playerId === myUserId} disableEscapeKeyDown>
        <DialogTitle>باید یه کارت خود را فدا کنید</DialogTitle>
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
      </Dialog> */}
      {revealPending && (
        <EliminationAnnouncement
          playerId={revealPending.playerId}
          reason={revealPending.reason}
          actorId={revealPending.actorId}
          myUserId={myUserId}
          playerName={gameState.players.find((p) => p.id === revealPending.playerId)?.name || ""}
          actorName={revealPending.actorId ? gameState.players.find((p) => p.id === revealPending.actorId)?.name : undefined}
          roles={privateState?.yourRoles}
          revealed={privateState?.yourRevealed}
          onSelect={(roleIndex) => revealCard(roleIndex)}
        />
      )}
      <ExchangeDialog
        open={gameState.selectionPending?.mode === "exchange" && gameState.selectionPending.playerId === myUserId}
        pool={privateState?.exchangePool}
        keepCount={privateState?.exchangeKeepCount}
        onConfirm={(keepIndexes) => sendExchangeSelect(keepIndexes)}
      />

      <ContessaDialog
        open={gameState.selectionPending?.mode === "contessa" && gameState.selectionPending.playerId === myUserId}
        roles={privateState?.yourRoles}
        revealed={privateState?.yourRevealed}
        onSelect={(roleIndex) => sendContessaSelect("contessa_self_select", roleIndex)}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="یه پیام بنویس" onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>ارسال</Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">تاریخچه‌ی کامل</Typography>
        <Button size="small" onClick={() => setShowFullLog((s) => !s)}>
          {showFullLog ? "بستن" : "نمایش"}
        </Button>
      </Stack>
      {showFullLog && (
        <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflowY: "auto" }}>
          {gameState.log.map((line, i) => (
            <Typography key={i} variant="body2" sx={{ p: 0.5 }}>{line}</Typography>
          ))}
        </Paper>
      )}
      <BlockClaimDialog
        open={blockDialogOpen}
        options={pending ? BLOCKING_ROLES_FA[pending.action] || [] : []}
        onClose={() => setBlockDialogOpen(false)}
        onSelect={(role) => {
          blockAction(role);
          setBlockDialogOpen(false);
        }}
      />

      <ProveCardDialog
        open={gameState.provePending?.playerId === myUserId}
        roles={privateState?.yourRoles}
        revealed={privateState?.yourRevealed}
        onSelect={(roleIndex) => sendProveCard(roleIndex)}
      />

      <ProveResultDialog event={proofEvent} onClose={clearProofEvent} />
      <RevealResultDialog event={revealResultEvent} onClose={clearRevealResultEvent} />
      <GameOverDialog
        open={showGameOverDialog}
        winnerName={gameState.players.find((p) => p.id === gameState.winnerId)?.name}
        players={gameState.players.map((p) => ({ id: p.id, name: p.name, stats: p.stats }))}
        isCreator={gameState.creatorId === myUserId}
        isMatchmaking={gameState.origin === "matchmaking"}
        countdownEndsAt={gameState.handResultEndsAt ?? null}
        onRestart={(reopenForJoining) => restartGame(reopenForJoining)}
        onCloseRoom={closeRoom}
        onLeaveRoom={() => {
          leaveRoom();
          Auth?.setUserInfo({ ...Auth.userInfo, active_room_id: null });
          navigate("/lobby");
        }}
      />

      <RestartVoteDialog
        open={gameState.phase === "restart_vote"}
        isCreator={gameState.creatorId === myUserId}
        alreadyResponded={!!gameState.restartVote?.responses[myUserId]}
        waitingForNames={
          gameState.restartVote?.waitingFor.map(
            (id) => gameState.players.find((p) => p.id === id)?.name || id
          ) || []
        }
        onStay={() => respondToRestartVote("stay")}
        onLeave={() => {
          respondToRestartVote("leave");
        }}
      />
      <AnarchistDialog
        open={gameState.phase === "anarchist_in_progress"}
        anarchist={gameState.anarchistPending}
        players={gameState.players}
        myUserId={myUserId}
        onAllow={() => anarchistRespond("allow")}
        onBlock={() => anarchistRespond("block")}
        onBlockAllow={() => anarchistBlockRespond("allow")}
        onBlockChallenge={() => anarchistBlockRespond("challenge")}
        onPass={(targetId) => anarchistPass(targetId)}
        onNeutralize={() => anarchistNeutralize()}
      />
      <ConfirmBox
        open={closeWaitingConfirmOpen}
        handleClose={() => setCloseWaitingConfirmOpen(false)}
        title={"بستن روم"}
        message={"این روم بسته می‌شه و دیگه کسی نمی‌تونه واردش بشه. مطمئنید؟"}
        handleSubmit={() => {
          closeRoom();
          setCloseWaitingConfirmOpen(false);
        }} />
    </Container>
  );
}