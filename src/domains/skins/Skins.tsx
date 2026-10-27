import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, ButtonBase, Chip, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { motion } from "motion/react";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useAssets } from "context/AssetPreloadContext";
import BackButton from "components/buttons/BackButton";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import { CARD_ROLES, DEFAULT_SKIN, SKINS, SkinSelection, skinImagePath } from "shared/cardSkins";
import RoleCardImage from "domains/rooms/components/proving/RoleCardImage";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface CatalogItem { folder: string; title: string; roles: string[]; price: number }

const LIST_KEY = "COUP_SKIN_LIST";
const keyOf = (folder: string, role: string) => `${folder}/${role}`;

function parse(raw?: string | null): SkinSelection {
  try { const v = raw ? JSON.parse(raw) : {}; return v && typeof v === "object" ? v : {}; } catch { return {}; }
}
function readList(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch { return []; }
}
function writeList(list: string[]) {
  try { localStorage.setItem(LIST_KEY, JSON.stringify(list)); } catch { /* storage ممکنه توی WebView بلاک باشه */ }
}
const same = (a: SkinSelection, b: SkinSelection) =>
  CARD_ROLES.every((r) => (a[r] ?? DEFAULT_SKIN) === (b[r] ?? DEFAULT_SKIN));

function Tile({ img, label, selected, onClick, width = 70 }: {
  img: string; label: string; selected?: boolean; onClick: () => void; width?: number;
}) {
  return (
    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -3 }} style={{ flexShrink: 0 }}>
      <ButtonBase onClick={onClick} aria-pressed={!!selected} sx={{ flexDirection: "column", borderRadius: 1.5 }}>
        <Box sx={{ position: "relative" }}>
          <Box component="img" src={img} alt={label} draggable={false}
            sx={{ width, height: width * 1.4, objectFit: "cover", borderRadius: 1, border: "2px solid", borderColor: selected ? "primary.main" : "transparent", boxShadow: selected ? "0 0 10px rgba(255,193,7,.85)" : "none" }} />
          {selected && <Check sx={{ position: "absolute", top: 4, right: 4, fontSize: 16, color: "#fff", bgcolor: "primary.main", borderRadius: "50%", p: "2px" }} />}
        </Box>
        <Typography variant="caption" display="block">{label}</Typography>
      </ButtonBase>
    </motion.div>
  );
}

export default function Skins() {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { src, ensureAssets } = useAssets();

  const { data, isLoading, isError, refetch } = useQuery<any, any, any>({
    queryKey: ["skins"], queryFn: Auth?.getRequest, refetchOnWindowFocus: false,
  } as any);

  // saved = آخرین حالت ذخیره‌شده روی سرور، selection = پیش‌نویس کاربر
  const [saved, setSaved] = useState<SkinSelection>(() => parse((Auth?.userInfo as any)?.card_skins));
  const [selection, setSelection] = useState<SkinSelection>(saved);
  const initialized = useRef(false);
  useEffect(() => {
    if (!data?.selection || initialized.current) return;
    initialized.current = true;       // فقط بار اول؛ refetch پیش‌نویس کاربر را پاک نکند
    setSaved(data.selection);
    setSelection(data.selection);
  }, [data]);

  const [list, setList] = useState<string[]>(readList);
  const [activeSet, setActiveSet] = useState("");
  const [leaveOpen, setLeaveOpen] = useState(false);

  // فقط چیزی که هم فرانت فایلش را دارد و هم سرور می‌پذیرد
  const catalog: CatalogItem[] | undefined = data?.catalog;
  const offered = (folder: string, role: string) =>
    !catalog || catalog.some((c) => c.folder === folder && c.price === 0 && c.roles.includes(role));

  const setNames = useMemo(
    () => Object.keys(SKINS).filter((f) => f !== DEFAULT_SKIN && SKINS[f].roles.some((r) => offered(f, r))),
    [catalog] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const active = activeSet || setNames[0] || "";
  const dirty = !same(selection, saved);

  const inList = (folder: string, role: string) =>
    folder === DEFAULT_SKIN || list.includes(keyOf(folder, role)) || selection[role] === folder;
  const updateList = (next: string[]) => { setList(next); writeList(next); };

  // فقط تصاویر مجموعه‌ی فعال، انتخاب‌ها و لیست؛ نه همه‌ی اسکین‌ها
  useEffect(() => {
    const urls = new Set<string>();
    SKINS[active]?.roles.forEach((r) => urls.add(skinImagePath(active, r)));
    Object.entries(selection).forEach(([r, f]) => urls.add(skinImagePath(f, r)));
    list.forEach((k) => { const [f, r] = k.split("/"); if (SKINS[f]) urls.add(skinImagePath(f, r)); });
    ensureAssets(Array.from(urls), true);
  }, [active, selection, list, ensureAssets]);

  const choose = (role: string, folder: string) =>
    setSelection((prev) => {
      const next = { ...prev };
      if (folder === DEFAULT_SKIN) delete next[role]; else next[role] = folder;
      return next;
    });

  const toggleCard = (folder: string, role: string) => {
    const k = keyOf(folder, role);
    updateList(list.includes(k) ? list.filter((x) => x !== k) : [...list, k]);
  };

  const wholeSetRoles = (folder: string) => SKINS[folder].roles.filter((r) => offered(folder, r));
  const addWholeSet = (folder: string) =>
    updateList(Array.from(new Set([...list, ...wholeSetRoles(folder).map((r) => keyOf(folder, r))])));
  const selectWholeSet = (folder: string) => {
    addWholeSet(folder);
    setSelection((prev) => {
      const next = { ...prev };
      wholeSetRoles(folder).forEach((r) => { next[r] = folder; });
      return next;
    });
  };

  const { mutate: save, isLoading: saving } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => {
      const next: SkinSelection = res?.selection ?? {};
      setSaved(next);
      setSelection(next);
      Auth?.setUserInfo({ ...Auth.userInfo, card_skins: JSON.stringify(next) } as any);
      snackbar(res?.rejected?.length ? `${res.rejected.length} مورد را سرور نپذیرفت` : "اسکین‌ها ذخیره شد",
        res?.rejected?.length ? "info" : "success");
    },
    onError: (err: any) => snackbar(err?.data?.error || `ذخیره نشد (${err?.status ?? "بدون پاسخ از سرور"})`, "error"),
  });

  const goBack = () => (dirty ? setLeaveOpen(true) : navigate(-1));

  if (isLoading) {
    return <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">اسکین کارت‌ها</Typography>
        <BackButton onBack={goBack} />
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={() => refetch()}>تلاش دوباره</Button>}>
          ارتباط با سرور اسکین‌ها برقرار نشد. ذخیره‌کردن فعلاً ممکن نیست.
        </Alert>
      )}

      {/* پیش‌نمایش زنده‌ی کل دست */}
      <Paper sx={{ p: 2, mb: 2, background: "linear-gradient(145deg,#3a1d0c,#7a3f1d)", border: "1px solid rgba(245,196,81,.55)" }}>
        <Typography variant="subtitle2" sx={{ color: "#f5c451", fontWeight: 800 }}>پیش‌نمایش کارت‌های شما</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0.75, mt: 1.5, "& .MuiTypography-root": { color: "rgba(255,255,255,.8)" } }}>
          {CARD_ROLES.map((role) => (
            <RoleCardImage key={`${role}-${selection[role] ?? DEFAULT_SKIN}`} role={role} size={42} skins={selection} />
          ))}
        </Box>
      </Paper>

      {/* مرور مجموعه‌ها */}
      {setNames.length > 0 && active && (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>مجموعه‌ها</Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
            {setNames.map((f) => (
              <Chip key={f} label={SKINS[f].title} color={f === active ? "primary" : "default"} onClick={() => setActiveSet(f)} />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ my: 1 }}>
            <Button size="small" variant="outlined" onClick={() => addWholeSet(active)}>افزودن کل مجموعه به لیست</Button>
            <Button size="small" variant="contained" onClick={() => selectWholeSet(active)}>استفاده از کل مجموعه</Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 1.5, mt: 1 }}>
            {wholeSetRoles(active).map((role) => {
              const added = inList(active, role);
              return (
                <Box key={role} sx={{ textAlign: "center" }}>
                  <Tile img={src(skinImagePath(active, role))} label={ROLE_LABELS_FA[role]} selected={added} width={64}
                    onClick={() => toggleCard(active, role)} />
                  <Typography variant="caption" color="text.secondary">{added ? "در لیست" : "افزودن"}</Typography>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      {/* انتخاب برای هر نقش، فقط از «لیست من» */}
      {CARD_ROLES.map((role) => {
        const options = Object.keys(SKINS).filter((f) => SKINS[f].roles.includes(role) && offered(f, role) && inList(f, role));
        const current = selection[role] ?? DEFAULT_SKIN;
        return (
          <Paper key={role} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>{ROLE_LABELS_FA[role]}</Typography>
            <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5 }}>
              {options.map((folder) => (
                <Tile key={folder} img={src(skinImagePath(folder, role))} label={SKINS[folder].title}
                  selected={current === folder} onClick={() => choose(role, folder)} />
              ))}
            </Stack>
            {options.length === 1 && (
              <Typography variant="caption" color="text.secondary">برای اسکین بیشتر، از «مجموعه‌ها» به لیست اضافه کنید.</Typography>
            )}
          </Paper>
        );
      })}

      {/* نوار ذخیره؛ همیشه پایین صفحه */}
      <Paper elevation={6} sx={{ position: "sticky", bottom: 8, p: 1.5, display: "flex", alignItems: "center", gap: 1, zIndex: 2 }}>
        <Box sx={{ flex: 1 }}>
          {dirty ? <Chip size="small" color="warning" label="تغییر ذخیره‌نشده" /> : <Typography variant="caption" color="text.secondary">همه‌چیز ذخیره است</Typography>}
        </Box>
        <Button size="small" disabled={!dirty || saving} onClick={() => setSelection(saved)}>بازگردانی</Button>
        <Button size="small" disabled={!Object.keys(selection).length || saving} onClick={() => setSelection({})}>پیش‌فرض</Button>
        <Button variant="contained" disabled={!dirty || saving || isError}
          onClick={() => save({ entity: "skins", method: "put", data: { selection } } as any)}>
          {saving ? <CircularProgress size={18} /> : "ذخیره"}
        </Button>
      </Paper>

      <ConfirmBox open={leaveOpen} handleClose={() => setLeaveOpen(false)} title="تغییرات ذخیره نشده"
        message="اگر خارج شوید تغییرات از بین می‌رود. مطمئنید؟"
        handleSubmit={() => { setLeaveOpen(false); navigate(-1); }} />
    </Container>
  );
}