import React, { useEffect } from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import { Outlet, useNavigate } from "react-router-dom";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Carousel from "components/Carousel/Carousel";
import EmblaCarousel from "components/Carousel/EmblaCarouselWithScaleAndLazy";
import { useAuthorization } from "hooks/useAutorization";
import { AccountBalance, BusinessCenter, People } from "@mui/icons-material";
interface CarouselItem {
  id: number;
  title: string;
  image: string;
  description: string;
}
interface MenuItem {
  title: string;
  icon?: React.ReactElement;
  url: string;
  description: string;
  access?: string[];
}
const menuItems: MenuItem[] = [
  {
    title: "احکام انتظامی",
    url: "IACPA/disciplinary-order",
    access: ["administrator", "city-showmenu"],
    description: "مدیریت کلی احکام انتظامی",
    icon: <AccountBalance />,
  },
  {
    title: "احکام انتظامی",
    // url: "accountant-user/cartable",
    url: "accountant-user/disciplinary-order",
    access: ["accountant-showmenu"],
    description: "مدیریت کلی احکام انتظامی",
    icon: <AccountBalance />,
  },
  {
    title: "کارتابل",
    url: "accountant-user/cartable",
    access: ["accountant-showmenu"],
    description: "مدیریت کلی احکام انتظامی",
    icon: <AccountBalance />,
  },
  {
    title: "اطلاعات موسسات",
    url: "institutions/information",
    access: ["administrator", "city-showmenu"],
    description: "انتخاب و بررسی موسسات",
    icon: <BusinessCenter />,
  },
  {
    title: "حسابداران رسمی",
    url: "accountant/official-users",
    access: ["administrator", "city-showmenu"],
    description: "بررسی حسابدارن رسمی",
    icon: <People />,
  },
];
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "عنوان اول",
    image: "https://picsum.photos/800/400?random=1",
    description: "توضیحات مربوط به آیتم اول",
  },
  {
    id: 2,
    title: "عنوان دوم",
    image: "https://picsum.photos/800/400?random=2",
    description: "توضیحات مربوط به آیتم دوم",
  },
  {
    id: 3,
    title: "عنوان سوم",
    image: "https://picsum.photos/800/400?random=3",
    description: "توضیحات مربوط به آیتم سوم",
  },
];
function HangOverMenu() {
  const Auth = useAuth();
  const theme = useTheme();
  const authFunctions = useAuthorization();
  const navigate=useNavigate();
  return (
    <Grid container item md={12} justifyContent={"center"}>
      {/* <Grid item md={4}>
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={5000}
          height={300}
        />
      </Grid> */}
      {/**@description EmblaCarousel */}
      {/* <Grid item md={11}>
        <EmblaCarousel slides={carouselItems}/>
      </Grid> */}
      {/**@description hangover */}
      <Box
        // display={"flex"}
        justifyContent={"space-around"}
        sx={{
          width:"90%",
          height: "17vh",
          backgroundColor:`${alpha(theme.palette.primary.main, 0.4)}`,
          // backgroundColor: theme.palette.primary.light,
          // border:`2px dashed ${theme.palette.primary.main}`,
          overflow: "visible",
          // position: "relative",
          borderRadius: "5px",
        }}
      >
        <Box p={1} mb={-1} width={"100%"} display={"flex"} justifyContent={"center"}>
          <Typography variant="h5" color={"white"}>پر کاربرد های شما</Typography>
        </Box>
        <Grid container display={"flex"} width={"100%"}>
          {menuItems
          ?.filter((item) => {
            // return item.access?.includes(access?.accessMenu[0]);
            return authFunctions?.hasMenuAccess(item.access);
          })
          ?.map((item, index) => (
            <Grid
              item
              md={4}
              sx={{
                // position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  borderRadius: "5px",
                  position: "relative",
                  top: "18px", // کارت از پایین گرید بیرون می‌زند بدون افزایش ارتفاع
                  // width: "100%",
                  height: "20vh",
                  // aspectRatio: "15/16",
                }}
              >
                {/* <CardHeader title={item.title} /> */}
                <CardContent
                // sx={{ height: "100%" }}
                >
                  <Box display={"flex"} gap={1}>
                    {item.icon}
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={()=>{navigate(item.url)}} variant="contained">مشاهده</Button>
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      bottom: 22,
                      right: 16,
                      // color: slide.image ? "white" : "text.secondary",
                      zIndex: 2,
                    }}
                  >
                    {index + 1} / {carouselItems.length}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
      </Box>
    </Grid>
  );
}

export default HangOverMenu;
