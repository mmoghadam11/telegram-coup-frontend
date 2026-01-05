import { FormItem } from "types/formItem";

export const TwoFactorAuth1FormItems = (): 
  FormItem[] => [
    {
      name: "username",
      inputType: "text",
      label: "نام کاربری",
      size: { md: 11 },
      rules: {
        required: "نام کاربری الزامی است",
      },
      Defaultfont:true
    },
    {
      name: "password",
      inputType: "password",
      label: "رمز عبور",
      size: { md: 11 },
      rules: {
        required: "رمز عبور الزامی است",
      },
      Defaultfont:true
    },
  ];
export const TwoFactorAuth2FormItems =
  (): //   setValue: (name: any, val: any) => void,
  FormItem[] => [
    {
      name: "code",
      inputType: "text",
      label: "کد ارسال شده",
      size: { md: 11 },
      rules: {
        required: "ورود کد ارسال شده الزامی است",
      },
      Defaultfont:true
    },
  ];
