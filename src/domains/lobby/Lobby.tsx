import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Drawer, IconButton, InputAdornment,
  LinearProgress, Paper, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import { Add, Clear, Group, Lock, Public, Search, VpnKey } from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import BackButton from "components/buttons/BackButton";
import { MAX_PLAYERS_PER_ROOM } from "domains/rooms/constants/matchmaking";

const PAGE = 10;

const STATUS: Record<string, { label: string; color: "success" | "warning" | "info" | "default" }> = {
  waiting: { label: "منتظر بازیکن", color: "success" },
  starting: { label: "در حال شروع", color: "warning" },
  playing: { label: "در حال بازی", color: "info" },
  closed: { label: "بسته", color: "default" },
};
const FILTERS = [
  { value: "all", label: "همه" },
  { value: "waiting", label: "قابل ورود" },
  { value: "playing", label: "در حال بازی" },
];

function useDebounced<T>(value: T, ms = 400): T {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

function RoomCard({ room, onJoin, busy }: { room: any; onJoin: () => void; busy: boolean }) {
  const s = STATUS[room.status] ?? STATUS.closed;
  const count = Number(room.player_count) || 0;
  const full = count >= MAX_PLAYERS_PER_ROOM;
  const joinable = room.status === "waiting" && !full;
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight={700} noWrap>{room.name}</Typography>
              <Chip size="small" color={s.color} label={s.label} />
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              سازنده: {room.creator_name || "—"}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.75 }}>
              <Group sx={{ fontSize: 16, color: "text.secondary" }} />
              <LinearProgress variant="determinate" value={(count / MAX_PLAYERS_PER_ROOM) * 100}
                sx={{ flex: 1, height: 6, borderRadius: 3 }} color={full ? "error" : "primary"} />
              <Typography variant="caption">{count}/{MAX_PLAYERS_PER_ROOM}</Typography>
            </Stack>
          </Box>
          <Button variant="contained" size="small" disabled={!joinable || busy} onClick={onJoin} sx={{ borderRadius: 2, minWidth: 64 }}>
            {full ? "پر" : "ورود"}
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
}

export default function Lobby() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput.trim());
  const [status, setStatus] = useState("all");
  const [code, setCode] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [created, setCreated] = useState<{ roomId: string; joinCode: string } | null>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ["rooms", search],
    queryFn: ({ pageParam = 1 }: any) => {
      const qs = new URLSearchParams({ page: String(pageParam), size: String(PAGE), ...(search && { q: search }) });
      return Auth?.getRequest({ queryKey: `rooms?${qs}` });
    },
    getNextPageParam: (last: any, all: any[]) => (all.length * PAGE < (last?.totalElements ?? 0) ? all.length + 1 : undefined),
    refetchInterval: 5000, // وضعیت و ظرفیت زنده بماند
  } as any);

  // فیلتر وضعیت سمت کلاینت؛ سرور فقط روم‌های غیربسته را می‌دهد
  const rooms: any[] = ((data as any)?.pages ?? []).flatMap((p: any) => p?.rooms ?? []).filter(
    (r: any) => status === "all" || r.status === status
  );

  const enterRoom = (roomId: string) => {
    Auth?.setUserInfo({ ...Auth.userInfo, active_room_id: roomId }); // تا ریدایرکت خودکار AppRoutes با ما هماهنگ باشد
    navigate(`/room/${roomId}`);
  };

  const { mutate: createRoom, isLoading: creating } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => {
      setCreateOpen(false);
      setNewName("");
      if (res.joinCode) setCreated({ roomId: res.roomId, joinCode: res.joinCode }); // اول کد را نشان بده
      else enterRoom(res.roomId);
    },
    onError: (e: any) => snackbar(e?.data?.error || "خطا در ساخت روم", "error"),
  });

  const { mutate: join, isLoading: joining } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => enterRoom(res.roomId),
    onError: (e: any) => { snackbar(e?.data?.error || "خطا در پیوستن به روم", "error"); refetch(); },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>لابی</Typography>
        <BackButton onBack={() => navigate(-1)} />
      </Stack>

      {/* کنسول: ساخت روم و ورود با کد */}
      <Paper sx={{ p: 1.5, mb: 2, borderRadius: 3, background: "linear-gradient(145deg,#3a1d0c,#7a3f1d)", border: "1px solid rgba(245,196,81,.5)" }}>
        <Stack spacing={1.25}>
          <Button fullWidth variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: 2, bgcolor: "#f5c451", color: "#3a1d0c", fontWeight: 800, "&:hover": { bgcolor: "#e0a52f" } }}>
            ساخت روم جدید
          </Button>
          <Stack direction="row" spacing={1}>
            <TextField fullWidth size="small" placeholder="کد روم خصوصی" value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              inputProps={{ maxLength: 6, style: { direction: "ltr", letterSpacing: 4, textAlign: "center", color: "#fff" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><VpnKey sx={{ color: "rgba(255,255,255,.6)" }} /></InputAdornment> }}
              sx={{ "& fieldset": { borderColor: "rgba(255,255,255,.35)" } }} />
            <Button variant="outlined" disabled={code.length < 6 || joining}
              onClick={() => join({ entity: "rooms/join-by-code", method: "post", data: { code } } as any)}
              sx={{ color: "#f5c451", borderColor: "rgba(245,196,81,.6)", minWidth: 72 }}>
              ورود
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* جستجو و فیلتر */}
      <TextField fullWidth size="small" placeholder="جستجوی نام روم" value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)} sx={{ mb: 1.25 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          endAdornment: searchInput ? <IconButton size="small" onClick={() => setSearchInput("")}><Clear fontSize="small" /></IconButton> : null,
        }} />
      <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: "auto", pb: 0.5 }}>
        {FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} color={status === f.value ? "primary" : "default"} onClick={() => setStatus(f.value)} />
        ))}
      </Stack>

      {/* لیست */}
      {isError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => refetch()}>تلاش دوباره</Button>} sx={{ mb: 2 }}>دریافت لیست ناموفق بود.</Alert>}

      <Stack spacing={1.25}>
        {isLoading
          ? [0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={88} sx={{ borderRadius: 3 }} />)
          : (
            <AnimatePresence initial={false}>
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} busy={joining}
                  onJoin={() => join({ entity: `rooms/${room.id}/join`, method: "post" } as any)} />
              ))}
            </AnimatePresence>
          )}
        {!isLoading && rooms.length === 0 && !isError && (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              {search ? "رومی با این نام پیدا نشد" : "فعلاً رومی باز نیست"}
            </Typography>
            <Button size="small" onClick={() => setCreateOpen(true)}>اولین روم را بساز</Button>
          </Paper>
        )}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <CircularProgress size={20} /> : "نمایش بیشتر"}
          </Button>
        )}
      </Stack>

      {/* ساخت روم */}
      <Drawer anchor="bottom" open={createOpen} onClose={() => setCreateOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, p: 2.5, maxWidth: 600, mx: "auto" } }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>روم جدید</Typography>
        <TextField fullWidth label="نام روم" value={newName} inputProps={{ maxLength: 40 }}
          onChange={(e) => setNewName(e.target.value)} sx={{ mb: 2 }} />
        <ToggleButtonGroup exclusive fullWidth value={visibility} onChange={(_, v) => v && setVisibility(v)} sx={{ mb: 1 }}>
          <ToggleButton value="public"><Public sx={{ mr: 0.75 }} fontSize="small" />عمومی</ToggleButton>
          <ToggleButton value="private"><Lock sx={{ mr: 0.75 }} fontSize="small" />خصوصی</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {visibility === "public" ? "همه می‌توانند از لیست وارد شوند." : "فقط با کد ۶ حرفی قابل ورود است و توی لیست نمی‌آید."}
        </Typography>
        <Button fullWidth size="large" variant="contained" disabled={creating}
          onClick={() => createRoom({ entity: "rooms", method: "post", data: { name: newName || "بازی جدید", visibility } } as any)}>
          {creating ? <CircularProgress size={22} /> : "ساخت روم"}
        </Button>
      </Drawer>

      {/* کد روم خصوصی */}
      <Drawer anchor="bottom" open={!!created}
        PaperProps={{ sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, p: 2.5, maxWidth: 600, mx: "auto", textAlign: "center" } }}>
        <Typography variant="h6" fontWeight={800}>روم ساخته شد 🎉</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>این کد را برای دوستانتان بفرستید:</Typography>
        <Typography variant="h3" sx={{ direction: "ltr", letterSpacing: 8, fontWeight: 800, my: 1.5 }}>{created?.joinCode}</Typography>
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="outlined"
            onClick={() => navigator.clipboard?.writeText(created?.joinCode || "").then(() => snackbar("کپی شد", "success"))}>
            کپی کد
          </Button>
          <Button fullWidth variant="contained" onClick={() => created && enterRoom(created.roomId)}>ورود به روم</Button>
        </Stack>
      </Drawer>
    </Container>
  );
}