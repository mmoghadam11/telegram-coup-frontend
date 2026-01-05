// UploadAvatarSimpleDialog.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import {
  Close,
  PhotoCamera,
  CloudUpload,
  DeleteOutline,
  AccountCircle,
} from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import paramsSerializer from "services/paramsSerializer";

type Props = {
  open: boolean;
  onClose: () => void;
  currentAvatarUrl: string ;
};

const MAX_SIZE_MB = 2;

const ProfileDialog: React.FC<Props> = ({
  open,
  onClose,
  currentAvatarUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    currentAvatarUrl ?? null
  );

  const Auth = useAuth();
  const snackbar = useSnackbar();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCallUpload,
  });
  const { mutate: mutateFile, isLoading: isLoadingFile } = useMutation({
    mutationFn: Auth?.serverCallUpload,
  });
  const attachmentFileDto = {
    username: localStorage.getItem("username") ?? "",
    description: "Avatar Upload",
  };

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreview(currentAvatarUrl ?? null);
    } else {
      // پاک کردن URLهای موقتی برای جلوگیری از نشت حافظه
      if (!currentAvatarUrl && preview?.startsWith("blob:"))
        URL.revokeObjectURL(preview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">مشاهده عکس پروفایل</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} alignItems="center" mt={1}>
          <Avatar
            // src={avatarUrl ?? undefined}
            src={
              process.env.REACT_APP_Image_URL+currentAvatarUrl
            }
            sx={{
              width: 250,
              height: 250,
              border: "2px solid",
              borderColor: "divider",
            }}
          >
            <AccountCircle sx={{ width: 250, height: 250 }} color="inherit" />
          </Avatar>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Box display={"flex"}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={isLoading}>
            بازگشت
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
