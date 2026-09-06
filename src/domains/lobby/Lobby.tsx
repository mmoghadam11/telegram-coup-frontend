import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Paper,
  Stack,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { AddCircleOutline } from "@mui/icons-material";

export default function Lobby() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const [newRoomName, setNewRoomName] = useState("");

  const { data: rooms, isLoading } = useQuery<any, any, any[]>({
    queryKey: ["rooms"],
    queryFn: Auth?.getRequest,
    select: (res: any) => res.rooms,
    refetchInterval: 5000, // هر ۵ ثانیه لیست روم‌ها رو رفرش کن
  } as any);

  const { mutate: createRoom, isLoading: creating } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => {
      snackbar("روم ساخته شد", "success");
      navigate(`/room/${res.roomId}`); // فعلاً این route وجود نداره، بعداً می‌سازیمش
    },
    onError: (err: any) => {
      snackbar(err?.data?.error || "خطا در ساخت روم", "error");
    },
  });

  const { mutate: joinRoom } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => {
      navigate(`/room/${res.roomId}`);
    },
    onError: (err: any) => {
      snackbar(err?.data?.error || "خطا در پیوستن به روم", "error");
    },
  });

  const handleCreateRoom = () => {
    createRoom({
      entity: "rooms",
      method: "post",
      data: { name: newRoomName || "بازی جدید" },
    } as any);
  };

  const handleJoinRoom = (roomId: string) => {
    joinRoom({ entity: `rooms/${roomId}/join`, method: "post" } as any);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
        لابی بازی
      </Typography>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item sm={9}>
          <TextField
            fullWidth
            size="small"
            label="نام روم جدید"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </Grid>
        <Grid item textAlign={"end"} sm={3}>
          <Button variant="contained" onClick={handleCreateRoom} disabled={creating}>
            {creating ? <CircularProgress size={20} /> : <Stack direction={"row"} gap={1}><AddCircleOutline/> ساخت روم</Stack>}
          </Button> 
        </Grid>
      </Grid>

      <Paper variant="outlined">
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List>
            {(!rooms || rooms.length === 0) && (
              <ListItem>
                <ListItemText primary="در حال حاضر روم بازی باز نیست" />
              </ListItem>
            )}
            {rooms?.map((room: any) => (
              <ListItem key={room.id} disablePadding>
                <ListItemButton onClick={() => handleJoinRoom(room.id)}>
                  <ListItemText primary={room.name} secondary={`${room.player_count} بازیکن`} />
                  <Chip size="small" label={room.status} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}