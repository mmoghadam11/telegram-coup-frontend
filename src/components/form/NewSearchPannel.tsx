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

function NewSearchPannel<T extends Record<string, any>>({
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
    getValues,
    reset,
  } = useForm();

  const handleReset = () => {
    reset({})
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const resetData: any = {};

    searchItems.forEach((item) => {
    //   if (searchData[item.name] !== undefined) {
        resetData[item.name] = "";

        // همچنین مقدار react-hook-form را هم reset کنید
        if (item.inputType === "autocomplete") {
          setValue(item.name, null); // برای autocomplete مقدار null قرار دهید
        }else if(item.inputType === "rangeSlider")
          setValue(item.name, []);
         else {
          setValue(item.name, ""); // برای سایر فیلدها string خالی
        }
    //   }
    });

    setSearchData(resetData);
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
        
          newFilters[item.name] = data[item.name]??"";
        
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
    if (searchData !== null) {
      reset({
        ...searchData,
      });
    } else
      reset({
      });
  }, [searchData]);
  return (
    <Grid item md={md} sm={11} xs={12} 
    // sx={{position:"sticky",top: 70,zIndex: 10,}}
    >
      <Paper elevation={3} sx={{ p: 3, mt: 1, mb: 2, width: "100%"}}>
        <form name="SearchPanel" onSubmit={handleSubmit(handleSearch)}>
          <Grid
            item
            container
            md={12}
            justifyContent={"space-between"}
            spacing={3}
            // position={"sticky"}
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
                      // if (item.inputType !== "autocomplete")
                        return (
                          <RenderFormInput
                            value={(getValues() as any)[item.name]}
                            controllerField={field}
                            errors={errors}
                            {...item}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
              md={3}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
             
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

export default NewSearchPannel;
