import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Man4,
  Map,
  Receipt,
  School,
  Work,
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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface FormData {
  id?: any;
  termName: string;
  personnelCaId: string;
  applicatorName: string;
  hour_count: string;
  request_year: string;
  request_month: string;
}

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const  EditeFirmPersonnel = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { id } = useParams();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<FormData>();
  const {
    data: orderTypeOptions,
    status: orderTypeOptions_status,
    refetch: orderTypeOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=47`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: workgroupOptions,
    status: workgroupOptions_status,
    refetch: workgroupOptions_refetch,
  } = useQuery<any>({
    queryKey: [`workgroup/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: orderSubjectOptions,
    status: orderSubjectOptions_status,
    refetch: orderSubjectOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=48`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);

  const {
      data: firmOptions,
      status: firmOptions_status,
      refetch: firmOptions_refetch,
    } = useQuery<any>({
      queryKey: [`firm/search-all`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
    } as any);
  const formItems: any[] = [
    {
      name: "auditingFirmId",
      inputType: "autocomplete",
      label: "موسسه",
      size: { md: 12 },
      options: firmOptions?.map((item:any)=>({value:item.id,title:item.name})) ?? [{ value: 0, title: "خالی" }],
      storeValueAs:"id"
    },
  ];
  useEffect(() => {
    if (editeData !== null) {
      //   setFormData(editeData);
      reset({
        ...editeData,
      });
    } else
      reset({
        // auditingFirmId یا firmId چی میگه؟
        personnelCaId: id,
      });
  }, [editeData, addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();

    setEditeData(null);
  };

  const onSubmit = (data: any) => {
    mutate(
      {
        entity: `personnel-info/update-firm?personnelId=${editeData?.id}&auditingFirmId=${data.auditingFirmId}`,
        // entity: `firm-director/save`,
        // method: !!editeData ? "put" : "post",
        method:  "put",
        // data: {
        //   ...data,
        //   // active: true,
        //   personnelCaId: id,
        // },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editeData)
            snackbar(
              `به روز رسانی حکم حسابدار انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`حکم انتظامی جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد حکم انتظامی", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display={"flex"}
            textAlign={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Work fontSize="large" />
            <Typography variant="h6">
              {editeData
                ? `ویرایش حکم انتظامی انتخاب شده`
                : `ایجاد حکم انتظامی جدید`}
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
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      value={(getValues() as any)[item.name]}
                      controllerField={field}
                      errors={errors}
                      {...item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}

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

export default  EditeFirmPersonnel;
