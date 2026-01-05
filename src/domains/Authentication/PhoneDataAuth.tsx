import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
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
  DeviceUnknown,
  Done,
  EditNote,
  Fingerprint,
  HowToReg,
  Send,
} from "@mui/icons-material";
import BackButton from "components/buttons/BackButton";
import { object, string } from "yup";
import FormButtons from "components/render/buttons/FormButtons";

type Props = {
  handlePhoneFlag: () => void;
  userMoileId:string
};
const PhoneDataAuth = ({ handlePhoneFlag,userMoileId }: Props) => {
  const navigate = useNavigate();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string[] | undefined>();
  const [smsSendingFlag, setSmsSendingFlag] = useState(false);
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

  type updateMobileType = {
    mobile:string,
    id:string,
  };
  type acceptMobileType = {
    mobile:string,
    id:string,
  };
  const [mobile, setMobile] = useState<string>("");
  const [idCode, setIdCode] = useState<string>("");
  useEffect(() => {
    console.log(mobile)
  }, [mobile])
  

  const handleUpdateMobile = () => {
    let err="";
    // if(myData.nationalCode?.length===undefined || myData?.nationalCode?.length!==10)err=err+";کدملی باید ۱۰ رقم داشته باشد---"

    // if(err!==""){return snackbar(err,"error")}
    // else
    mutate(
        {
          entity: `profiles/update-mobile?mobile=${mobile}&id=${userMoileId}`,
          method:"PUT",
          // data: {
          //   mobile:mobile,
          //   id:userMoileId
          // }
        } as any,
        {
          onSuccess: (res: any) => {
            // if (res.message !== "ok") {
            //   setError(res.message);
            // } else {
              console.log("update-mobile---submitted===>",res)
              snackbar("عملیات با موفقیت انجام شد", "success");
            // }
            setSmsSendingFlag(!smsSendingFlag)
          },
          onError: () => snackbar("خطا در انجام عملیات", "error"),
        }
      );
  };
  const handleAcceptMobile = () => {
    let err="";
    // if(myData.nationalCode?.length===undefined || myData?.nationalCode?.length!==10)err=err+";کدملی باید ۱۰ رقم داشته باشد---"

    if(err!==""){return snackbar(err,"error")}
    else
    mutate(
        {
          entity: `profiles/accept-mobile?idCode=${idCode}&id=${userMoileId}`,
          method:"GET",
        } as any,
        {
          onSuccess: (res: any) => {
            // if (res.message !== "ok") {
            //   setError(res.message);
            // } else {
              console.log("update-mobile---submitted===>",res)
              snackbar("تبریک! احراز هویت شما با موفقیت انجام شد", "success");
              const succesTimer = setInterval(() => {
                navigate("/")
              }, 5000);
            // }
          },
          onError: () => snackbar("خطا در انجام عملیات", "error"),
        }
      );
  };
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

  const phoneNumberItems = [
    {
      name: "titleDivider",
      inputType: "titleDivider",
      label: "شماره موبایل خود را وارد کنید",
      size: { md: 12 },
    },
    {
      name: "mobile",
      inputType: "text",
      label: "شماره موبایل",
      size: { md: 12 },
    },
  ];
  const verificationCodeItems = [
    {
      name: "titleDivider",
      inputType: "titleDivider",
      label: "کد ارسالی به موبایل خود را وارد نمایید",
      size: { md: 12 },
    },
    {
      name: "idCode",
      inputType: "text",
      label: "کد ارسالی",
      size: { md: 12 },
    },
  ];

  const [progress, setProgress] = useState(0);
  React.useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      );
    }, 600);

    return () => {
      clearInterval(timer);
    };
  }, [smsSendingFlag]);
  return (
    <Grid container pl={3} pr={3} spacing={1} justifyContent={"center"}>
      {!smsSendingFlag ? (
        <Grid container item xs={12} md={12} lg={6} xl={7}>
          <Grid container item md={12} spacing={1}>
            {phoneNumberItems.map((item, itemKey) => (
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
                          if (!isNaN(e.target.value))
                            setMobile((previousState) => (e.target.value));
                        }}
                        value={
                          mobile
                        }
                        // defaultValue={myData?.[item.name as keyof DataType]}
                      />
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent={"center"}
          spacing={4}
          item
          xs={12}
          md={7}
          lg={7}
          xl={7}
        >
          <Grid container item justifyContent={"center"} md={12} spacing={1}>
            {verificationCodeItems.map((item, itemKey) => (
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
                          if (!isNaN(e.target.value))
                            setIdCode((previousState) => (e.target.value));;
                        }}
                        value={idCode}
                        // defaultValue={myData?.[item.name as keyof DataType]}
                      />
                    );
                  }}
                />
              </Grid>
            ))}
            <Grid item md={12} spacing={1} textAlign={'center'}>
              <CircularProgress variant="determinate" value={progress} sx={{margin:"Auto"}}/>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid container item spacing={4} xs={12} md={7} lg={7} xl={7}>
        {error && <ErrorAlert text={error} />}
        <Grid container item md={12} spacing={3}>
          {smsSendingFlag ? (
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Button
                onClick={handleAcceptMobile}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<Fingerprint />}
              >
                بررسی کد
              </Button>
            </Grid>
          ) : null}
          {
            !smsSendingFlag ?<Grid item xs={12} sm={12} md={6} lg={6}>
            <Button
              onClick={handleUpdateMobile}
              variant="contained"
              color={smsSendingFlag ? "secondary" : "primary"}
              size="large"
              fullWidth
              startIcon={<Send />}
            >
              ارسال کد
            </Button>
          </Grid>:<Grid item xs={12} sm={12} md={6} lg={6}>
            <Button
              onClick={() => setSmsSendingFlag(!smsSendingFlag)}
              variant="contained"
              color={smsSendingFlag ? "secondary" : "primary"}
              size="large"
              fullWidth
              startIcon={<DeviceUnknown />}
            >
              تصحیح شماره موبایل
            </Button>
          </Grid>
          }
          
          
          {!smsSendingFlag ? (
            <Grid item xs={12} sm={12} md={6}>
              <Button
                onClick={handlePhoneFlag}
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                startIcon={<EditNote />}
              >
                تصحیح اطلاعات کلی
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PhoneDataAuth;
