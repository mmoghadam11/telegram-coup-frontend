import { RestartAlt, Search } from "@mui/icons-material";
import {
  Grid,
  Paper,
  Button,
  Autocomplete,
  TextField,
  Fab,
  Tooltip,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Props<T> = {
  searchItems: any[];
  setSearchData: React.Dispatch<React.SetStateAction<T>>;
  searchData: T;
  setFilters: React.Dispatch<any>;
  md?: number;
};

function SearchPannel<T extends Record<string, any>>({
  searchItems,
  setSearchData,
  searchData,
  setFilters,
  md = 11,
}: Props<T>) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm();

  const handleReset = () => {
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const resetData: any = {};

    searchItems.forEach((item) => {
      if (searchData[item.name] !== undefined) {
        resetData[item.name] = "";

        // همچنین مقدار react-hook-form را هم reset کنید
        if (item.inputType === "autocomplete") {
          setValue(item.name, null); // برای autocomplete مقدار null قرار دهید
        } else {
          setValue(item.name, ""); // برای سایر فیلدها string خالی
        }
      }
    });

    setSearchData(resetData);
    setFilters((prev: any) => ({
      ...prev,
      ...resetData,
    }));
  };
  const handleSearch = () => {
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const newFilters: Record<string, any> = {};

    searchItems.forEach((item) => {
      if (searchData[item.name] !== undefined) {
        newFilters[item.name] = searchData[item.name];
      }
    });

    setFilters((prev: any) => ({
      ...prev,
      ...newFilters,
    }));
  };
  useEffect(() => {
      if (searchData !== null) {
        reset({
          ...searchData,
        });
      } else
        reset({
        });
    }, [searchData]);
  return (
    <Grid item md={md} sm={11} xs={12}>
      <Paper elevation={3} sx={{ p: 3, mt: 1, mb: 2, width: "100%" }}>
        <form name="SearchPanel" onSubmit={handleSubmit(handleSearch)}>
          <Grid
            item
            container
            md={12}
            justifyContent={"space-between"}
            spacing={3}
          >
            <Grid item container md={9} spacing={2}>
              {searchItems.map((item, itemKey) => (
                <Grid
                  item
                  key={item.name + itemKey}
                  xs={12}
                  md={item?.size?.md || 3}
                >
                  <Controller
                    name={item.name}
                    control={control}
                    render={({ field, fieldState }) => {
                      if (item.inputType !== "autocomplete")
                        return (
                          <RenderFormInput
                            controllerField={field}
                            errors={errors}
                            {...item}
                            {...field}
                            onChange={(e: any) => {
                              // if (!isNaN(e.target.value))
                              //   searchData[item.name](e.target.value);
                              field.onChange(e);
                              setSearchData((prev: any) => ({
                                ...prev,
                                [item.name]: e.target.value,
                              }));
                            }}
                            value={(searchData as any)[item.name] ?? ""}
                            placeholder={`جستجو بر اساس ${item.label}`}
                          />
                        );
                      else if (item.inputType === "autocomplete")
                        return (
                          <Autocomplete
                            ref={field.ref}
                            id={item.name}
                            onChange={(
                              event: any,
                              newValue: any,
                              reason: string
                            ) => {
                              field.onChange(newValue); // تغییرات را به react-hook-form گزارش دهید
                              if (reason === "clear") {
                                // وقتی کاربر دکمه clear را می‌زند
                                setSearchData((prev: any) => ({
                                  ...prev,
                                  [item.name]: "",
                                }));
                              } else if (newValue?.id) {
                                setSearchData((prev: any) => ({
                                  ...prev,
                                  [item.name]: newValue.id ?? "",
                                  // provinceName: newValue.name,
                                }));
                              }
                            }}
                            value={field.value || null} // استفاده از value از react-hook-form
                            renderOption={(props: any, option: any) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={item.label}
                                error={fieldState.invalid} // اضافه کردن error
                                helperText={fieldState.error?.message} // اضافه کردن helperText
                                InputProps={{
                                  ...params.InputProps,
                                  //  style: { height: 40 },
                                  style: { height: 45 },
                                }}
                              />
                            )}
                            clearOnBlur
                            options={item.options?.map((item: any) => ({
                              id: item.id,
                              name: item.value,
                            }))}
                            getOptionLabel={(option: any) => option.name || ""}
                            isOptionEqualToValue={(option: any, value: any) => {
                              return option.id === value?.id;
                            }}
                          />
                        );
                      else return <></>;
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid
              item
              md={3}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              {/* <Button
              endIcon={<RestartAlt />}
              variant="outlined"
              sx={{ height: "100%",mr:1 }}
              onClick={handleReset}
            >
              ریست
            </Button>
            <Button
              endIcon={<Search />}
              variant="contained"
              sx={{ height: "100%" }}
              onClick={handleSearch}
            >
              جستجو
            </Button> */}
              <Tooltip title="بازنمایی">
                <Fab
                  sx={{ mr: 1 }}
                  size="small"
                  type="button"
                  onClick={handleReset}
                >
                  <RestartAlt fontSize="small" />
                </Fab>
              </Tooltip>
              <Tooltip title="جستجو">
                <Fab
                  color="primary"
                  size="small"
                  type="submit"
                  onClick={handleSearch}
                >
                  <Search fontSize="small" />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default SearchPannel;
