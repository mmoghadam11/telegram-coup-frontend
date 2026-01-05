import { FormItem } from "types/formItem";


export const InsuranceFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "socialSecurityOrganizationInsuranceNo",
    inputType: "text",
    label: "شماره بیمه سازمان تأمین اجتماعی",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
  {
    name: "cdinsuranceCoverageTypeId",
    inputType: "select",
    label: "نوع پوشش بیمه",
    size: { md: 4 },
    options: options?.InsuranceCoverage?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب نوع پوشش بیمه الزامی است" },
  },
  {
    name: "cdsupplementaryInsuranceCcoverageTypeId",
    inputType: "select",
    label: "نوع پوشش بیمه تکمیلی",
    size: { md: 4 },
    options: options?.supplementaryInsuranceOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { },
  },
  {
    name: "workshopCode",
    inputType: "text",
    label: "کد کارگاه",
    size: { md: 4 },
    rules: { },
  },
];
