import React, { useEffect, useState } from "react";
// import "./Login.css";
import Footer from "../component/Footer";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "hooks/useAuth";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { isMobile } from "react-device-detect";
import {
  TwoFactorAuth1FormItems,
  TwoFactorAuth2FormItems,
} from "./NewLoginFormItems";
import RenderFormInput from "components/render/formInputs/RenderFormInput";

// A single dynamic schema for validation

const NewLogin = () => {
  const { storeToken, setUserInfo, storeRefreshToken } = useAuth();
  const { setNotification } = useErrorHandler();

  const [formMode, setFormMode] = useState("2FA1"); // 'LOGIN', 'FORGOT_PASSWORD', 'CHANGE_PASSWORD',2FA1,2FA2
  const [showPassword, setShowPassword] = useState(false);
  const [lockSendBtn, setLockSendBtn] = useState(false);
  const [captchaImage, setCaptchaImage] = useState();
  const [refreshCount, setRefreshCount] = useState(0);
  const [tempToken, setTempToken] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const formItems1 = TwoFactorAuth1FormItems();
  const formItems2 = TwoFactorAuth2FormItems();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    // resolver: yupResolver(getValidationSchema(formMode)),
    defaultValues: {
      username: "",
      password: "",
      captcha: "",
      newPassword: "",
      repeatPassword: "",
      code: "",
    } as any,
  });

  useEffect(() => {
    reset();
    // if (formMode === 'LOGIN') {
    //   axios
    //     .get(process.env.REACT_APP_API_URL + "/api/captcha/get-captcha", { responseType: "blob" })
    //     .then((response) => {
    //       if (response.status === 200) {
    //         setSecCode(response.headers.get("y2fwdgnoyq"));
    //         setCaptchaImage(URL.createObjectURL(response.data));
    //       } else {
    //         setNotification(401, "خطا در دریافت کد امنیتی", "error");
    //       }
    //     })
    //     .catch(() => setNotification(401, "خطا در دریافت کد امنیتی", "error"));
    // }
  }, [formMode, refreshCount, reset]);

  // Your API functions are now integrated
  const login = async (username: string, password: string) => {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    // myHeaders.append("Y2FwdGNoYQ", secCode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        username: username,
        password: password,
        // captcha: captcha,
      }),
    };

    fetch(process.env.REACT_APP_API_URL + "auth/authenticate", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setNotification(200, "ورود موفق", "success");
        } else if (response.status === 401) {
          setNotification(401, "نام کاربری یا رمز عبور اشتباه است", "error");
        } else if (response.status === 402) {
          setNotification(402, "کد امنیتی اشتباه است", "error");
        } else if (response.status === 412) {
          setNotification(412, "کاربر فاقد نقش در سامانه است", "error");
        } else if (response.status === 416) {
          setNotification(416, "کاربر غیر فعال است", "error");
        } else {
          setNotification(404, "خطا در اتصال به سرور", "error");
        }
        return response.json();
      })
      .then(async (result) => {
        if (result?.status === 201) {
          setTempToken(result.access_token);
          setChangePassword(true);
          setNotification(
            200,
            "کاربر گرامی رمز عبور جدید خود را وارد کنید",
            "success"
          );
        } else if (result?.access_token) {
          // window.localStorage.setItem("keycloak", result.access_token);
          storeToken(result.access_token);
          storeRefreshToken(result?.refresh_token);
          localStorage.setItem("username", result.username);
          localStorage.setItem(
            "permission",
            JSON.stringify(result.permission || [])
          );
          localStorage.setItem(
            "director",
            result.userResponsibility.director || false
          );
          localStorage.setItem(
            "accessMenu",
            JSON.stringify(result.userResponsibility.director?[...result.accessMenu,"director-showmenu"]:result.accessMenu?? [])
          );
          setUserInfo({
            userId:result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            nationalCode: result.nationalCode,
            mobileNumber:result.mobileNumber,
          });
          // window.location.pathname = "/welcome";
        }
      })
      .catch((error) => {})
      .finally(() => setRefreshCount(refreshCount + 1));
  };
  const twoFactorAuthLogin1 = async (username: string, password: string) => {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    // myHeaders.append("Y2FwdGNoYQ", secCode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        username: username,
        password: password,
        // captcha: captcha,
      }),
    };
    setLockSendBtn(true)
    fetch(
      process.env.REACT_APP_API_URL + "auth/authenticate/request",
      requestOptions
    )
      .then((response) => {
        if (response.status === 200) {
          setLockSendBtn(false)
          setFormMode("2FA2");
          setNotification(200, "کد برای شما ارسال شد", "success");
        } else if (response.status === 401) {
          setNotification(401, "نام کاربری یا رمز عبور اشتباه است", "error");
        } else if (response.status === 402) {
          setNotification(402, "کد امنیتی اشتباه است", "error");
        } else if (response.status === 412) {
          setNotification(412, "کاربر فاقد نقش در سامانه است", "error");
        } else if (response.status === 416) {
          setNotification(416, "کاربر غیر فعال است", "error");
        } else if (response.status === 404) {
          setNotification(404, "خطا در اتصال به سرور", "error");
        } else {
          setNotification(500, "خطا در اطلاعات وارد شده", "error");
          setLockSendBtn(false)
        }
        return response.json();
      })
      .then(async (result) => {
        if (result?.status === 201) {
          setTempToken(result.access_token);
          setChangePassword(true);
          setNotification(
            200,
            "کاربر گرامی رمز عبور جدید خود را وارد کنید",
            "success"
          );
        } else {
          setSessionId(result?.sessionId);
        }
      })
      .catch((error) => {})
      .finally(() => setRefreshCount(refreshCount + 1));
  };
  const twoFactorAuthLogin2 = async (code: string) => {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    // myHeaders.append("Y2FwdGNoYQ", secCode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        code: code,
        sessionId: sessionId,
        // captcha: captcha,
      }),
    };

    fetch(
      process.env.REACT_APP_API_URL + "auth/authenticate/verify",
      requestOptions
    )
      .then((response) => {
        if (response.status === 200) {
          setNotification(200, "ورود موفق", "success");
        } else if (response.status === 401) {
          setNotification(401, "نام کاربری یا رمز عبور اشتباه است", "error");
        } else if (response.status === 402) {
          setNotification(402, "کد امنیتی اشتباه است", "error");
        } else if (response.status === 412) {
          setNotification(412, "کاربر فاقد نقش در سامانه است", "error");
        } else if (response.status === 416) {
          setNotification(416, "کاربر غیر فعال است", "error");
        } else {
          setNotification(404, "کد وارد شده صحیح نمیباشد", "error");
        }
        return response.json();
      })
      .then(async (result) => {
        if (result?.status === 201) {
          setTempToken(result.access_token);
          setChangePassword(true);
          setNotification(
            200,
            "کاربر گرامی رمز عبور جدید خود را وارد کنید",
            "success"
          );
        } else if (result?.access_token) {
          // window.localStorage.setItem("keycloak", result.access_token);
          storeToken(result.access_token);
          storeRefreshToken(result?.refresh_token);
          localStorage.setItem("username", result.username);
          localStorage.setItem(
            "permission",
            JSON.stringify(result.permission || [])
          );
          localStorage.setItem(
            "director",
            result.userResponsibility.director || false
          );
          localStorage.setItem(
            "accessMenu",
            JSON.stringify(result.userResponsibility.director?[...result.accessMenu,"director-showmenu"]:result.accessMenu?? [])
          );
          setUserInfo({
            userId:result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            nationalCode: result.nationalCode,
            mobileNumber:result.mobileNumber,
          });
          // window.location.pathname = "/welcome";
        }
      })
      .catch((error) => {})
      .finally(() => setRefreshCount(refreshCount + 1));
  };

  // function resetPass(password, repeatPass) {
  //   if (password !== repeatPass) {
  //     setNotification("404", "رمز عبور با تکرار آن مطابقت ندارد", "error");
  //     return 0;
  //   }

  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer " + tempToken);
  //   myHeaders.append("Content-Type", "application/json");
  //   myHeaders.append("Accept", "application/json");
  //   // myHeaders.append("Y2FwdGNoYQ", secCode)

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: JSON.stringify({
  //       password: password,
  //       secondPassword: repeatPass,
  //     }),
  //   };

  //   fetch(
  //     process.env.REACT_APP_API_URL + "/api/password/change-password",
  //     requestOptions
  //   )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setNotification(200, "ورود موفق", "success");
  //       } else if (response.status === 416) {
  //         setNotification(416, "کاربر غیر فعال است", "error");
  //       } else {
  //         setNotification(404, "خطا در اتصال به سرور", "error");
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       if (result?.data) {
  //         // window.localStorage.setItem("keycloak", result.token);
  //         storeToken(tempToken);
  //         setContract(
  //           "",
  //           "",
  //           "",
  //           "",
  //           "",
  //           "",
  //           "",
  //           "",
  //           null,
  //           null,
  //           null,
  //           false,
  //           false,
  //           false,
  //           ""
  //         );
  //         window.location.pathname = "/";
  //       }
  //     })
  //     .catch((error) => { })
  //     .finally(() => setRefreshCount(refreshCount + 1));
  // }

  function forgotPass(username: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
    };
    setLockSendBtn(true);
    fetch(
      process.env.REACT_APP_API_URL +
        `auth/password-ignore?userName=${username}`,
      requestOptions
    )
      .then((response: any) => {
        if (response.status === 200) {
          setNotification(200, response?.data, "success");
        } else if (response.status === 401) {
          setNotification(401, response?.data, "error");
        } else {
          setNotification(404, "خطا در اتصال به سرور", "error");
        }
        return response.json();
      })
      .then((result) => {
        setNotification(200, result?.data, "info");
      })
      .catch((error) => {
        setNotification(404, "error.response", "error");
      })
      .finally(() => {
        setLockSendBtn(false);
        setRefreshCount(refreshCount + 1);
      });
  }

  const handleFormSubmit = (data: any) => {
    switch (formMode) {
      case "LOGIN":
        login(data.username, data.password);
        break;
      case "2FA1":
        twoFactorAuthLogin1(data.username, data.password);
        break;
      case "2FA2":
        twoFactorAuthLogin2(data.code);
        break;
      case "FORGOT_PASSWORD":
        forgotPass(data.username);
        break;
      // case 'CHANGE_PASSWORD':
      //   resetPass(data.newPassword, data.repeatPassword);
      //   break;
      default:
        break;
    }
  };
  function renderFormFields() {
    switch (formMode) {
      case "LOGIN":
        return (
          <Grid container item spacing={2} justifyContent="center">
            {formItems1.map((item) => (
              <Grid item xs={11} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      // value={(formData as any)[item.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        //   handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        );
      case "2FA1":
        return (
          <Grid container item spacing={2} justifyContent="center">
            {formItems1.map((item) => (
              <Grid item xs={11} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      // value={(formData as any)[item.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        //   handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        );
      case "2FA2":
        return (
          <Grid container item spacing={2} justifyContent="center">
            {formItems2.map((item) => (
              <Grid item xs={11} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      // value={(formData as any)[item.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        //   handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        );

      case "FORGOT_PASSWORD":
        return (
          <Grid container item spacing={2} justifyContent="center">
            <Grid item xs={11}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="نام کاربری"
                    fullWidth
                    error={!!errors.username}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case "CHANGE_PASSWORD":
        return (
          <Grid container item spacing={2} justifyContent="center">
            <Grid item xs={11}>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label="رمز عبور جدید"
                    fullWidth
                    error={!!errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={11}>
              <Controller
                name="repeatPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="تکرار رمز عبور"
                    fullWidth
                    error={!!errors.repeatPassword}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  }

  const getFormTitle = () => {
    switch (formMode) {
      case "FORGOT_PASSWORD":
        return "فراموشی رمز عبور";
      case "CHANGE_PASSWORD":
        return "انتخاب رمز عبور جدید";
      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    switch (formMode) {
      case "FORGOT_PASSWORD":
        return "پیامک رمز عبور";
      case "CHANGE_PASSWORD":
        return "ثبت رمز جدید";
      case "2FA1":
        return "ارسال کد";
      default:
        return "ورود";
    }
  };
  const theme = useTheme();
  return (
    <Grid
      container
      justifyContent={{ xs: "center", md: "right" }}
      alignItems="center"
      sx={{
        width:"100vw",
        minHeight: "100svh",
        backgroundColor: theme.palette.mode === "light" ? "inherit" : "#1c1c1c",
      }}
    >
      <Grid
        container
        item
        md={4}
        xs={10}
        sm={8}
        // spacing={3}
        alignContent="center"
        mb={{xs:5,md:1}}
        justifyContent={"center"}
        display={"flex"}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor:
              theme.palette.mode === "light" ? "inherit" : "#2b2b2bff",
            p: 5,
            m: 1,
          }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6" fontSize={"large"}>
              سامانه اطلاعات
            </Typography>
            <Typography
              variant="h5"
              color={
                theme.palette.mode === "light"
                  ? "#023e8a"
                  : theme.palette.primary.main
              }
            >
              حسابداران رسمی
            </Typography>
            <Box
              height={"20vh"}
              sx={{
                my: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/assets/images/IACPA.Main_Logo.png"
                alt="center"
                style={{
                  width: "40%",
                  height: "auto",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} className="login__wrapper">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormControl fullWidth>
                <Grid container spacing={2} justifyContent="center">
                  {getFormTitle() && (
                    <Grid item xs={12} textAlign="center">
                      <Typography variant="body1">{getFormTitle()}</Typography>
                    </Grid>
                  )}

                  {renderFormFields()}

                  <Grid item xs={11}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={lockSendBtn}
                      endIcon={lockSendBtn?<CircularProgress size={24} color="inherit" />:null}
                    >
                      {getSubmitButtonText()}
                    </Button>
                  </Grid>

                  <Grid item xs={12} textAlign="center">
                    {(formMode !== "2FA1" && formMode !== "2FA2") ? (
                      <Button onClick={() => setFormMode("2FA1")}>
                        بازگشت به صفحه ورود
                      </Button>
                    ) : formMode === "2FA2" ? (
                      <Button onClick={() => setFormMode("2FA1")}>
                        بازگشت به مرحله قبل
                      </Button>
                    ):(
                      <Box>
                        <Button onClick={() => setFormMode("FORGOT_PASSWORD")}>
                          رمز عبور خود را فراموش کرده اید؟
                        </Button>
                        {/* <Button onClick={() => setFormMode("LOGIN")}>
                          ورود با روش قدیمی
                        </Button> */}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
            </form>
          </Grid>
        </Paper>
      </Grid>

      {!isMobile && (
        <Grid
          item
          md={6.5}
          sx={{
            display: { xs: "none", md: "block" },
            // , p: 7
          }}
        >
          {/* newlogin + P:7 */}
          <img
            src={
              theme.palette.mode === "light"
                ? "/assets/images/newLogo4.png"
                : "/assets/images/newLogoDark.jpg"
            }
            alt="center"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Grid>
      )}

      <Footer />
    </Grid>
  );
};

export default NewLogin;
