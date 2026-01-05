import { FormItem } from "types/formItem";


export const ContactFormItems = (
  setValue: (name: any, val: any) => void,
): FormItem[] => [
  {
    name: "phoneNo",
    inputType: "text",
    label: "شماره تلفن",
    size: { md: 4 },
    rules: { 
      required: "شماره تلفن الزامی است",
      pattern: {
        value: /^[0-9]{8,11}$/,
        message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
      }
    },
  },
  {
    name: "mobileNo",
    inputType: "text",
    label: "شماره موبایل",
    size: { md: 4 },
    rules: { 
      required: "شماره موبایل الزامی است",
      pattern: {
        value: /^09[0-9]{9}$/,
        message: "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
      }
    },
  },
  {
    name: "workLandline",
    inputType: "text",
    label: "تلفن محل کار",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]{8,11}$/,
        message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
      }
    },
  },
  {
    name: "personEmail",
    inputType: "text",
    label: "ایمیل شخصی",
    size: { md: 4 },
    rules: { 
      required: "ایمیل شخصی الزامی است",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "فرمت ایمیل نامعتبر است"
      }
    },
  },
];