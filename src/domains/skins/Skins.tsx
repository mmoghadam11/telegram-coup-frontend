import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useAssets } from "context/AssetPreloadContext";
import { ALL_SKIN_IMAGES, CARD_ROLES, DEFAULT_SKIN, SKINS, SkinSelection, skinImagePath } from "shared/cardSkins";
import BackButton from "components/buttons/BackButton";
import { useNavigate } from "react-router-dom";

const ROLE_LABELS_FA: Record<string, string> = {
    duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
    princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

function parse(raw?: string | null): SkinSelection {
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export default function Skins() {
    const Auth = useAuth();
    const snackbar = useSnackbar();
    const { src, ensureAssets } = useAssets();
    const navigate = useNavigate();
    const [selection, setSelection] = useState<SkinSelection>(() => parse(Auth?.userInfo?.card_skins));

    // همه‌ی اسکین‌ها برای پیش‌نمایش لازمن
    useEffect(() => { ensureAssets(ALL_SKIN_IMAGES, true); }, [ensureAssets]);

    const { mutate: save, isLoading } = useMutation({
        mutationFn: Auth?.serverCall,
        onSuccess: (res: any) => {
            Auth?.setUserInfo({ ...Auth.userInfo, card_skins: JSON.stringify(res.selection) });
            setSelection(res.selection);
            snackbar("اسکین‌ها ذخیره شد", "success");
        },
        onError: () => snackbar("ذخیره نشد", "error"),
    });

    const choose = (role: string, folder: string) =>
        setSelection((prev) => {
            const next = { ...prev };
            if (folder === DEFAULT_SKIN) delete next[role];
            else next[role] = folder;
            return next;
        });

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" textAlign="center" gutterBottom>اسکین کارت‌ها</Typography>
                <BackButton onBack={() => navigate(-1)} />
            </Box>
            {CARD_ROLES.map((role) => {
                const options = Object.entries(SKINS).filter(([, s]) => s.roles.includes(role));
                const current = selection[role] ?? DEFAULT_SKIN;
                return (
                    <Paper key={role} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>{ROLE_LABELS_FA[role]}</Typography>
                        <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5 }}>
                            {options.map(([folder, skin]) => (
                                <Box key={folder} onClick={() => choose(role, folder)} sx={{ cursor: "pointer", textAlign: "center", flexShrink: 0 }}>
                                    <Box
                                        component="img"
                                        src={src(skinImagePath(folder, role))}
                                        alt={skin.title}
                                        sx={{
                                            width: 70, height: 98, objectFit: "cover", borderRadius: 1,
                                            border: "2px solid", borderColor: current === folder ? "primary.main" : "transparent",
                                            boxShadow: current === folder ? "0 0 8px rgba(255,193,7,.8)" : "none",
                                        }}
                                    />
                                    <Typography variant="caption" display="block">{skin.title}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                );
            })}
            <Button
                fullWidth variant="contained" disabled={isLoading}
                onClick={() => save({ entity: "skins", method: "put", data: { selection } } as any)}
            >
                ذخیره
            </Button>
        </Container>
    );
}