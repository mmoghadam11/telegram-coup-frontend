import { useEffect } from "react";
import { UseFormProps, useForm } from "react-hook-form";

export default function useCrud(formConfig: UseFormProps, item: any) {
  const form = useForm(formConfig);

  useEffect(() => {
    if (item) {
      Object.keys(item).forEach((field) => {
        form.setValue(field, item[field]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.setValue, item]);

  return form;
}
