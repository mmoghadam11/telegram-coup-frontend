import { FormItem } from "types/formItem";


export const MembershipFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "membershipNo",
    inputType: "text",
    label: "شماره عضویت",
    size: { md: 4 },
    rules: { 
      required: "شماره عضویت الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
  {
    name: "cdMembershipTypeId",
    inputType: "select",
    label: "نوع عضویت",
    size: { md: 4 },
    options: options?.membershipType?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب نوع عضویت الزامی است" },
  },
  {
    name: "membershipDate",
    inputType: "date",
    label: "تاریخ عضویت",
    size: { md: 4 },
    rules: { required: "تاریخ عضویت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("membershipDate", value);
      },
      value: "",
    },
  },
  {
    name: "lastMembershipCardIssuanceDate",
    inputType: "date",
    label: "تاریخ صدور آخرین کارت عضویت",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("lastMembershipCardIssuanceDate", value);
      },
      value: "",
    },
  },
  {
    name: "cdproffesionalRankId",
    inputType: "select",
    label: "رده حرفه‌ای",
    size: { md: 4 },
    options: options?.rankOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب رده حرفه‌ای الزامی است" },
  },
  {
    name: "memberNo",
    inputType: "text",
    label: "شماره عضو",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
];