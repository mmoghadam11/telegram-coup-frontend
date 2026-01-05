import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { BarChart, blueberryTwilightPalette, cheerfulFiestaPalette, mangoFusionPalette, PieChart } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import ErrorHandler from 'components/errorHandler/ErrorHandler';
import { useAuth } from 'hooks/useAuth';
import React from 'react'
import { ResponsiveContainer } from 'recharts';

const Admin = () => {
    const Auth = useAuth()
    const color_array = [blueberryTwilightPalette, mangoFusionPalette, cheerfulFiestaPalette]

    
    const { data, status, refetch } = useQuery<any>({
        queryKey: [process.env.REACT_APP_API_URL + `/api/members/find-amar`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
            return res?.data
        },
    } as any);
    
    let data_1 = ['در انتظار شروع انتخاب واحد', 'در انتظار تایید نهایی', 'تایید نهایی واحد']
    let data_1_values = [data?.remiedMaster, data?.waitingMaster, data?.finalMaster]

    let data_2 =  ['تایید شرکا', 'عدم تایید شرکا']
    let data_2_values = [data?.okPartners, data?.waitingPartners]

    let data_3 =  [
        { id: 0, value: data?.finialMember, label: 'تکمیل شده',}, 
        { id: 1, value: data?.remiedMember, label: 'تکمیل نشده'},
    ]

    let data_4 =  [
        { id: 0, value: data?.regesterMembers, label: 'ثبت نام شده',}, 
        { id: 1, value: data?.notRegesterMembers, label: 'ثبت نام نشده'},
    ]
    
    return (
        <Box margin={"20px"}>
            <Grid container spacing={2} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12}>
                    <Typography variant='h5'>
                        پنل ادمین
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        status == "loading" ?
                        <CircularProgress /> :
                        status == "error" ?
                        <ErrorHandler onRefetch={refetch} /> :
                        status == "success" ? null : null
                    }
                </Grid>

                <Grid item xs={12} md={8} lg={5}>
                    <Paper elevation={2} sx={{width: "100%"}}>
                        
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12} marginTop={"10px"}>
                                <Typography variant='h6'>
                                    وضعیت انتخاب واحد نمایندگان
                                </Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={"10px"}>
                                {data_1.map((title, idx) => {
                                    return (
                                        <Typography variant='body2'>
                                            {title} : {data_1_values[idx]}
                                        </Typography>
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: data_1 }]}
                                        series={[{ data: data_1_values }]}
                                        // sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: "0.9em" } }}
                                        colors={color_array[0]("dark").slice(4)} 
                                        />
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={5}>
                    <Paper elevation={2} sx={{width: "100%"}}>
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12} marginTop={"10px"}>
                                <Typography variant='h6'>
                                وضعیت تایید شرکا
                                </Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={"10px"}>
                                {data_2.map((title, idx) => {
                                    return (
                                        <Typography variant='body2'>
                                            {title} : {data_2_values[idx]}
                                        </Typography>
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: data_2 }]}
                                        series={[{ data: data_2_values }]}
                                        // sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: "0.9em" } }}
                                        colors={color_array[1]("dark").slice(2)}                            
                                    />
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={5}>
                    <Paper elevation={2} sx={{width: "100%"}}>
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12} marginTop={"10px"}>
                                <Typography variant='h6'>
                                وضعیت انتخاب واحد اعضا
                                </Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={"10px"}>
                                {data_3.map((title, idx) => {
                                    return (
                                        <Typography variant='body2'>
                                            {title.label} : {title.value}
                                        </Typography>
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart
                                        series={[{ data: data_3 }]}
                                        // sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: "0.9em" } }}
                                        colors={color_array[2]("dark").slice(1)}                            
                                    />
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={5}>
                    <Paper elevation={2} sx={{width: "100%"}}>
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12} marginTop={"10px"}>
                                <Typography variant='h6'>
                                وضعیت ثبت نام اعضا
                                </Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={"10px"}>
                                {data_4.map((title, idx) => {
                                    return (
                                        <Typography variant='body2'>
                                            {title.label} : {title.value}
                                        </Typography>
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart
                                        series={[{ data: data_4 }]}
                                        // sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: "0.9em" } }}
                                        colors={color_array[2]("dark").slice(6)}                            
                                    />
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Admin