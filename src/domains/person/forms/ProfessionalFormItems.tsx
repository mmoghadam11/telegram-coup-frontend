import { FormItem } from "types/formItem";


export const ProfessionalFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "itSkillHistory",
    inputType: "text",
    label: "سابقه مهارت‌های فناوری اطلاعات",
    size: { md: 6 },
    elementProps: {
      multiline: true,
      rows: 3,
    },
    rules: { },
  },
  {
    name: "professionalHistory",
    inputType: "text",
    label: "سوابق حرفه‌ای",
    size: { md: 6 },
    elementProps: {
      multiline: true,
      rows: 3,
    },
    rules: { },
  },
];