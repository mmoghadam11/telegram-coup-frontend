import {
  Add,
  AddCircle,
  AddCircleOutline,
  ChangeCircle,
  Check,
  Delete,
  Key,
  Map,
  Psychology,
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
  Checkbox,
  Tooltip,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  DialogActions,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import paramsSerializer from "services/paramsSerializer";
import SearchPannel from "components/form/SearchPannel";

interface FormData {
  roles: any[];
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
  appendFirmFlag: boolean;
  setAppendFirmFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AppendFirm = ({
  appendFirmFlag,
  setAppendFirmFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  

  interface SearchData {
    name: string;
    code: string;
  }
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
  };
  const [searchData, setSearchData] = useState({
      name: "",
    });
  const searchItems: searchType[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام موسسه",
      size: { md: 5 },
    },
  ];
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    name: "",
    // code: "",
  });
  const [formData, setFormData] = useState<FormData>(
    !!editeData ? editeData?.roleDtos : []
  );
  const [selectecFirms, setSelectecFirms] = useState<any[]>([]);
  const {
    data: firmOptions,
    status: firmOptions_status,
    refetch: firmOptions_refetch,
  } = useQuery<any>({
    queryKey: [`firm/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: historyData,
    status: historyData_status,
    refetch: historyData_refetch,
  } = useQuery<any>({
    queryKey: [`user/find-firm-access?userId=${editeData?.id}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!editeData,
  } as any);
  useEffect(() => {
    if (selectecFirms.length===0&&historyData_status==="success") {
      setSelectecFirms(historyData)
    }
  }, [historyData, appendFirmFlag]);
  

  const handleClose = () => {
    setAppendFirmFlag(false);
    setEditeData(null);
    setSelectecFirms([])
    // setTimeout(() => setEditeData(null), 500);
  };

  const onSubmit = () => {
    const lastData=selectecFirms.map((firmItem,firmIndex)=>(
      firmItem?.id
    ))
    console.log("lastData=", lastData);
    mutate(
      {
        entity: `user/modify-firm-access?userId=${editeData?.id}`,
        method: "post",
        data: [...lastData],
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی دسترسی ها برای ${editeData.first_name+" "+editeData.lastname} با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`کاربری انتخاب نشده`, "error");
          // refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "نام موسسه", flex: 2 },
    // { field: "registerNo", headerName: "شماره ثبت نام", flex: 1 },
    { field: "nationalId", headerName: "شناسه ملی موسسه", flex: 1 },
    {
      headerName: "انتخاب",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <Tooltip title="افزودن">
            <Fab
              color="info"
              size="small"
              onClick={() => {
                if(selectecFirms.some(item=>item.id===row.id))
                  snackbar("این موسسه در لیست کاربر موجود میباشد","warning")
                else
                setSelectecFirms((prev: any[]) => [...prev, row]);
              }}
            >
              <Add fontSize="small" />
            </Fab>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <Dialog
      maxWidth={"lg"}
      sx={{minHeight:"60vh"}}
      open={appendFirmFlag}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Key fontSize="large" />
            <Typography variant="h6">
              مدیریت دسترسی به موسسات برای کاربر
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={12}>
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
                        label="انتخاب نقش"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    options={firmOptions?.map((item:any) => ({
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
        </form> */}
        <Grid container justifyContent={"center"}>
          <Grid container item md={6} sm={6} xs={12} justifyContent={"center"} alignContent={"start"}>
            <Grid item md={11} sm={11} xs={12}>
              <Typography variant="h6">لیست کل موسسات</Typography>
            </Grid>
            
              <SearchPannel searchData={searchData} setSearchData={setSearchData} searchItems={searchItems} setFilters={setFilters}/>
            
            <Grid item md={11} sm={11} xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} minHeight={100}>
              {firmOptions_status === "success" ? (
                isMobile ? (
                  <VerticalTable
                    rows={firmOptions?.content}
                    columns={columns}
                    filters={filters}
                    setFilters={setFilters}
                    rowCount={firmOptions?.totalElements}
                  />
                ) : (
                  <TavanaDataGrid
                    rows={firmOptions?.content}
                    columns={columns}
                    filters={filters}
                    setFilters={setFilters}
                    rowCount={firmOptions?.totalElements}
                    // getRowHeight={() => "auto"}
                    autoHeight
                    hideToolbar
                  />
                )
              ) : <CircularProgress/>}
            </Grid>
          </Grid>

          <Grid container item md={5} sm={5} xs={12} justifyContent={"center"} alignContent={"start"} spacing={1}>
            <Grid item md={11} sm={11} xs={12}>
              <Typography variant="h6">لیست موسسات انتخاب شده</Typography>
            </Grid>
            <Grid item md={11} sm={11} xs={12}>
              <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">نام موسسه</TableCell>
                      <TableCell align="center">شناسه ملی موسسه</TableCell>
                      <TableCell align="center">حذف</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectecFirms?.map((firmItem, firmIndex) => (
                      <TableRow key={firmIndex}>
                        <TableCell align="center">{firmItem?.name}</TableCell>
                        <TableCell align="center">
                          {firmItem?.nationalId}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="حذف">
                            <Fab
                              color="error"
                              size="small"
                              onClick={() => {
                                setSelectecFirms((prev) =>
                                  prev.filter(
                                    (item) => item?.id !== firmItem?.id
                                  )
                                );
                              }}
                            >
                              <Delete fontSize="small" />
                            </Fab>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{p:2,mx:2}}>
        <Button variant="contained" endIcon={<Check/>} fullWidth onClick={onSubmit}>
          ثبت
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppendFirm;
