import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import ErrorAlert from "components/phoenixAlert/ErrorAlert";
import RenderFormInput from "components/render/formInputs/RenderFormInput";

import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { TCrudType } from "types/types";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Done,
  Fingerprint,
  HowToReg,
} from "@mui/icons-material";
import BackButton from "components/buttons/BackButton";
import { object, string } from "yup";
import FormButtons from "components/render/buttons/FormButtons";
import DatePicker from "react-multi-date-picker";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

type Props = {
  handlePhoneFlag: () => void;
  userMoileId:string;
  setuserMoileId: (value:any) => void;
}

const BasicDataAuth: React.FC<Props> = ({ handlePhoneFlag,setuserMoileId,userMoileId }: Props) => {
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string[] | undefined>();

  const { mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const { data: cities, status, refetch } = useQuery<any, any, any, any>({
    queryKey: [`common-base-data/class-name/city`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res.data,
    // enabled: !!id,
    placeholderData: [
      {id:1,name:"tehran"},
      {id:2,name:"esfehan"}
    ],
  });
  const { data:provinces, status:provincesStatus, refetch:provincesRefetch } = useQuery<any, any, any, any>({
    queryKey: [`common-base-data/class-name/province`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res.data,
    // enabled: !!id,
    placeholderData: [
      {id:1,name:"tehran"},
      {id:2,name:"esfehan"}
    ],
  });
  // const cities = [
  //       {id:1,name:"tehran"},
  //       {id:2,name:"karaj"}
  //     ];
      // const provinces = [
      //   {id:1,name:"tehran"},
      //   {id:2,name:"esfehan"}
      // ]
  const [autocompleteValue, setAutocompleteValue] = useState<any>(undefined)    
  useEffect(() => {
    console.log("cities====>", cities)
  }, [cities])

  const handleBaseInfoSubmit = () => {
    let err="";
    // if(myData.idNumber?.length===undefined || myData?.idNumber?.length===10)err=err+"شماره شناسنامه باید ۱۰ رقم داشته باشد---"
    if(myData.nationalCode?.length===undefined || myData?.nationalCode?.length!==10)err=err+";کدملی باید ۱۰ رقم داشته باشد---"
    if(myData.postalCode?.length===undefined || myData?.postalCode?.length!==10)err=err+"کد پستی باید ۱۰ رقم داشته باشد---"
    if(myData.prefixPhone?.length===undefined || myData?.prefixPhone?.length!==3)err=err+"پیش شماره باید 3 رقم داشته باشد---"
    if(myData.phone?.length===undefined || myData?.phone?.length!==8)err+="شماره تلفن باید 8 رقم داشته باشد"

    if(err!==""){return snackbar(err,"error")}
    else
    mutate(
        {
          entity: `profiles`,
          method:userMoileId===""?"POST":"PUT",
          data: userMoileId===""?myData:{
            ...myData,
            id:userMoileId
          }
        } as any,
        {
          onSuccess: (res: any) => {
            setError(undefined)
            // if (res.message !== "ok"||res.message!=="صحیح است") {
            //   setError(res.message);
            // } else {
              console.log("submitted===>",res)
              snackbar("عملیات با موفقیت انجام شد", "success");
              setuserMoileId(res.data.id)
              handlePhoneFlag();
            // }
          },
          onError: () => snackbar("کد ملی شما در سامانه موجود می‌باشد", "error"),
        }
      );
  };

  

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  type DataType = {
    firstName: string | null;
    lastName: string | null;
    fatherName: string | null;
    birthDate: string | null;
    idNumber: string | null;
    nationalCode: string | null;
    address: string | null;
    postalCode: string | null;
    idExportDate: any | null;
    // contactNumber: string | null;
    cityId: string | null;
    provinceId: string | null;
    phone: string | null;
    prefixPhone: string | null;
  };
  const [myData, setMyData] = useState<DataType>({
    firstName: "",
    lastName: "",
    fatherName: "",
    birthDate: "",
    idNumber: "",
    nationalCode: "",
    address: "",
    postalCode: "",
    idExportDate: "",
    // contactNumber: null,
    cityId: "1",
    provinceId: "",
    phone: "",
    prefixPhone: "",
  });
  
useEffect(() => {
  console.log("mydata=>",myData)
}, [myData])

  const myPlaceHolder = {
    firstName: "نام خود را وارد نمایید",
    lastName: "نام خانوادگی را وارد نمایید",
    fatherName: "نام پدر خود را وارد نمایید",
    birthDate: "تاریخ تولد",
    idNumber: "شماره شناسنامه",
    nationalCode: "کد ملی",
    address: "آدرس خود را وارد نمایید",
    postalCode: "کد پستی خود را وارد نمایید",
    idExportDate: "تاریخ صدور",
    // contactNumber: "شماره موبایل خود را وارد نمایید",
    cityId: "شهر سکونت",
    provinceId: "استان سکونت",
    phone:"تلفن ثابت",
    prefixPhone:"۰۲۱"

    
  }
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [selectedProvince, setSelectedProvince] = useState<any>(null)

  const onSubmitHandler = (data: any) => {
    console.log("submitted");
    // const params = { ...data, commonBaseDataProvinceId: id };
    // setError(undefined);
    // mutate(
    //   {
    //     entity: `cities`,
    //     method: mode === "CREATE" ? "post" : "put",
    //     data: {
    //       ...(mode === "EDIT" ? { id: params?.id } : {}),
    //       ...params,
    //     },
    //   } as any,
    //   {
    //     onSuccess: (res: any) => {
    //       if (res.message !== "ok") {
    //         setError(res.message);
    //       } else {
    //         queryClient.refetchQueries({ queryKey: ["city"] });
    //         snackbar("عملیات با موفقیت انجام شد", "success");
    //       }
    //     },
    //     onError: () => snackbar("خطا در انجام عملیات", "error"),
    //   }
    // );
  };


  
  const baseInfoItems = [
    {
      name: "titleDivider",
      inputType: "titleDivider",
      label: "اطلاعات عمومی",
      size: { md: 12 },
    },
    { name: "firstName", inputType: "text", label: "نام", size: { md: 4 } },
    {
      name: "lastName",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 4 },
    },
    {
      name: "fatherName",
      inputType: "text",
      label: "نام پدر",
      size: { md: 4 },
    },
  ];
  const idInfoItems = [
    {
      name: "titleDivider",
      inputType: "titleDivider",
      label: "اطلاعات شناسنامه‌ای",
      size: { md: 12 },
    },
    
    {
      name: "idNumber",
      inputType: "text",
      label: "شماره شناسنامه",
      size: { md: 6 },
    },
    {
      name: "nationalCode",
      inputType: "text",
      label: " کد ملی",
      size: { md: 6 },
    },
    {
      name: "birthDate",
      inputType: "date",
      label: "تاریخ تولد",
      size: { md: 6 },
      elementProps: {
        setDay:(value:any)=>{
          console.log("setDay=========>",value)
          setMyData((prev)=>({
            ...prev,
            birthDate:value
          }))
        },
        value : myData?.birthDate
      }
      
    },
    {
      name: "idExportDate",
      inputType: "date",
      label: "تاریخ صدور",
      size: { md: 6 },
      elementProps: {
        setDay:(value:any)=>{
          console.log("setDay=========>",value)
          setMyData((prev)=>({
            ...prev,
            idExportDate:value
          }))
        }
      },
      value : myData?.idExportDate
    },
  ];

  const addressInfoItems = [
    // {
    //   name: "titleDivider",
    //   inputType: "titleDivider",
    //   label: "اطلاعات محل سکونت",
    //   size: { md: 12 },
    // },
    // { name: "cityId", inputType: "text", label: "شهر", size: { md: 6 } },
    // { name: "provinceId", inputType: "text", label: "استان", size: { md: 6 } },
    { name: "address", inputType: "text", label: "آدرس", size: { md: 12} },
    { name: "postalCode", inputType: "text", label: "کد پستی", size: { md: 5 } },
    { name: "phone", inputType: "text", label: "تلفن", size: { md: 5 }},
    { name: "prefixPhone", inputType: "text", label: "پیش شماره", size: { md: 2 } },
    
  ];
  return (
    <Grid container pl={3} pr={3} pb={3} spacing={4}>
      <Grid container item spacing={6} alignItems={"start"} xs={12} md={6} lg={6} xl={6}>
        <Grid container item spacing={3} md={12}>
          {baseInfoItems.map((item, itemKey) => (
            <Grid
              item
              key={item.name + itemKey}
              xs={12}
              md={item?.size?.md || 3}
            >
              <Controller
                name={item.name}
                control={control}
                render={({ field }) => {
                  return (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      {...field}
                      onChange={(e: any) => {
                        // if (!isNaN(e.target.value))
                        setMyData((previousState) => ({
                          ...previousState,
                          [item.name]: e.target.value,
                        }));
                      }}
                      value={
                        myData?.[item?.name as keyof DataType] != ""
                          ? myData?.[item.name as keyof DataType]
                          : ""
                      }
                      placeholder={myPlaceHolder?.[item.name as keyof DataType]}
                    />
                  );
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container item spacing={3} md={12}>
          {idInfoItems.map((item, itemKey) => (
            <Grid
              item
              key={item.name + itemKey}
              xs={12}
              md={item?.size?.md || 3}
            >
              <Controller
                name={item.name}
                control={control}
                render={({ field }) => {
                  return (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      {...field}
                      onChange={(e: any) => {
                        // if(item.name==="idExportDate")
                        //   console.log("event",e)
                        if(item.name==="idNumber"||item.name==="nationalCode")
                          if (isNaN(e.target.value))snackbar("لطفا برای این فیلد عدد وارد کنید","error")
                          else
                            setMyData((previousState) => ({
                              ...previousState,
                              [item.name]: e.target.value,
                            }));
                        // else
                        // setMyData((previousState) => ({
                        //   ...previousState,
                        //   [item.name]: e.target.value,
                        // }));    
                      }}
                      value={
                        myData?.[item?.name as keyof DataType] != ""
                          ? myData?.[item.name as keyof DataType]
                          : ""
                      }
                      placeholder={myPlaceHolder?.[item.name as keyof DataType]}
                    />
                  );
                }}
              />
            </Grid>
          ))}
          
        </Grid>
      </Grid>
      <Grid container item spacing={2} alignItems={"start"} xs={12} md={6} lg={6} xl={6}>
        <Grid container item spacing={3} md={12}>
          <Grid item xs={12} md={12}>
            <Typography >اطلاعات محل سکونت</Typography>
          </Grid>
          <Grid
              item
              xs={12}
              md={6}
            >
              <Autocomplete
              id="provinceId"
              onChange={(event:any,newValue:any)=>{
                if(newValue?.id)
                  // handleAutocomplete (newValue)
                setMyData((prev:any)=>({
                  ...prev,
                  provinceId:newValue.id
                }))
              }}
              renderOption={(props:any,option:any)=>(
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              value={autocompleteValue}
              inputValue={autocompleteValue}
              clearOnBlur
              options={
                provinces?.map((item:any)=>({id:item.id,name:item.value}))
              }
              getOptionLabel={(option:any)=>option.name}
              renderInput={(params)=><TextField {...params} label="انتخاب استان"/>}
              isOptionEqualToValue={(option:any,value:any)=>{
                return option.id === value.id
              }}
              />
            </Grid>
          <Grid
              item
              xs={12}
              md={6}
            >
              <Autocomplete
              id="cityId"
              onChange={(event:any,newValue:any)=>{
                if(newValue?.id)
                  // handleAutocomplete (newValue)
                setMyData((prev:any)=>({
                  ...prev,
                  cityId:newValue.id
                }))
              }}
              renderOption={(props:any,option:any)=>(
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              value={autocompleteValue}
              inputValue={autocompleteValue}
              clearOnBlur
              options={
                cities?.map((item:any)=>({id:item.id,name:item.value}))
              }
              getOptionLabel={(option:any)=>option.name}
              renderInput={(params)=><TextField {...params} label="انتخاب شهر"/>}
              isOptionEqualToValue={(option:any,value:any)=>{
                return option.id === value.id
              }}
              />
            </Grid>
          {addressInfoItems.map((item, itemKey) => (
            <Grid
              item
              key={item.name + itemKey}
              xs={12}
              md={item?.size?.md || 3}
            >
              <Controller
                name={item.name}
                control={control}
                render={({ field }) => {
                  return (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      {...field}
                      onChange={(e: any) => {
                        // if (!isNaN(e.target.value))
                        setMyData((previousState) => ({
                          ...previousState,
                          [item.name]: e.target.value,
                        }));
                      }}
                      value={
                        myData?.[item?.name as keyof DataType] != ""
                          ? myData?.[item.name as keyof DataType]
                          : ""
                      }
                      // defaultValue={myData?.[item.name as keyof DataType]}
                      placeholder={myPlaceHolder?.[item.name as keyof DataType]}
                    />
                  );
                }}
              />
            </Grid>
          ))}
          <Grid item md={12} display={"flex"} justifyContent={"flex-end"}>
            <Button
              onClick={handleBaseInfoSubmit}
              variant="contained"
              color="primary"
              size="large"
              sx={{width:"30%"}}
              endIcon={<Fingerprint />}
            >
              ثبت
            </Button>
          </Grid>
        </Grid>

        {error && <ErrorAlert text={error} />}
        {/* <Grid item mt={2} md={12} display={"flex"} justifyContent={"flex-end"}>
          <Button
            onClick={handlePhoneFlag}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            endIcon={<Fingerprint />}
          >
            ثبت
          </Button>
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default BasicDataAuth;
