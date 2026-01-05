import { AddCircle, ChangeCircle, Map, Psychology } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface FormData {
  Permissions: any[];
}

interface FormItem {
  name: keyof FormData;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}

type Props = {
  refetch: () => void;
  appendPermissionFlag: boolean;
  setAppendPermissionFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AppendPermission = ({
  appendPermissionFlag,
  setAppendPermissionFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [formData, setFormData] = useState<FormData>(
    !!editeData
      ? editeData?.Permissions
      : []
  );
  const {
    data: permissionOptions,
    status: permissionOptions_status,
    refetch: permissionOptions_refetch,
  } = useQuery<any>({
    queryKey: [`permission/find-by-name-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData?.permissions??[]);
      reset({
        Permissions: editeData?.permissions || [],
      });
    }
  }, [editeData, appendPermissionFlag]);
  useEffect(() => {
    console.log("formData=>", formData);
  }, [formData]);

  const handleClose = () => {
    setAppendPermissionFlag(false);
    reset();
    setFormData({
      Permissions:[]
    });
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };

  const onSubmit = (data: FormData) => {
    console.log("lastData=", data);
    mutate(
      {
        entity: `role/modify-permission?id=${editeData?.id}`,
        method: "post",
        data: [...data.Permissions],
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی نقش با مجوز های انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد مجوز جدید با موفقیت انجام شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };

  return (
    <Dialog open={appendPermissionFlag} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Psychology fontSize="large" />
            <Typography variant="h6">
              {editeData ? `مدیریت مجوز های کاربر انتخاب شده` : `ایجاد مجوز جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={12}>
              <Controller
                name="Permissions"
                control={control}
                rules={{
                  required: "انتخاب مجوز الزامی است",
                }}
                render={({ field: { value, onChange, ref }, fieldState }) => (
                  <Autocomplete
                    multiple
                    ref={ref}
                    id="permissionId"
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    value={value || []}
                    limitTags={2} // 🔹 محدودیت نمایش تگ‌ها
                    // filterSelectedOptions // 🔹 عدم نمایش گزینه‌های انتخاب شده در لیست
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.name}
                          {...getTagProps({ index })}
                        //   disabled={index === 0} // 🔹 می‌توانید تگ خاصی را غیرفعال کنید
                          size="small"
                        />
                      ))
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="انتخاب مجوز"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    options={permissionOptions?.map((item:any) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              <Button
                variant="contained"
                startIcon={!!editeData ? <ChangeCircle /> : <AddCircle />}
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editeData
                  ? "به روز رسانی"
                  : "ایجاد"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppendPermission;
