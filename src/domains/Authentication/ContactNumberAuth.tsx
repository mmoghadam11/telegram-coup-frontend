import {
  Box,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  HowToReg,
} from "@mui/icons-material";
import BackButton from "components/buttons/BackButton";
import BasicDataAuth from "./BasicDataAuth";
import PhoneDataAuth from "./PhoneDataAuth";

const ContactNumberAuth = () => {

  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();

  //   const { data: apiData, status, refetch } = useQuery<any, any, any, any>({
  //     queryKey: [`plans`],
  //     queryFn: Auth?.serverCall_JSON_Server,
  //     select: (res: Partial<PlanningInterface>) => res,
  //     enabled: !!id,
  //     placeholderData: organizationSelection,
  //   });

  // const refetch = () => {
  //   console.log("refetch");
  // };

  const { mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  type DataType = {
    name: string;
    familyName: string;
    fatherName: string;
    birthDate: string;
    IDNumber: string;
    nationalCode: string;
    address: string;
    postCode: string;
    dateOfIssue: string;
    contactNumber: string;
    city: string;
    Province: string;
  };
  const [myData, setMyData] = useState<DataType>({
    name: "نام",
    familyName: "نام خانوادگی",
    fatherName: "نام پدر",
    birthDate: "تاریخ تولد",
    IDNumber: "شماره شناسنامه",
    nationalCode: "کد ملی",
    address: "آدرس",
    postCode: "کد پستی",
    dateOfIssue: "تاریخ صدور",
    contactNumber: "شماره موبایل",
    city: "شهر سکونت",
    Province: "استان سکونت",
  });

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
  //   const handleNext = () => {
  //     if (activeStep === steps.length - 1) navigate("/inspection-planning");
  //     else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   };

  //   const handleBack = () => {
  //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
  //   };

  //   const handleStep = (step: number) => () => {
  //     setActiveStep(step);
  //   };

  let status = "success";
  const [userMoileId, setuserMoileId] = useState("")
  const [phoneFlag, setPhoneflag] = useState(false);
  const handlePhoneFlag = () => {
    setPhoneflag(!phoneFlag);
  };
  return (
    <>
      {status === "loading" ? (
        <Skeleton height={300} />
      ) : (
        //  status === "error" ? (
        //   <ErrorHandler onRefetch={refetch}/>
        // ) :
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            borderRadius: "10px",
            marginTop: "20px",
            p: 2,
            width:phoneFlag?"65%":"90%" ,
          }}
          // backgroundColor: "#f5f5f5"
        >
          <Grid
            container
            item
            md={12}
            display="flex"
            justifyContent={"space-between"}
            mb={1}
          >
            <Box display={"flex"} alignItems={"center"}>
              <HowToReg fontSize="large" />
              <Typography component="h3" variant="h6">
                فرم احراز هویت کاربر
              </Typography>
            </Box>

            <BackButton onBack={() => navigate("/")} />
          </Grid>

          {!phoneFlag ? (
            <BasicDataAuth handlePhoneFlag={handlePhoneFlag} setuserMoileId={setuserMoileId} userMoileId={userMoileId}/>
          ) : (
            <PhoneDataAuth handlePhoneFlag={handlePhoneFlag} userMoileId={userMoileId} />
          )}



          {/* <FormButtons
          onBack={()=>console.log("back")}
          onSave={handleSubmit(onSubmitHandler)}
          isLoading={isLoading}
        /> */}
        </Box>
      )}
    </>
  );
};

export default ContactNumberAuth;
