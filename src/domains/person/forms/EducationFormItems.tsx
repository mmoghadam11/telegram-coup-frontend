import { FormItem } from "types/formItem";


export const EducationFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "cdeducationalCertificateId",
    inputType: "select",
    label: "مدرک تحصیلی",
    size: { md: 4 },
    options: options?.eduCertificate?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب مدرک تحصیلی الزامی است" },
  },
  {
    name: "educationalCertificatePlaceId",
    inputType: "autocomplete",
    label: "محل اخذ مدرک",
    size: { md: 4 },
    options: options?.cityOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: 'id',
    rules: { required: "انتخاب محل اخذ مدرک الزامی است" },
  },
  {
    name: "cdeducationalFieldId",
    inputType: "select",
    label: "رشته تحصیلی",
    size: { md: 4 },
    options: options?.educationalFieldOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب رشته تحصیلی الزامی است" },
  },
  {
    name: "cduniversityId",
    inputType: "select",
    label: "دانشگاه",
    size: { md: 4 },
    options: options?.universityOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب دانشگاه الزامی است" },
  },
  {
    name: "educationalCertificateDate",
    inputType: "date",
    label: "تاریخ اخذ مدرک",
    size: { md: 4 },
    rules: { required: "تاریخ اخذ مدرک الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("educationalCertificateDate", value);
      },
      value: "",
    },
  },
  {
    name: "faculty",
    inputType: "checkbox",
    label: "عضو هیئت علمی",
    size: { md: 4 },
    rules: { },
  },
  {
    name: "facultyStartDate",
    inputType: "date",
    label: "تاریخ شروع عضویت در هیئت علمی",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("facultyStartDate", value);
      },
      value: "",
    },
  },
  {
    name: "facultyEndDate",
    inputType: "date",
    label: "تاریخ پایان عضویت در هیئت علمی",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("facultyEndDate", value);
      },
      value: "",
    },
  },
];
