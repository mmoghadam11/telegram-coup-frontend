import React, {useEffect, useState} from 'react'
import {useMutation, useQuery} from '@tanstack/react-query';
import {useAuth} from 'hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import {useErrorHandler} from 'hooks/useErrorHandler';
import {
    autocompleteClasses,
    Box,
    Button,
    Checkbox,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import DisabledTextInput from 'components/textInput/DisabledTextInput';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import MemberList from '../components/MemberList';

const Password = () => {
    const Auth = useAuth();
    const navigate = useNavigate()
    const {setNotification} = useErrorHandler();
    const [selectedNationalCode, setSelectedNationalCode] = useState('');
    const [password, setPassword] = useState("");
    const [disabledUser, setDisabledUser] = useState(false);
    const [passwordMustChange, setPasswordMustChange] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const {data, status, error} = useQuery<any, any, any>({
        queryKey: [process.env.REACT_APP_API_URL + `/api/users/user-name/${selectedNationalCode}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
        enabled: selectedNationalCode?.length === 10,
    } as any);

    const {isLoading, mutate, error: passwordError} = useMutation({
        mutationFn: Auth?.serverCall,
    });

    useEffect(() => {
        if (data?.enabledUser) {
            setDisabledUser(!data?.enabledUser);
        }
        if (data?.passwordMustChange) {
            setPasswordMustChange(!!data?.passwordMustChange);
        }
    }, [
        data,
    ])

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
                    ...data,
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
        // <Box margin={"20px"}>
        //     <Grid container spacing={2}>
        //         <Grid item xs={12}>
        //             <Typography variant='h5'>
        //                 تغییر رمز عبور کاربران
        //             </Typography>
        //         </Grid>
        //         <Grid item xs={12}></Grid>
        //         <Grid item xs={12} md={4} lg={3}>
        //             <TextField
        //                 id="nationalCode"
        //                 label="کد ملی کاربر"
        //                 value={selectedNationalCode}
        //                 onChange={(event: any) => {
        //                     setSelectedNationalCode(event.target.value);
        //                 }}
        //                 autoComplete='off'
        //                 inputProps={{
        //                     autocomplete: 'password',
        //                     form: {
        //                         autocomplete: 'off',
        //                     },
        //                 }}
        //                 fullWidth
        //             ></TextField>
        //         </Grid>
        //         <Grid item xs={12} md={4} lg={3}>
        //             {
        //                 data ?
        //                     <DisabledTextInput label={"نام و نام خانوادگی"}
        //                                        value={data?.firstName + ' ' + data?.lastName}/>
        //                     : null
        //             }
        //         </Grid>
        //         <Grid item xs={12}/>
        //         <Grid item xs={12} md={4} lg={3}>
        //             <TextField
        //                 autoComplete='off'
        //                 id="password"
        //                 label="رمز عبور جدید"
        //                 type={showPassword ? "text" : "password"}
        //                 value={password}
        //                 onChange={(event: any) => {
        //                     setPassword(event?.target?.value);
        //                 }}
        //                 fullWidth
        //                 inputProps={{
        //                     endAdornment: (
        //                         <InputAdornment position="end">
        //                             <IconButton
        //                                 aria-label="toggle password visibility"
        //                                 onClick={() => setShowPassword(!showPassword)}
        //                                 edge="end"
        //                             >
        //                                 {showPassword ? <VisibilityOff/> : <Visibility/>}
        //                             </IconButton>
        //                         </InputAdornment>
        //                     ),
        //                     autocomplete: 'new-password',
        //                     form: {
        //                         autocomplete: 'off',
        //                     },
        //                 }}
        //             ></TextField>
        //         </Grid>
        //         <Grid item xs={12} md={4} lg={3}>
        //             <TextField
        //                 id="repeat-password"
        //                 type='password'
        //                 label="تکرار رمز عبور جدید"
        //                 value={repeatPassword}
        //                 onChange={(event: any) => {
        //                     setRepeatPassword(event?.target?.value);
        //                 }}
        //                 autoComplete="off"
        //                 inputProps={{
        //                     autocomplete: 'new-password',
        //                     form: {
        //                         autocomplete: 'off',
        //                     },
        //                 }}
        //                 fullWidth
        //             ></TextField>
        //         </Grid>
        //         <Grid item xs={12}></Grid>
        //         <Grid item xs={12} md={4} lg={3}>
        //             <Checkbox name='enabledUser'
        //                         size="small"
        //                         checked={disabledUser}
        //                         onChange={(event, checked) => {
        //                             setDisabledUser(checked)
        //                         }} />
        //             {'غیر فعال ساختن کاربر'}
        //         </Grid>
        //         <Grid item xs={12} md={6} lg={4}>
        //             <Checkbox name='passwordMustChange'
        //                         size="small"
        //                         checked={passwordMustChange}
        //                         onChange={(event, checked) => {
        //                             setPasswordMustChange(checked)
        //                         }} />
        //             {'رمز عبور خود را در ورود بعدی تغییر دهد'}
        //         </Grid>
        //         <Grid item xs={12}></Grid>
        //         <Grid item xs={12} md={4} lg={3}>
        //             <Button
        //                 variant='contained'
        //                 type="button"
        //                 onClick={changePassword}
        //             >
        //                 ثبت تغییرات
        //             </Button>
        //         </Grid>
        //     </Grid>
        // </Box>
        <MemberList/>
    );
}

export default Password;