import React, { useEffect, useState } from "react";
import "./Login.css";
import Footer from "../component/Footer";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "hooks/useAuth";
import { useErrorHandler } from "../../../hooks/useErrorHandler";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("نام کاربری  را وارد نمایید"),
  password: Yup.string().required("رمز عبور را وارد نمایید "),
  captcha: Yup.string().required("کد امنیتی را وارد نمایید "),
});

const Login = () => {
  const { storeToken, setContract, storeRefreshToken } = useAuth();
  const { setNotification } = useErrorHandler();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [lockSendBtn, setLockSendBtn] = useState(false);
  const [captchaImage, setCaptchaImage] = useState();
  const [secCode, setSecCode] = useState();
  const [changePassword, setChangePassword] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/api/captcha/get-captcha", {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status == 200) {
          setSecCode(response.headers.get("y2fwdgnoyq"));
          setCaptchaImage(URL.createObjectURL(response.data));
        } else {
          setNotification(401, "خطا در دریافت کد امنیتی", "error");
        }
      })
      .catch((error) => {
        setNotification(401, "خطا در دریافت کد امنیتی", "error");
      });
  }, [refreshCount]);

  const login = async (username, password, captcha) => {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Y2FwdGNoYQ", secCode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        username: username,
        password: password,
        captcha: captcha,
      }),
    };

    fetch(
      process.env.REACT_APP_API_URL + "/api/auth/authenticate",
      requestOptions
    )
      .then((response) => {
        if (response.status == 200) {
          setNotification(200, "ورود موفق", "success");
        } else if (response.status == 401) {
          setNotification(401, "نام کاربری یا رمز عبور اشتباه است", "error");
        } else if (response.status == 402) {
          setNotification(402, "کد امنیتی اشتباه است", "error");
        } else if (response.status == 412) {
          setNotification(412, "کاربر فاقد نقش در سامانه است", "error");
        } else if (response.status == 416) {
          setNotification(416, "کاربر غیر فعال است", "error");
        } else {
          setNotification(404, "خطا در اتصال به سرور", "error");
        }
        return response.json();
      })
      .then(async (result) => {
        if (result?.status == 201) {
          setTempToken(result.token);
          setChangePassword(true);
          setNotification(
            200,
            "کاربر گرامی رمز عبور جدید خود را وارد کنید",
            "success"
          );
        } else if (result?.token) {
          // window.localStorage.setItem("keycloak", result.token);
          storeToken(result.token);
          storeRefreshToken(result?.token);
          setContract(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            null,
            null,
            null,
            false,
            false,
            false,
            ""
          );
          window.location.pathname = "/";
        }
      })
      .catch((error) => {})
      .finally(() => setRefreshCount(refreshCount + 1));
  };

  function resetPass(password, repeatPass) {
    if (password !== repeatPass) {
      setNotification("404", "رمز عبور با تکرار آن مطابقت ندارد", "error");
      return 0;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + tempToken);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    // myHeaders.append("Y2FwdGNoYQ", secCode)

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        password: password,
        secondPassword: repeatPass,
      }),
    };

    fetch(
      process.env.REACT_APP_API_URL + "/api/password/change-password",
      requestOptions
    )
      .then((response) => {
        if (response.status == 200) {
          setNotification(200, "ورود موفق", "success");
        } else if (response.status == 416) {
          setNotification(416, "کاربر غیر فعال است", "error");
        } else {
          setNotification(404, "خطا در اتصال به سرور", "error");
        }
        return response.json();
      })
      .then((result) => {
        if (result?.data) {
          // window.localStorage.setItem("keycloak", result.token);
          storeToken(tempToken);
          setContract(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            null,
            null,
            null,
            false,
            false,
            false,
            ""
          );
          window.location.pathname = "/";
        }
      })
      .catch((error) => {})
      .finally(() => setRefreshCount(refreshCount + 1));
  }

  function forgotPass(username) {
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
        `/api/auth/password-ignore?userName=${username}`,
      requestOptions
    )
      .then((response) => {
        if (response.status == 200) {
          setNotification(200, response?.data, "success");
        } else if (response.status == 401) {
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

  const onSubmit = (data) => {
    let { username, password, captcha } = data;
    if (forgotPassword) forgotPass(username);
    else login(username, password, captcha);
  };

  return (
    <div className="naeim-container">
      <div className=" loginFlexRow">
        <Box className="login flexLoginForm">
          <Box
            sx={{
              margin: "10px 0",
            }}
          >
            <Typography variant="h5">سامانه جامع</Typography>
            <Typography variant="h5">جامعه حسابداران رسمی ایران</Typography>
          </Box>
          <Box
            className="login__wrapper"
            sx={{
              width: "fit-content",
              color: (theme) => theme.palette.text.primary,
            }}
          >
            <FormControl fullWidth>
              {changePassword ? (
                <Box sx={{ marginBottom: "20px" }}>
                  <Typography variant="body1">انتخاب رمز عبور جدید</Typography>
                </Box>
              ) : forgotPassword ? (
                <Box sx={{ marginBottom: "20px" }}>
                  <Typography variant="body1">فراموشی رمز عبور</Typography>
                </Box>
              ) : null}
              {changePassword ? null : (
                <Box sx={{ marginBottom: "20px", width: "100%" }}>
                  <Controller
                    control={control}
                    name="username"
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="نام کاربری"
                        size="small"
                        error={errors.username?.message}
                        helperText={errors.username?.message}
                        fullWidth
                      />
                    )}
                  />
                </Box>
              )}
              {forgotPassword || changePassword ? null : (
                <Box sx={{ marginBottom: "10px" }}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type={showPassword ? "text" : "password"}
                        label="رمز عبور"
                        size="small"
                        error={errors.password?.message}
                        helperText={errors.password?.message}
                        fullWidth
                        InputProps={{
                          sx: { fontFamily: "Nazanin, sans-serif" },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              )}
              {changePassword ? (
                <>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Controller
                      control={control}
                      name="new-password"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={showPassword ? "text" : "password"}
                          label="رمز عبور جدید"
                          size="small"
                          error={errors.password?.message}
                          helperText={errors.password?.message}
                          fullWidth
                          InputProps={{
                            sx: { fontFamily: "Nazanin, sans-serif" },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Controller
                      control={control}
                      name="repeat-password"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={"password"}
                          label="تکرار رمز عبور"
                          size="small"
                          error={errors.password?.message}
                          helperText={errors.password?.message}
                          fullWidth
                          InputProps={{
                            sx: { fontFamily: "Nazanin, sans-serif" },
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              ) : null}
              {/* {forgotPassword || changePassword ? null : (
                <>
                  <Box
                    sx={{
                      marginTop: "20px",
                      marginBottom: "10px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={captchaImage} style={{ height: "80px" }} />
                    <Button
                      margin={"10px"}
                      onClick={() => setRefreshCount(refreshCount + 1)}
                    >
                      <Refresh />
                    </Button>
                  </Box>
                  <Box sx={{ marginBottom: "5px", width: "100%" }}>
                    <Controller
                      control={control}
                      name="captcha"
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="کد امنیتی"
                          size="small"
                          error={errors.username?.message}
                          helperText={errors.username?.message}
                          fullWidth
                          inputProps={{
                            sx: { fontFamily: "Nazanin, sans-serif" },
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )} */}

              <Box
                sx={{ margin: "10px 0px", width: "100%", textAlign: "center" }}
              >
                <Button
                  variant="contained"
                  disabled={lockSendBtn}
                  fullWidth
                  onClick={
                    changePassword
                      ? () =>
                          resetPass(
                            getValues()["new-password"],
                            getValues()["repeat-password"]
                          )
                      : forgotPassword
                      ? () => forgotPass(getValues()["username"])
                      : handleSubmit(onSubmit)
                  }
                >
                  <Typography variant="body1">
                    {changePassword
                      ? "ثبت رمز جدید"
                      : forgotPassword
                      ? "پیامک رمز عبور"
                      : "ورود"}
                  </Typography>
                </Button>
              </Box>
              {/* {forgotPassword || changePassword ? (
                <Box
                  sx={{
                    margin: "10px 0px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      setForgotPassword(false);
                      setChangePassword(false);
                      setRefreshCount(refreshCount + 1);
                    }}
                  >
                    بازگشت به صفحه ورود
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{ margin: "8px 0px", width: "100%", textAlign: "center" }}
                >
                  <Button onClick={() => setForgotPassword(true)}>
                    <Typography variant="body2">
                      رمز عبور خود را فراموش کرده اید؟
                    </Typography>
                  </Button>
                </Box>
              )} */}
            </FormControl>
          </Box>

          {/* <Box
          sx={{
            color: (theme) => theme.palette.text.primary,
            background: (theme) => theme.palette.background
          }}
        >
          <Typography variant='body2'>
            سامانه پاسخگویی
          </Typography>
          <Typography variant='body1'>
            021-45714444
          </Typography>
          <div >
            <a href="https://web.eitaa.com/#@Betaja_crm" target="_blank" style={{ color: '#0C9CE4', fontSize: '13px', marginTop: '5px', textAlign: 'center' }}>گفت و گوی آنلاین</a>
          </div>
        </Box> */}
        </Box>
        <Box className="loginbgimage" alignContent={"center"} textAlign={"center"}>
          <img
            id="betaja-img"
            src="/assets/images/Home0.png"
            alt="center"
            width="100%"
          />
          {/* <div id="loginbgimageContainer" ></div> */}
        </Box>

        <Footer />
      </div>
    </div>
  );
};

export default Login;
