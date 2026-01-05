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
  name: string;
  persianName: string;
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
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddRole = ({
  addModalFlag,
  setAddModalFlag,
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

  

  const formItems: FormItem[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام نقش",
      size: { md: 6 },
      rules: {
        required: "نام نقش الزامی است",
        minLength: {
          value: 2,
          message: "نام نقش باید حداقل ۲ کاراکتر باشد",
        },
      },
    },
    {
      name: "persianName",
      inputType: "text",
      label: "نام فارسی",
      size: { md: 6 },
      rules: {
        required: "نام فارسی الزامی است",
        minLength: {
          value: 2,
          message: "نام نقش باید حداقل ۲ کاراکتر باشد",
        },
      },
    },
  ];

  useEffect(() => {
    if (editeData !== null) {
      reset({
        id:editeData?.id,
        name: editeData.name || "",
        persianName: editeData.persianName || "",
      });
    }
    else reset({})
  }, [editeData, addModalFlag]);
  

  const handleClose = () => {
    setAddModalFlag(false);
    reset({});
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };

  

  const onSubmit = (data: FormData) => {
    // console.log("data",data)
    mutate(
      {
        entity: `role/${!!editeData ? "update" : "add"}`,
        method: !!editeData ? "put" : "post",
        data: data,
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی نقش انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد نقش جدید با موفقیت انجام شد`, "success");
          refetch();
            handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Psychology fontSize="large"/>
            <Typography variant="h6">
              {editeData ? `ویرایش نقش انتخاب شده` : `ایجاد نقش جدید`}
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
                      controllerField={field}
                      errors={errors}
                      {...item}
                      // value={formData[item.name]}
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

export default AddRole;
