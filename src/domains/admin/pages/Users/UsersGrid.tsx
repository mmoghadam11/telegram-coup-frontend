import {
  AccountCircle,
  Close,
  Key,
  ManageAccounts,
  Verified,
} from "@mui/icons-material";
import { Avatar, Box, Chip, Grid, IconButton, Typography } from "@mui/material";
import { GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import AppendRole from "./components/AppendRole";
import AppendFirm from "./components/AppendFirm";
import SearchPannel from "components/form/SearchPannel";
import { UseGetProfileImage } from "hooks/useGetProfileImage";
import ProfileDialog from "components/ProfileDialog";
import { FormItem } from "types/formItem";
import NewSearchPannel from "components/form/NewSearchPannel";

type Props = {};

const UsersGrid = (props: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { isLoading, mutate, error } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("")
  const [openProfile, setOpenProfile] = useState<boolean>(false)
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    name: "",
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`user/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: roles,
    status: roles_status,
    refetch: roles_refetch,
  } = useQuery<any>({
    queryKey: [`role/find-by-name?size=10&page=1`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data?.content;
    },
    enabled: true,
  } as any);
  useEffect(() => {
    console.log("url",process.env.REACT_APP_Image_URL+"be69d0f0-46f7-4fe1-8bbe-ddb1cd829dca.jpg")
  }, [])
  
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "پروفایل",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        // const { avatarUrl } = UseGetProfileImage(row.username);
        return (
          <IconButton
          onClick={()=>{
            setCurrentAvatarUrl(row?.imageUrl)
            setOpenProfile(true)
          }}
          >
            <Avatar
              // src={avatarUrl ?? undefined}
              src={process.env.REACT_APP_Image_URL+row?.imageUrl }
              sx={{
                width: 40,
                height: 40,
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              <AccountCircle sx={{ width: 40, height: 40 }} color="inherit" />
            </Avatar>
          </IconButton>
        );
      },
    },
    { field: "username", headerName: "نام کاربر", flex: 2 },
    { field: "firstname", headerName: "نام", flex: 1 },
    { field: "lastname", headerName: "نام خانوادگی", flex: 1 },
    { field: "nationalCode", headerName: "کدملی", flex: 1 },
    {
      field: "active",
      headerName: "فعال",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.active)
          return <Chip label="فعال" icon={<Verified />} color="secondary" />;
        else return <Chip label="غیر فعال" icon={<Close />} color="error" />;
      },
    },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
            onEdit={() => {
              navigate(`${row.id}`, { state: { userData: row } });
            }}
            onAdd={{
              title: "افزودن نقش",
              function: () => {
                setEditeData(row);
                setAppendRoleFlag(true);
              },
            }}
            onManage={{
              title: "افزودن دسترسی",
              icon: <Key color="secondary" />,
              function: () => {
                setEditeData(row);
                setAppendFirmFlag(true);
              },
            }}
            onDelete={() => {
              setDeleteData(row);
              setDeleteFlag(true);
            }}
          />
        );
      },
    },
  ];
  interface SearchData {
    name: string;
    code: string;
  }
  
  const searchItems: FormItem[] = [
    {
      name: "firstname",
      inputType: "text",
      label: "نام",
      size: { md: 3 },
    },
    {
      name: "lastname",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 3 },
    },
    {
      name: "nationalCode",
      inputType: "text",
      label: "کدملی",
      size: { md: 3 },
    },
    {
      name: "searchRolePersianName",
      inputType: "autocomplete",
      label: "نقش",
      size: { md: 3 },
      options: roles?.map((item: any) => ({
        value: item.persianName,
        title: item.persianName,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
  ];
  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [appendRoleFlag, setAppendRoleFlag] = useState(false);
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        m={2}
        mb={0}
      >
        <Box display={"flex"}>
          <ManageAccounts fontSize="large" />
          <Typography variant="h5">مدیریت کاربران</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="کاربر"
            onClick={() => navigate("new")}
          />
          <BackButton onBack={() => navigate(-1)} />
        </Box>
      </Grid>
      <NewSearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" ? (
          isMobile ? (
            <VerticalTable
              rows={StatesData?.content}
              columns={columns}
              filters={filters}
              setFilters={setFilters}
              rowCount={StatesData?.totalElements}
            />
          ) : (
            <TavanaDataGrid
              rows={StatesData?.content}
              columns={columns}
              filters={filters}
              setFilters={setFilters}
              rowCount={StatesData?.totalElements}
              // rowHeight={25}
              getRowHeight={() => "auto"}
              autoHeight
              hideToolbar
              // slots={{ toolbar: GridToolbar }}
              // slotProps={{
              //   toolbar: {
              //     csvOptions: { disableToolbarButton: true },
              //   },
              // }}
            />
          )
        ) : null}
      </Grid>
      <ProfileDialog
      open={openProfile}
      onClose={()=>setOpenProfile(false)}
      currentAvatarUrl={currentAvatarUrl}
      />
      <AppendRole
        refetch={StatesData_refetch}
        appendRoleFlag={appendRoleFlag}
        setAppendRoleFlag={setAppendRoleFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      <AppendFirm
        refetch={StatesData_refetch}
        appendFirmFlag={appendFirmFlag}
        setAppendFirmFlag={setAppendFirmFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `user/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`کاربر انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف ${deleteData?.firstname} ${deleteData?.lastname} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default UsersGrid;
