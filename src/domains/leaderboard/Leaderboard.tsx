import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Container, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Stack, Box } from "@mui/material";
import { useAuth } from "hooks/useAuth";
import PowerRadar from "./components/PowerRadar";
import MedalStat from "./components/MedalStat";

export default function Leaderboard() {
  const Auth = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: Auth?.getRequest,
    select: (res: any) => res,
  });

  if (isLoading || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography textAlign="center">در حال بارگذاری...</Typography>
      </Container>
    );
  }

  const { top, me, myRank } = data;

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        🏆 لیدربورد
      </Typography>

      <Paper variant="outlined" sx={{ mb: 3 }}>
        <List dense>
          {top.map((p: any, index: number) => (
            <ListItem key={p.user_id} sx={{ bgcolor: p.user_id === me?.user_id ? "action.selected" : undefined }}>
              <ListItemAvatar>
                <Stack alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    #{index + 1}
                  </Typography>
                  <Avatar src={p.photo_url || undefined}>{p.first_name?.[0]}</Avatar>
                </Stack>
              </ListItemAvatar>
              <ListItemText
                primary={p.first_name}
                secondary={`${p.total_wins} برد از ${p.total_games} بازی`}
                sx={{ ml: 1 }}
              />
              <Chip size="small" color="warning" label={`${p.total_wins} 🏆`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {me && (
        <>
          {!top.some((p: any) => p.user_id === me.user_id) && (
            <Paper variant="outlined" sx={{ mb: 3 }}>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        #{myRank}
                      </Typography>
                      <Avatar src={me.photo_url || undefined}>{me.first_name?.[0]}</Avatar>
                    </Stack>
                  </ListItemAvatar>
                  <ListItemText primary={`${me.first_name} (شما)`} secondary={`${me.total_wins} برد از ${me.total_games} بازی`} sx={{ ml: 1 }} />
                </ListItem>
              </List>
            </Paper>
          )}

          <Paper sx={{ p: 2, mb: 3 }}>
            <PowerRadar stats={me} />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" textAlign="center" gutterBottom>
              مدال‌ها
            </Typography>
            <Stack direction="row" justifyContent="space-around" flexWrap="wrap" sx={{ mt: 1 }}>
              <MedalStat icon="⚔️" label="کشتار" value={me.total_kills} color="#e53935" />
              <MedalStat icon="💥" label="کودتا" value={me.total_coups} color="#8e24aa" />
              <MedalStat icon="🎭" label="بلوف موفق" value={me.total_successful_bluffs} color="#fb8c00" />
              <MedalStat icon="🕵️" label="چالش درست" value={me.total_correct_challenges} color="#1e88e5" />
            </Stack>
          </Paper>
        </>
      )}
    </Container>
  );
}