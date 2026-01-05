import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  FormHelperText,
  LinearProgress,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Slider,
  useTheme,
} from "@mui/material";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import React, { forwardRef } from "react";
import { IRenderFormInput, TOption } from "types/render";
import CustomDatePicker from "../datePicker/CustomDatePicker";
import PasswordInput from "./PasswordInput";
import DatePicker from "react-multi-date-picker";
// import SelectCity from "./SelectCity.bak-tsx";
// import SelectLocation from "./SelectLocation";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import moment from "jalali-moment";
import TicketDivider from "components/FancyTicketDivider";

const RenderFormInput: React.FC<IRenderFormInput> = forwardRef((props, ref) => {
  const {
    name,
    label,
    errors,
    elementProps = {},
    controllerField,
    onChange,
    value,
    defaultValue,
    placeholder,
    Defaultfont = false,
  } = props;
  const theme=useTheme();
  if (props.inputType === "text") {
    return (
      <TextField
        name={name}
        label={label}
        error={Boolean(errors?.[name]?.message)}
        helperText={errors?.[name]?.message}
        value={value}
        {...controllerField}
        {...elementProps}
        inputRef={ref}
        fullWidth
        size="small"
        inputProps={{ style: !Defaultfont ? { fontSize: 16 } : null }} // font size of input text
        InputLabelProps={{ style: !Defaultfont ? { fontSize: 16 } : null }}
        onChange={onChange}
        // value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    );
  }
  if (props.inputType === "password") {
    return (
      <PasswordInput
        name={name}
        label={label}
        errors={errors?.[name]?.message}
        controllerField={controllerField}
        elementProps={elementProps}
        Defaultfont={Defaultfont}
      />
    );
  }
  if (props.inputType === "date") {
    const { setValue, watch, format } = props;
    // console.log("elementProps",elementProps.value)
    // console.log("jalali",moment(new Date(elementProps.value)).format("jYYYY/jMM/jDD"))
    return (
      <CustomDatePicker
        ref={ref}
        name={name}
        label={label}
        // value={watch(name)}
        disabled={elementProps?.disabled}
        format={format}
        value={elementProps.value}
        {...elementProps}
        setDay={(day: any) => {
          // setValue(name, day);
          elementProps.setDay();
          // همچنین مقدار را به react-hook-form گزارش دهید
          if (controllerField.onChange) {
            controllerField.onChange(day);
          }
        }}
        {...controllerField}
        error={errors?.[name]?.message}
        onChange={onChange ?? controllerField.onChange}
      />
      //   <Box sx={{ width: "100%" }}>
      //   <Box
      //     className="date-field"
      //     sx={{
      //       position: "relative",
      //       display: "flex",
      //       height: "40px",
      //       alignItems: "center",
      //       borderRadius: "4px",
      //       width: "100%",

      //       // border: (theme) => `1px solid ${theme.palette.grey[400]}`,
      //       // ":hover": {
      //       //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
      //       // },
      //       // ":focus": {
      //       //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
      //       // },
      //     }}
      //   >
      //     <Box
      //       onClick={() => {
      //         let element = document.getElementsByName(name);
      //         element?.[0].focus();
      //       }}
      //       component="legend"
      //       fontSize={12}
      //       sx={{
      //         paddingLeft: 0.5,
      //         height: "100%",
      //         borderRadius: "4px 0px 0px 4px",
      //         backgroundColor: (theme) => theme.palette.grey[300],
      //         display: "flex",
      //         alignItems: "center",
      //         // mr: 2,
      //         px: 1,
      //       }}
      //     >
      //       {label}
      //     </Box>
      //     <DatePicker
      //       calendar={persian}
      //       locale={persian_fa}
      //       calendarPosition="bottom-right"
      //       containerClassName="date-input"
      //       // format={format}
      //       {...elementProps}
      //       {...controllerField}
      //       onChange={(e)=>console.log("DATE",e?.getValue)}
      //       value={value}
      //       style={{ height: "100%", minWidth: "100px", borderRadius: "4px 0px 0px 4px", margin: "0px", width: "100%" }}
      //       placeholder="انتخاب تاریخ ..."
      //       name={name}
      //     />
      //     {value && (
      //       <HighlightOffIcon onClick={() => setDay("")} sx={{ ml: -3, color: (theme) => theme.palette.grey[600] }} />
      //     )}
      //   </Box>
      //   {/* {error && <FormHelperText error={true}>{error}</FormHelperText>} */}
      // </Box>
    );
  }
  // if (props.inputType === "autocomplete") {
  //   let { options, status, refetch } = props;
  //   if (status === "loading") return <LoadingState label={label} />;
  //   if (status === "error" && refetch) return <ErrorState label={label} refetch={refetch} />;
  //   return (
  //     <Autocomplete
  //       {...controllerField}
  //       {...elementProps}
  //       options={options}
  //       //@ts-ignore
  //       getOptionLabel={(option: TOption) => {
  //         if (typeof option !== "object") {
  //           let result = options.find((op: TOption) => op?.value === option);
  //           return result?.title || "";
  //         }
  //         return option?.title || "";
  //       }}
  //       filterOptions={(ops, state) => {
  //         //@ts-ignore
  //         let temp = ops?.filter((op: TOption) => op?.title?.includes(state?.inputValue));
  //         return temp;
  //       }}
  //       value={controllerField?.value}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           variant="outlined"
  //           label={label}
  //           error={Boolean(errors?.[name]?.message)}
  //           helperText={errors?.[name]?.message}
  //           size="small"
  //         />
  //       )}
  //     />
  //   );
  // }
  if (props.inputType === "autocomplete") {
    let {
      options = [],
      status,
      refetch,
      customOnChange,
      externalValue,
      storeValueAs = "object",
      skipClientFilter = false, // <-- این را اضافه کنید
      inlineLoading = false, // <-- این را اضافه کنید
    } = props;

    // اگر inlineLoading فعال باشد، به‌جای return LoadingState، اسپینر داخلی نشان می‌دهیم
    const loading = props?.elementProps?.loading ?? status === "loading";

    // رفتار قدیمی را نگه‌می‌داریم مگر اینکه inlineLoading=true شود
    if (!inlineLoading) {
      if (status === "loading") return <LoadingState label={label} />;
      if (status === "error" && refetch)
        return <ErrorState label={label} refetch={refetch} />;
    }

    return (
      <Autocomplete
        ref={ref}
        {...controllerField}
        {...elementProps} // شامل onInputChange, noOptionsText, ...
        options={options}
        loading={loading} // <-- اینجا از loading استفاده کنید
        getOptionLabel={(option: TOption) => {
          if (typeof option !== "object") {
            let result = options.find((op: TOption) => op?.value === option);
            return result?.title || "";
          }
          return option?.title || "";
        }}
        filterOptions={(ops, state) => {
          if (skipClientFilter) return ops; // <--
          //@ts-ignore
          return ops?.filter((op: TOption) => 
             op?.title?.includes(state?.inputValue)
          );
        }}
        value={controllerField?.value || null}
        onChange={(event, newValue: any, reason) => {
          let valueToStore = newValue;
          if (storeValueAs === "id") {
            valueToStore = newValue ? newValue.value : null;
          }
          if (customOnChange) {
            customOnChange(event, newValue, reason);
          }
          controllerField.onChange(valueToStore);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            error={Boolean(errors?.[name]?.message)}
            helperText={errors?.[name]?.message}
            size="medium"
            InputProps={{ // <-- این بخش اسپینر داخلی را اضافه می‌کند
              ...params.InputProps,
              //  style: { height: 40 },
              style: { height: 45 },
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        isOptionEqualToValue={(option: any, value: any) => {
          if (!value) return false;
          if (storeValueAs === "object") return option.value === value.value;
          else return option.value === value;
        }}
      />
    );
  }

  if (props.inputType === "select") {
    let { options, status, refetch } = props;
    if (status === "loading") return <LoadingState label={label} />;
    if (status === "error" && refetch)
      return <ErrorState label={label} refetch={refetch} />;

    return (
      <FormControl fullWidth>
        <InputLabel id={`select-input-${name}`}>{label}</InputLabel>
        <Select
          ref={ref}
          labelId={`select-input-${name}`}
          label={label}
          {...controllerField}
          {...elementProps}
          value={
            controllerField.value === false
              ? "false"
              : controllerField.value || ""
          }
          error={Boolean(errors?.[name]?.message)}
          size="small"
        >
          {options?.map((option: TOption) => (
            <MenuItem
              key={`${name}-select-item-${option.value}`}
              value={option.value}
            >
              {option.title}
            </MenuItem>
          ))}
        </Select>
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
  if (props.inputType === "titleDivider") {
    if (label === "") return <TicketDivider />;
    return (
      <Box width="100%">
        <Typography>{label}</Typography>
      </Box>
    );
  }
  // if (props.inputType === "city") {
  //   const { setValue, disabled, cityId } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   return <SelectCity label={label} name={name} setValue={setValue} disabled={disabled} cityId={cityId} />;
  // }
  if (props.inputType === "checkbox") {
    const { disabled = false, onClick = () => {} } = elementProps;
    let val =
      controllerField.value === "false"
        ? false
        : controllerField.value === "true"
        ? true
        : controllerField.value;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              size="small"
              disabled={disabled}
              // defaultChecked={val}
              checked={val}
              onChange={(e) => {
                controllerField.onChange(e.target.checked);
              }}
              // onChange={controllerField.onChange}
              onBlur={controllerField.onBlur}
              ref={controllerField.ref}
            />
          }
          label={<Typography variant="body2">{label}</Typography>}
          onClick={onClick}
          // {...controllerField}
          {...elementProps}
        />
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormGroup>
    );
  }
  if (props.inputType === "rangeSlider") {
    const formatDate = (ts: any) => moment(ts).format("jYYYY/jMM/jDD");
    return (
      <Box sx={{height:"100%",position: 'relative',display:"flex",justifyContent:"center",width: "100%",px:1,borderRadius:1,border:"1.5px solid",borderColor:theme.palette.mode==="light"?"rgba(0, 0, 0, 0.23)":"rgba(255, 255, 255, 0.23)"}}>
        <Typography p={0.5} bgcolor={theme.palette.mode==="light"?theme.palette.background.paper:"#252525"} position='absolute' top={-14} left={8} variant="caption">{label}:</Typography>
        <Slider
          name={name}
          aria-label={label}
          sx={{
            mt:1,
            width:"80%",
            "& .MuiSlider-thumb": { mr: -2 },
          }}
          {...controllerField}
          {...elementProps}
          value={(controllerField.value ?? [0, 100]).map((v: any) =>
            typeof v === "string" ? moment(v).valueOf() : v
          )} // اگر خالی بود مقدار اولیه بده
          onChange={(_, newValue: number[]) => {
            const isoValues = newValue.map((v) =>
              moment(v).toDate().toISOString()
            );
            controllerField.onChange(isoValues);
            // controllerField.onChange(newValue);
          }}
          min={elementProps?.min ?? 0}
          max={elementProps?.max ?? 100}
          valueLabelFormat={(v) => moment(v).format("jYYYY/jMM/jDD")}
          valueLabelDisplay="auto"
          size="small"
        />
        {elementProps?.withText && (
          <Box>
            <Typography variant="caption">
              از: {formatDate(controllerField?.value?.[0])}
            </Typography>
            <Typography variant="caption">
              تا: {formatDate(controllerField?.value?.[1])}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // if (props.inputType === "location") {
  //   const { setValue, watch } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   if (!watch) throw Error("watch is not defined");
  //   return <SelectLocation watch={watch} setValue={setValue} />;
  // }

  return <h1>not supported type</h1>;
});

export default RenderFormInput;

export const LoadingState: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <Box sx={{ minHeight: "40px" }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <LinearProgress />
    </Box>
  );
};
const ErrorState: React.FC<{ label?: string; refetch: () => void }> = ({
  label,
  refetch,
}) => {
  return (
    <ErrorHandler onRefetch={refetch} errorText={`خطا در دریاف ${label} ها`} />
  );
};
