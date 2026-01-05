import { FormItem } from "types/formItem";


export const BasicFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "firstName",
    inputType: "text",
    label: "نام",
    size: { md: 4 },
    rules: { required: "نام الزامی است" },
  },
  {
    name: "lastName",
    inputType: "text",
    label: "نام خانوادگی",
    size: { md: 4 },
    rules: { required: "نام خانوادگی الزامی است" },
  },
  {
    name: "latinFirstName",
    inputType: "text",
    label: "نام (لاتین)",
    size: { md: 4 },
    rules: { 
      required: "نام لاتین الزامی است",
      pattern: {
        value: /^[a-zA-Z]+$/,
        message: "نام لاتین باید فقط شامل حروف انگلیسی باشد",
      },
    },
  },
  {
    name: "latinLastName",
    inputType: "text",
    label: "نام خانوادگی (لاتین)",
    size: { md: 4 },
    rules: { 
      required: "نام خانوادگی لاتین الزامی است",
      pattern: {
        value: /^[a-zA-Z]+$/,
        message: "نام خانوادگی لاتین باید فقط شامل حروف انگلیسی باشد",
      },
    },
  },
  {
    name: "birthDate",
    inputType: "date",
    label: "تاریخ تولد",
    size: { md: 4 },
    rules: { required: "تاریخ تولد الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("birthDate", value);
      },
      value: "",
    },
  },
  {
    name: "birthPlaceId",
    inputType: "autocomplete",
    label: "محل تولد",
    size: { md: 4 },
    options: options?.cityOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: 'id',
    rules: { required: "انتخاب محل تولد الزامی است" },
  },
  {
    name: "issuePlaceId",
    inputType: "autocomplete",
    label: "محل صدور",
    size: { md: 4 },
    options: options?.cityOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: 'id',
    rules: { required: "انتخاب محل صدور الزامی است" },
  },
  {
    name: "fatherName",
    inputType: "text",
    label: "نام پدر",
    size: { md: 4 },
    rules: { required: "نام پدر الزامی است" },
  },
  {
    name: "nationalCode",
    inputType: "text",
    label: "کد ملی",
    size: { md: 4 },
    rules: { 
      required: "کد ملی الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد ملی باید 10 رقم باشد"
      }
    },
  },
  {
    name: "idNumber",
    inputType: "text",
    label: "شماره شناسنامه",
    size: { md: 4 },
    rules: { required: "شماره شناسنامه الزامی است" },
  },
  {
    name: "auditingFirmId",
    inputType: "autocomplete",
    label: "موسسه",
    size: { md: 4 },
    options: options?.firmOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: 'id',
    rules: {},
  },
];