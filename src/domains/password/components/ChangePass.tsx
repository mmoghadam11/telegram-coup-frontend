import { LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import { Grid, Typography, Button, Modal, TextField, Checkbox, IconButton, InputAdornment, Paper } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import DisabledTextInput from 'components/textInput/DisabledTextInput';
import { useAuth } from 'hooks/useAuth';
import { useErrorHandler } from 'hooks/useErrorHandler';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


type Props = {
    open: boolean,
    handleClose: () => void,
    // handleOpen: () => void
    nationalCode: string | null
}
const ChangePass = ({ open, handleClose, nationalCode }: Props) => {
    const Auth = useAuth();
    const navigate = useNavigate()
    const { setNotification } = useErrorHandler();
    const [selectedNationalCode, setSelectedNationalCode] = useState(nationalCode ?? '');
    const [password, setPassword] = useState("");
    const [disabledUser, setDisabledUser] = useState(false);
    const [passwordMustChange, setPasswordMustChange] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!!nationalCode) setSelectedNationalCode(nationalCode)
    }, [nationalCode])

    const { data: userData, status, error } = useQuery<any, any, any>({
        queryKey: [`/users/user-name/${selectedNationalCode}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
        enabled: selectedNationalCode?.length === 10,
    } as any);
    const { isLoading, mutate, error: passwordError } = useMutation({
        mutationFn: Auth?.serverCall,
    });
    useEffect(() => {
        if(userData){
            setDisabledUser(!userData.enabledUser)
            setPasswordMustChange(userData.passwordMustChange)
        }
    }, [userData])

    const changePassword = () => {
        if (password !== repeatPassword) {
            setNotification("404", "رمز عبور با تکرار آن مطابقت ندارد", 'error')
            return 0
        }
        mutate(
            {
                entity: process.env.REACT_APP_API_URL + `/api/users`,
                method: "put",
                data: {
                    ...userData,
                    password,
                    enabledUser: !disabledUser,
                    passwordMustChange
                }
            },
            {
                onSuccess: (res: any) => {
                    if (res?.data) {
                        setNotification(200, "تغییر رمز با موفقیت", "success")
                        // Auth?.setUserInfo({
                        //     ...Auth?.userInfo,
                        //     // confirmSelection: true
                        // })
                    } else {
                        setNotification(404, "خطا در عملیات", "error")
                    }
                },
                onError: (err) => {
                    setNotification(404, "خطا در عملیات", "error")
                }
            }
        );
    }





    return (

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ m: 4, alignContent: "center", width: "60%", margin: "auto" }}
        >
            <Paper elevation={3}>
                <Grid container spacing={2} p={3}>
                    <Grid item xs={12} display={"flex"} alignItems={"center"}>
                        <LockReset fontSize='large' />
                        <Typography variant='h6'>
                            تغییر رمز عبور کاربر
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} item xs={12} md={11} justifyContent={"center"} textAlign={"center"}>
                        <Grid item xs={12} md={6} lg={5}>
                            <TextField
                                id="nationalCode"
                                label="کد ملی کاربر"
                                value={selectedNationalCode}
                                onChange={(event: any) => {
                                    setSelectedNationalCode(event.target.value);
                                }}
                                autoComplete='off'
                                inputProps={{
                                    autocomplete: 'password',
                                    form: {
                                        autocomplete: 'off',
                                    },
                                }}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            {

                                <DisabledTextInput label={"نام و نام خانوادگی"}
                                    value={userData?.firstName + ' ' + userData?.lastName} />

                            }
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} md={6} lg={5}>
                            <TextField
                                autoComplete='off'
                                id="password"
                                label="رمز عبور جدید"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event: any) => {
                                    setPassword(event?.target?.value);
                                }}
                                fullWidth
                                inputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    autocomplete: 'new-password',
                                    form: {
                                        autocomplete: 'off',
                                    },
                                }}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            <TextField
                                id="repeat-password"
                                type='password'
                                label="تکرار رمز عبور جدید"
                                value={repeatPassword}
                                onChange={(event: any) => {
                                    setRepeatPassword(event?.target?.value);
                                }}
                                autoComplete="off"
                                inputProps={{
                                    autocomplete: 'new-password',
                                    form: {
                                        autocomplete: 'off',
                                    },
                                }}
                                fullWidth
                            ></TextField>
                        </Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12} md={4} lg={5}>
                            <Checkbox name='enabledUser'
                                size="small"
                                checked={disabledUser}
                                onChange={(event, checked) => {
                                    setDisabledUser(checked)
                                }} />
                            {'غیر فعال ساختن کاربر'}
                        </Grid>
                        <Grid item xs={12} md={6} lg={7}>
                            <Checkbox name='passwordMustChange'
                                size="small"
                                checked={passwordMustChange}
                                onChange={(event, checked) => {
                                    setPasswordMustChange(checked)
                                }} />
                            {'رمز عبور خود را در ورود بعدی تغییر دهد'}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}></Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Button
                            variant='contained'
                            type="button"
                            onClick={changePassword}
                        >
                            ثبت تغییرات
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

        </Modal>

    );
}

export default ChangePass;