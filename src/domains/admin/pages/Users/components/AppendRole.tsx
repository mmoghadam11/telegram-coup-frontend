import {
  Add,
  AddCircle,
  ChangeCircle,
  Delete,
  Map,
  Psychology,
  Search,
} from "@mui/icons-material";
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
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";

interface FormData {
  roles: any[];
}

type Props = {
  refetch: () => void;
  appendRoleFlag: boolean;
  setAppendRoleFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AppendRole = ({
  appendRoleFlag,
  setAppendRoleFlag,
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
    getValues,
  } = useForm<FormData>();

  const [formData, setFormData] = useState<any>(
    !!editeData ? editeData?.roleDtos : []
  );
  const {
    data: roleOptions,
    status: roleOptions_status,
    refetch: roleOptions_refetch,
  } = useQuery<any>({
    queryKey: [`role/find-by-name-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData?.roleDtos ?? []);
      reset({
        roles: editeData?.roleDtos || [],
      });
    }
  }, [editeData, appendRoleFlag]);
  useEffect(() => {
    console.log("formData=>", formData);
  }, [formData]);

  const handleClose = () => {
    setAppendRoleFlag(false);
    reset();
    setFormData({
      roles: [],
    });
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };

  const onSubmit = (data: FormData) => {
    console.log("lastData=", data);
    console.log("formData=", formData);
    
    mutate(
      {
        entity: `user/modify-role?userId=${editeData?.id}`,
        method: "post",
        // data: [...data.roles],
        data: formData,
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی کاربر با نقش های انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد نقش جدید با موفقیت انجام شد`, "success");
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
    <Dialog open={appendRoleFlag} onClose={handleClose}  maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Psychology fontSize="large" />
            <Typography variant="h6">
              {editeData ? `مدیریت نقش های کاربر انتخاب شده` : `ایجاد نقش جدید`}
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
            {/* <Grid item xs={12} md={12}>
              <Controller
                name="roles"
                control={control}
                rules={{
                  required: "انتخاب نقش الزامی است",
                }}
                render={({ field: { value, onChange, ref }, fieldState }) => (
                  <Autocomplete
                    multiple
                    ref={ref}
                    id="roleId"
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    value={value || []}
                    limitTags={2} // 🔹 محدودیت نمایش تگ‌ها
                    // filterSelectedOptions // 🔹 عدم نمایش گزینه‌های انتخاب شده در لیست
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.persianName}
                          {...getTagProps({ index })}
                          //   disabled={index === 0} // 🔹 می‌توانید تگ خاصی را غیرفعال کنید
                          size="small"
                        />
                      ))
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.persianName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="انتخاب نقش"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    options={roleOptions?.map((item: any) => ({
                      id: item.id,
                      // name: item.name,
                      persianName: item.persianName,
                      name:item.name,
                    }))}
                    getOptionLabel={(option) => option.persianName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />
              <RenderFormDisplay item={rolesFormItem} value={getValues(rolesFormItem.name as any)} />
            </Grid> */}
            <Grid container item xs={12} spacing={2}>
              {/* ستون چپ: جستجو و نتایج */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  {/* جدول نتایج جستجو */}
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>نام</TableCell>
                          <TableCell>کلید</TableCell>
                          <TableCell align="center">افزودن</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roleOptions ? (
                          roleOptions?.map((row: any, index: number) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant="caption">
                                  {row?.persianName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {row?.name}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    setFormData((prev: any) => {
                                      if (
                                        prev.some(
                                          (item: any) => row.id === item.id
                                        )
                                      ) {
                                        snackbar(
                                          "این نقش در لیست موجود میباشد",
                                          "error"
                                        );
                                        return prev;
                                      }
                                      return [...prev, row];
                                    })
                                  }
                                >
                                  <Add />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          // ))
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              موردی یافت نشد
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* ستون راست: لیست انتخاب شده‌ها */}
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "100%",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "#f9f9f9" : "#494949ff",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    لیست نقش های کاربر
                  </Typography>

                  <TableContainer sx={{ maxHeight: 365 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>نام</TableCell>
                          <TableCell>کلید</TableCell>
                          <TableCell align="center">حذف</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData && formData.length > 0 ? (
                          formData.map((row: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {row.persianName}
                              </TableCell>
                              <TableCell>
                                {row.name}
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="حذف">
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => setFormData((prev:any) => prev.filter((i:any) => i.id !== row.id))}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              align="center"
                              sx={{ color: "text.secondary" }}
                            >
                              هنوز موردی اضافه نشده است
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
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

export default AppendRole;
