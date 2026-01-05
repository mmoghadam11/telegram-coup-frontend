import { FormItem } from "types/formItem";


export const PersonalInfoFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "cdReliginId",
    inputType: "select",
    label: "دین",
    size: { md: 4 },
    options: options?.religionOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { },
  },
  {
    name: "cdmarriageTypeId",
    inputType: "select",
    label: "وضعیت تأهل",
    size: { md: 4 },
    options: options?.marriageOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب وضعیت تأهل الزامی است" },
  },
  {
    name: "cdcitizenshipId",
    inputType: "select",
    label: "تابعیت",
    size: { md: 4 },
    // options: options?.citizenshipOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
    options: options?.countryOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب تابعیت الزامی است" },
  },
  {
    name: "cdgenderTypeId",
    inputType: "select",
    label: "جنسیت",
    size: { md: 4 },
    options: options?.genderOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب جنسیت الزامی است" },
  },
];