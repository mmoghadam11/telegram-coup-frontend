import { Check, Close, ManageAccounts, Visibility, VisibilityOff } from '@mui/icons-material';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Grid, Typography, Button, Dialog, Modal, TextField, ButtonGroup, Chip, Checkbox, IconButton, InputAdornment } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import BackButton from 'components/buttons/BackButton';
import TavanaDataGrid from 'components/dataGrid/TavanaDataGrid';
import ErrorHandler from 'components/errorHandler/ErrorHandler';
import DisabledTextInput from 'components/textInput/DisabledTextInput';
import { useAuth } from 'hooks/useAuth';
import { useErrorHandler } from 'hooks/useErrorHandler';
import moment from 'jalali-moment';
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import paramsSerializer from 'services/paramsSerializer';
import { PAGINATION_DEFAULT_VALUE } from 'shared/paginationValue';
import { IBaseInfo } from 'types/baseInfo';
import { IQueryParamFilter } from 'types/types';
import ChangePass from './ChangePass';

const MemberList = () => {
    const Auth = useAuth();

    const [filters, setFilters] = useState<IQueryParamFilter<IBaseInfo>>(PAGINATION_DEFAULT_VALUE);
    const [nationalCode, setNationalCode] = useState<any>()
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [disabledUser, setDisabledUser] = useState(false);
    const [passwordMustChange, setPasswordMustChange] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("")
    const {setNotification} = useErrorHandler();
    const {isLoading, mutate, error: passwordError} = useMutation({
            mutationFn: Auth?.serverCall,
        });

    const [selectedMemberId, setSelectedMemberId] = useState()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false) };
    const navigate = useNavigate();

    const [listState, setListState] = useState(0)

    const { data: logs, status: logs_status, refetch: logs_refetch } = useQuery<any>({
        queryKey: [`/members${paramsSerializer(filters)}${!!nationalCode ? '&nationalCode=' + nationalCode : ''}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
    } as any);
    // const { data: userData, status, error } = useQuery<any, any, any>({
    //     queryKey: [`/users/user-name/${nationalCode}`],
    //     queryFn: Auth?.getRequest,
    //     select: (res: any) => {
    //         return res?.data
    //     },
    //     enabled: nationalCode?.length === 10,
    // } as any);
    // useEffect(() => {
    //     setSelectedUser(userData)
    // }, [userData])


    const { data: units, status: units_status, refetch: order_refetch } = useQuery<any>({
        queryKey: [process.env.REACT_APP_API_URL + `/api/unit-selections/find-member/${selectedMemberId}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
        enabled: !!selectedMemberId
    } as any);

    const { data: allocs, status: allocs_status, refetch: allocs_refetch } = useQuery<any>({
        queryKey: [process.env.REACT_APP_API_URL + `/api/unit-selections/compare-unit-allocate/${selectedMemberId}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
        enabled: !!selectedMemberId
    } as any);

    const columns: GridColDef[] = [
        // { field: 'contractNumber', headerName: 'کد واحد', flex: 1, },
        {
            field: 'memberName', headerName: 'نام عضو', flex: 2,
            renderCell: ({ row }: any) => row?.firstName + " " + row?.lastName
        },
        { field: 'nationalCode', headerName: 'کد ملی', flex: 2 },
        // {
        //     field: 'master', headerName: 'نماینده', flex: 1,
        //     renderCell: ({ row }: any) => row?.master ? <Check /> : <Close />
        // },
        
        { field: 'mobileNumber', headerName: 'شماره موبایل', flex: 2 },
        { field: 'projectName', headerName: 'نام پروژه', flex: 2 },
        { field: 'selectionOrder', headerName: "اولویت کاربر", flex: 1 },

        {
            field: 'func', headerName: 'تغییر رمز عبور', flex: 1,
            renderCell: ({ row }: any) => {
                return <Button size='small' variant='contained' onClick={() => {
                    setSelectedUser(row);
                    handleOpen();
                }}>
                    انتخاب
                </Button>
            }
        },
    ];

    return (
        <Box margin={"20px"}>
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={11} display={"flex"} justifyContent={"space-between"}>
                    <Box display={"flex"} alignItems={"center"} sx={{ mb: 2 }}>
                        <ManageAccounts fontSize='large'/>
                        <Typography component="h3" variant="h6">
                            مدیریت کاربران
                        </Typography>
                    </Box>
                    <BackButton text="بازگشت" onBack={() => navigate("/")} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container display={"flex"} justifyContent={'center'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <Typography variant='body2'>
                                جستجوی شماره اعضا
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="nationalCode"
                                label="کد ملی عضو"
                                value={nationalCode}
                                onChange={(event: any) => {
                                    setNationalCode(event.target.value);
                                }}
                            ></TextField>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={11}>
                    {logs_status === "error" ? (
                        <ErrorHandler onRefetch={logs_refetch} />
                    ) : logs_status === "success" ? (
                        //@ts-ignore
                        <TavanaDataGrid
                            rows={logs?.rows}
                            columns={columns}
                            setFilters={setFilters}
                            filters={filters}
                            rowCount={logs?.count}
                            autoHeight
                        // paginationModel={paginationModel}
                        // onPaginationModelChange={setFilters}
                        // paginationMode="server"
                        />
                    ) : null}
                </Grid>
            </Grid>
            {
                selectedUser?<ChangePass open={open} handleClose={handleClose} nationalCode={selectedUser?.nationalCode}/>
                :null
            }
            
        </Box>
    );
}

export default MemberList;