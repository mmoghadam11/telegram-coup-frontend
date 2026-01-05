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
} from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import paramsSerializer from "services/paramsSerializer";

type Props = {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  currentAvatarUrl?: string | null;
  onUploaded?: (payload: any) => void; // مثلا دریافت URL جدید
};

const MAX_SIZE_MB = 2;

const UploadAvatarSimpleDialog: React.FC<Props> = ({
  open,
  onClose,
  currentAvatarUrl,
  onUploaded,
  refetch,
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
    description: "Avatar Upload", // می‌توانید یک توضیح بگذارید
  };

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreview(currentAvatarUrl ?? null);
    } else {
      // پاک کردن URLهای موقتی برای جلوگیری از نشت حافظه
      if (!currentAvatarUrl&&preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChooseClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    // ولیدیشن ساده
    if (!f.type.startsWith("image/")) {
      snackbar("فقط فایل تصویری مجاز است.", "warning");
      e.currentTarget.value = "";
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      snackbar(`حداکثر حجم فایل ${MAX_SIZE_MB}MB است.`, "warning");
      e.currentTarget.value = "";
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    e.currentTarget.value = ""; // اجازه انتخاب دوباره همان فایل
  };

  const handleClear = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(currentAvatarUrl ?? null);
  };
  const handleClearPermanently = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (!!currentAvatarUrl)
      mutate(
        {
          // مسیر API را متناسب با بک‌اند خودتان تغییر دهید
          entity: `user/remove-profile-image${paramsSerializer({
            username: attachmentFileDto.username,
          })}`,
          method: "delete",
        },
        {
          onSuccess: (res: any) => {
            snackbar("عکس پروفایل با موفقیت حذف شد.", "success");
            refetch();
          },
          onError: () => {
            snackbar("خطا در حذف عکس پروفایل.", "error");
          },
        }
      );
    setFile(null);
    setPreview(null);
  };

  const handleUpload = () => {
    if (!file) {
      snackbar("ابتدا یک عکس انتخاب کنید.", "info");
      return;
    }

    const dtoBlob = new Blob([JSON.stringify(attachmentFileDto)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("attachmentFileDto", dtoBlob);

    mutateFile(
      {
        // مسیر API را متناسب با بک‌اند خودتان تغییر دهید
        entity: `user/upload-profile-image${paramsSerializer(
          attachmentFileDto
        )}`,
        method: "post",
        data: formData,
      },
      {
        onSuccess: (res: any) => {
          snackbar("عکس پروفایل با موفقیت آپلود شد.", "success");
          onUploaded?.(res?.data ?? res);
          refetch();
          onClose();
        },
        onError: () => {
          snackbar("خطا در آپلود عکس پروفایل.", "error");
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">آپلود عکس پروفایل</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} alignItems="center" mt={1}>
          <Avatar
            src={preview ?? undefined}
            sx={{
              width: 112,
              height: 112,
              border: "2px solid",
              borderColor: "divider",
            }}
          >
            <PhotoCamera fontSize="large" />
          </Avatar>

          <Button
            variant="outlined"
            onClick={handleChooseClick}
            disabled={isLoading}
          >
            انتخاب فایل
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />

          {file && (
            <Typography variant="caption" color="text.secondary">
              {file.name} — {(file.size / 1024 / 1024).toFixed(2)}MB
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Box>
          {/* <Button
            color="inherit"
            startIcon={<DeleteOutline />}
            onClick={handleClear}
            disabled={isLoading || (!file && !currentAvatarUrl)}
          >
            حذف انتخاب
          </Button> */}
          <Button
            color="inherit"
            startIcon={<DeleteOutline />}
            onClick={handleClearPermanently}
            disabled={isLoadingFile || (!file && !currentAvatarUrl)}
          >
            حذف عکس پروفایل
          </Button>
        </Box>

        <Box display={"flex"}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={isLoading}>
            انصراف
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={isLoading || !file}
          >
            آپلود
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAvatarSimpleDialog;
