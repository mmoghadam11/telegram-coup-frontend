import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container, Typography, Tabs, Tab, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Button, Select, MenuItem, Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef } from "@mui/x-data-grid";
import { useAuth } from "hooks/useAuth";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import { IQueryFilter } from "types/types";

export default function AdminPage() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>پنل ادمین</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="کاربران" />
        <Tab label="روم‌ها" />
      </Tabs>
      {tab === 0 && <UsersGrid />}
      {tab === 1 && <RoomsGrid />}
    </Container>
  );
}

function UsersGrid() {
  const Auth = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<IQueryFilter & { telegram_id?: string }>({ page: 1, size: 10 });
  const [editUser, setEditUser] = useState<any>(null);
  const [telegramSearch, setTelegramSearch] = useState("");

  const queryString = new URLSearchParams({
    page: String(filters.page || 1),
    size: String(filters.size || 10),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortDir && { sortDir: filters.sortDir }),
    ...(filters.telegram_id && { telegram_id: filters.telegram_id }),
  }).toString();

  const { data, isLoading } = useQuery({
    queryKey: ["admin/users", filters],
    queryFn: () => Auth?.getRequest({ queryKey: `admin/users?${queryString}` }),
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      setEditUser(null);
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin/users"] }),
  });

  const columns: GridColDef[] = [
    {
      field: "photo_url",
      headerName: "عکس",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Avatar src={params.value || undefined} sx={{ width: 32, height: 32 }}>
          {params.row.first_name?.[0]}
        </Avatar>
      ),
    },
    { field: "id", headerName: "id", width: 70 },
    { field: "telegram_id", headerName: "Telegram ID", width: 140 },
    { field: "first_name", headerName: "نام", width: 130 },
    { field: "last_name", headerName: "نام خانوادگی", width: 130 },
    { field: "username", headerName: "یوزرنیم", width: 130 },
    { field: "role", headerName: "نقش", width: 100 },
    { field: "active_room_id", headerName: "روم فعال", width: 160 },
    {
      field: "actions",
      headerName: "عملیات",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => setEditUser(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              if (window.confirm(`حذف کاربر ${params.row.first_name}؟`)) {
                deleteUser({ entity: `admin/users/${params.row.id}`, method: "delete" } as any);
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <TextField
        size="small"
        label="سرچ بر اساس Telegram ID"
        value={telegramSearch}
        onChange={(e) => setTelegramSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setFilters((f) => ({ ...f, telegram_id: telegramSearch, page: 1 }));
          }
        }}
        sx={{ mb: 2, width: 250 }}
      />

      <TavanaDataGrid
        rows={data?.users || []}
        columns={columns}
        loading={isLoading}
        filters={{ ...filters, totalElements: data?.totalElements }}
        setFilters={setFilters as any}
        getRowId={(row) => row.id}
      />

      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>ویرایش کاربر {editUser?.id}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300, mt: 1 }}>
          <TextField
            label="نام" value={editUser?.first_name || ""}
            onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
          />
          <TextField
            label="نام خانوادگی" value={editUser?.last_name || ""}
            onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
          />
          <Select
            value={editUser?.role || "player"}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <MenuItem value="player">player</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </Select>
          <TextField
            label="active_room_id (خالی برای پاک کردن)"
            value={editUser?.active_room_id || ""}
            onChange={(e) => setEditUser({ ...editUser, active_room_id: e.target.value || null })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>انصراف</Button>
          <Button
            variant="contained"
            onClick={() =>
              updateUser({
                entity: `admin/users/${editUser.id}`,
                method: "patch",
                data: {
                  first_name: editUser.first_name,
                  last_name: editUser.last_name,
                  role: editUser.role,
                  active_room_id: editUser.active_room_id,
                },
              } as any)
            }
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function RoomsGrid() {
  const Auth = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<IQueryFilter>({ page: 1, size: 10 });
  const [editRoom, setEditRoom] = useState<any>(null);

  const queryString = new URLSearchParams({
    page: String(filters.page || 1),
    size: String(filters.size || 10),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortDir && { sortDir: filters.sortDir }),
  }).toString();

  const { data, isLoading } = useQuery({
    queryKey: ["admin/rooms", filters],
    queryFn: () => Auth?.getRequest({ queryKey: `admin/rooms?${queryString}` }),
  });

  const { mutate: updateRoom } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/rooms"] });
      setEditRoom(null);
    },
  });

  const { mutate: deleteRoom } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin/rooms"] }),
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 220 },
    { field: "name", headerName: "نام", width: 150 },
    { field: "status", headerName: "وضعیت", width: 100 },
    { field: "created_by", headerName: "سازنده", width: 100 },
    {
      field: "actions",
      headerName: "عملیات",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => setEditRoom(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              if (window.confirm(`حذف روم ${params.row.name}؟`)) {
                deleteRoom({ entity: `admin/rooms/${params.row.id}`, method: "delete" } as any);
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <TavanaDataGrid
        rows={data?.rooms || []}
        columns={columns}
        loading={isLoading}
        filters={{ ...filters, totalElements: data?.totalElements }}
        setFilters={setFilters as any}
        getRowId={(row) => row.id}
      />

      <Dialog open={!!editRoom} onClose={() => setEditRoom(null)}>
        <DialogTitle>ویرایش روم</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300, mt: 1 }}>
          <TextField
            label="نام" value={editRoom?.name || ""}
            onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })}
          />
          <Select
            value={editRoom?.status || "waiting"}
            onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value })}
          >
            <MenuItem value="waiting">waiting</MenuItem>
            <MenuItem value="playing">playing</MenuItem>
            <MenuItem value="finished">finished</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRoom(null)}>انصراف</Button>
          <Button
            variant="contained"
            onClick={() =>
              updateRoom({
                entity: `admin/rooms/${editRoom.id}`,
                method: "patch",
                data: { name: editRoom.name, status: editRoom.status },
              } as any)
            }
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}