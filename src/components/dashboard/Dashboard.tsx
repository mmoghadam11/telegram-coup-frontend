import {useQuery} from "@tanstack/react-query";
import {useAuth} from "hooks/useAuth";
import {useEffect, useState} from "react";
import {PAGINATION_DEFAULT_VALUE} from "../../shared/paginationValue";
import paramsSerializer from "../../services/paramsSerializer";
import {Box, Card, CardHeader} from "@mui/material";

const Dashboard = () => {
    const Auth = useAuth();
    const [filters, setFilters] = useState(PAGINATION_DEFAULT_VALUE);
    const {data, status, error} = useQuery<any, any, any>({
        // queryKey: ["common-base-types/class-name/province"],
        queryKey: [`organizations/${paramsSerializer(filters)}`],
        queryFn: Auth?.getRequest,
        select: (res: any) => res.data,
    } as any);

    useEffect(() => {
        if (status === 'error') {
        }
    }, [status, error]);
    return <Box>
        <h1>داشبورد</h1>
        <Card>
            <CardHeader>
                <h3>Organization</h3>
            </CardHeader>
            {JSON.stringify(data)}
        </Card>
    </Box>;
};

export default Dashboard;
