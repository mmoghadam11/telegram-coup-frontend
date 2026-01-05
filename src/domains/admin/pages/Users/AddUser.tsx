import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FullInstituteType } from "types/institute";

// کامپوننت‌های مربوط به هر دسته اطلاعات
import { Check, Inventory, ManageAccounts } from "@mui/icons-material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import MembershipInfo from './MembershipInfo';
// import FinancialInfo from './FinancialInfo';
// import ContactInfo from './ContactInfo';
// import CEOInfo from './CEOInfo';
// import BoardInfo from './BoardInfo';
// import RatingInfo from './RatingInfo';
// import SpecialInfo from './SpecialInfo';

export default function AddUser(): JSX.Element {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
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

  const [formData, setFormData] = useState<{
    [K in keyof FullInstituteType]: string;
  }>({} as { [K in keyof FullInstituteType]: string });

  interface FormItem {
    // name: keyof FullInstituteType;
    name: string;
    inputType: string;
    label: string;
    size: { md: number };
    rules?: any;
    options?: any[];
    elementProps?: any;
  }

  // آرایه آیتم‌های فرم
  const formItems: FormItem[] = [
    {
      name: "firstname",
      inputType: "text",
      label: "نام",
      size: { md: 3 },
      rules: {
        required: "نام الزامی است",
      },
    },
    {
      name: "lastname",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 3 },
      rules: {
        required: "نام خانوادگی الزامی است",
      },
    },
    {
      name: "nationalCode",
      inputType: "text",
      label: "کد ملی",
      size: { md: 3 },
      rules: {
        required: "کد ملی الزامی است",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "کد ملی باید 10 رقمی باشد",
        },
      },
    },
    {
      name: "username",
      inputType: "text",
      label: "نام کاربری",
      size: { md: 3 },
      rules: {
        required: "نام کاربری الزامی است",
      },
    },
    {
      name: "mobileNumber",
      inputType: "text",
      label: "شماره موبایل",
      size: { md: 4 },
      rules: {
        required: "شماره موبایل الزامی است",
        pattern: {
          value: /^09\d{9}$/,
          message: "شماره موبایل باید 11 رقم و با 09 شروع شود",
        },
      },
    },
    {
      name: "password",
      inputType: "password",
      label: "پسورد",
      size: { md: 4 },
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
      size: { md: 4 },
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
        entity: `user/${id !== "new" ? "update" : "add"}`,
        // entity: `firm/save`,
        method: id !== "new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (id !== "new")
            snackbar(
              `به روز رسانی کاربر انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد کاربر جدید با موفقیت انجام شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };
  useEffect(() => {
    if (!!state?.userData) {
      const { password, ...editeData } = state?.userData;
      reset(editeData);
    }
  }, [state?.userData]);

  return (
    <Grid container justifyContent={"center"}>
      <Grid md={10.5} sm={11.5} xs={12} item>
        <Paper elevation={3} sx={{ p: 5, mt: 3, width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid
                item
                md={12}
                xs={12}
                display={"flex"}
                justifyContent={"space-between"}
                mb={1}
              >
                <Grid item display={"flex"}>
                  <ManageAccounts fontSize="large" />
                  <Typography variant="h5">مدیریت کاربران</Typography>
                </Grid>
                <BackButton onBack={() => navigate(-1)} />
              </Grid>
              <Grid item container md={12} spacing={2}>
                <Grid item md={12} width={"100vw"}>
                  <FancyTicketDivider />
                </Grid>
                <Grid item md={12}>
                  <Typography variant="h6" fontSize={"large"}>
                    {id !== "new" ? "ویرایش کاربر" : "ایجاد کاربر جدید"}
                  </Typography>
                </Grid>
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
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  sx={{ minWidth: "25%" }}
                  variant="contained"
                  startIcon={<Check />}
                  type="submit"
                >
                  ثبت
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
