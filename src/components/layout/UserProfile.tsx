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
  Grid,
} from "@mui/material";
import {
  Close,
  PhotoCamera,
  CloudUpload,
  DeleteOutline,
  Check,
} from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { FormItem } from "types/formItem";
import { Controller, useForm } from "react-hook-form";
import RenderFormInput from "components/render/formInputs/RenderFormInput";

type Props = {
  open: boolean;
  onClose: () => void;
};


const UserProfile: React.FC<Props> = ({ open, onClose }) => {

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  
  // آرایه آیتم‌های فرم
  const formItems: FormItem[] = [
    // {
    //   name: "firstname",
    //   inputType: "text",
    //   label: "نام",
    //   size: { md: 3 },
    //   rules: {
    //     required: "نام الزامی است",
    //   },
    //   elementProps:{disabled:true}
    // },
    // {
    //   name: "lastname",
    //   inputType: "text",
    //   label: "نام خانوادگی",
    //   size: { md: 3 },
    //   rules: {
    //     required: "نام خانوادگی الزامی است",
    //   },
    //   elementProps:{disabled:true}
    // },
    // {
    //   name: "nationalCode",
    //   inputType: "text",
    //   label: "کد ملی",
    //   size: { md: 3 },
    //   rules: {
    //     required: "کد ملی الزامی است",
    //     pattern: {
    //       value: /^[0-9]{10}$/,
    //       message: "کد ملی باید 10 رقمی باشد",
    //     },
    //   },
    //   elementProps:{disabled:true}
    // },
    // {
    //   name: "username",
    //   inputType: "text",
    //   label: "نام کاربری",
    //   size: { md: 3 },
    //   rules: {
    //     required: "نام کاربری الزامی است",
    //   },
    //   elementProps:{disabled:true}
    // },
    // {
    //   name: "mobileNumber",
    //   inputType: "text",
    //   label: "شماره موبایل",
    //   size: { md: 4 },
    //   rules: {
    //     required: "شماره موبایل الزامی است",
    //     pattern: {
    //       value: /^09\d{9}$/,
    //       message: "شماره موبایل باید 11 رقم و با 09 شروع شود",
    //     },
    //   },
    // },
    {
      name: "password",
      inputType: "password",
      label: "پسورد",
      size: { md: 6 },
      rules: {
        required: "پسورد الزامی است",
        // pattern: {
        // value:
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        // message:
        //   "پسورد باید حداقل ۸ کاراکتر، شامل حروف بزرگ، حروف کوچک، عدد و کاراکتر ویژه باشد",
        // }
      },
    },
    {
      name: "confirmPassword",
      inputType: "password",
      label: "تکرار پسورد",
      size: { md: 6 },
      rules: {
        required: "تکرار پسورد الزامی است",
        validate: (value: any) =>
          value === getValues().password || "پسوردها مطابقت ندارند",
      },
    },
  ];

  const onSubmit = (data: any) => {
    const { confirmPassword, ...submitData } = data;
    console.log("submitData=>", submitData);
    mutate(
      {
        entity: `user/update`,
        // entity: `firm/save`,
        method: "put",
        // method:  "post",
        data: {
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          // snackbar(`به روز رسانی پروفایل شما با موفقیت انجام شد`, "success");
          snackbar(`تغییر رمز عبور شما با موفقیت انجام شد`, "success");
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };
  const attachmentFileDto = {
    username: localStorage.getItem("username") ?? "",
    description: "Avatar Upload", // می‌توانید یک توضیح بگذارید
  };

  useEffect(() => {
    reset({
      id:Auth?.userInfo?.userId,
      firstname:Auth?.userInfo?.firstName,
      lastname:Auth?.userInfo?.lastName,
      nationalCode:Auth?.userInfo?.nationalCode,
      username:localStorage.getItem("username"),
      mobileNumber:Auth?.userInfo?.mobileNumber,
    })
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
        <Typography variant="h6">تغیر رمز عبور</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{alignContent:"center"}}>
        <Grid container spacing={2} justifyContent={"center"} height={"100%"}>
          {formItems?.map((item) => (
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
                    value={getValues()[item.name]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Box></Box>

        <Box display={"flex"}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={isLoading}>
            انصراف
          </Button>
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            type="submit"
          >
            ثبت تغییرات
          </Button>
        </Box>
      </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserProfile;
