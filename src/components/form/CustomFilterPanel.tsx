import { RestartAlt, Search } from "@mui/icons-material";
import {
  Grid,
  Paper,
  Button,
  Autocomplete,
  TextField,
  Fab,
  Tooltip,
  Box,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Props<T> = {
  searchItems: any[];
  filters: T;
  setFilters: React.Dispatch<any>;
  md?: number;
};

function CustomFilterPanel<T extends Record<string, any>>({
  searchItems,
  filters,
  setFilters,
  md = 11,
}: Props<T>) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
  } = useForm();

  const handleReset = () => {
    reset({});
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const resetData: any = {};

    searchItems.forEach((item) => {
      //   if (searchData[item.name] !== undefined) {
      resetData[item.name] = "";

      // همچنین مقدار react-hook-form را هم reset کنید
      if (item.inputType === "autocomplete") {
        setValue(item.name, null); // برای autocomplete مقدار null قرار دهید
      } else if (item.inputType === "rangeSlider") setValue(item.name, []);
      else {
        setValue(item.name, ""); // برای سایر فیلدها string خالی
      }
      //   }
    });

    setFilters((prev: any) => ({
      ...prev,
      ...resetData,
    }));
  };
  const handleSearch = (data: any) => {
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const newFilters: Record<string, any> = {};

    searchItems.forEach((item) => {
      // if (item.inputType !== "autocomplete") {

      newFilters[item.name] = data[item.name] ?? "";

      // } else if (searchData[item.name] !== undefined) {
      //   newFilters[item.name] = searchData[item.name];
      // }
    });

    setFilters((prev: any) => ({
      ...prev,
      ...newFilters,
    }));
  };
  useEffect(() => {
    if (filters !== null) {
      reset({
        ...filters,
      });
    } else reset({});
  }, [filters]);
  return (
    <form
      style={{ display: "flex", justifyContent: "center" }}
      name="SearchPanel"
      onSubmit={handleSubmit(handleSearch)}
    >
      <Grid
        container
        justifyContent={"space-between"}
        spacing={3}
        // position={"sticky"}
        sx={{ p: 3, mb: 2, width: "100%" }}
      >
        <Grid item container md={9.5} spacing={2}>
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
                  // if (item.inputType !== "autocomplete")
                  return (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  );
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          item
          md={2.5}
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Tooltip title="بازنمایی">
            <Fab
              size="small"
              sx={{ mr: 1, fontSize: "0.8rem" }}
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
  );
}

export default CustomFilterPanel;
