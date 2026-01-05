import { AutocompleteProps, CheckboxProps, GridProps, MenuItemProps, SelectProps, TextFieldProps } from "@mui/material";
import { QueryStatus } from "@tanstack/react-query";

type TInputTypes = "text" | "autocomplete" | "checkbox" | "select" | "date" | "password" | "city";

interface IBaseInput<TInputTypes> {
  inputType: TInputTypes;
  label: string;
  name: string;
  gridProps?: GridProps;
}

export type TOption = MenuItemProps | { title: any; value: any,key?:any };
interface IText extends IBaseInput<"text" | "password"> {
  elementProps?: TextFieldProps;
}
interface ISelect extends IBaseInput<"select"> {
  elementProps?: SelectProps;
  options: TOption[];
  status?: QueryStatus;
  refetch?: () => void;
}
interface IAutocomplete extends IBaseInput<"autocomplete"> {
  elementProps?: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>;
  options: TOption[];
  status?: QueryStatus;
  refetch?: () => void;
}
interface ICheckbox extends IBaseInput<"checkbox"> {
  elementProps?: CheckboxProps;
}

interface IDate extends IBaseInput<"date"> {
  elementProps?: Optional<DatePickerProps<DayValue>>;
}
interface ICitySelect extends IBaseInput<"city"> {
  elementProps?: CheckboxProps;
}

export type IRenderInput = IText | ISelect | IAutocomplete | ICheckbox | IDate | ICitySelect | IBoolean;

export type IRenderFormInput = IRenderInput & {
  errors: any;
  controllerField: any;
  setValue?: UseFormSetValue<T>;
  watch?: any;
};
