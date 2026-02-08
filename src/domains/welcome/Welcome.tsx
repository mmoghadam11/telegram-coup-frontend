import React, { useEffect, useState } from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import { Outlet } from "react-router-dom";
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
import HangOverMenu from "components/HangOverMenu";
import AllCard from "components/AllCard";
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
function Welcome() {
  const Auth = useAuth();
  const theme = useTheme();
  const authFunctions = useAuthorization();
  const [name, setName] = useState("");

  useEffect(() => {
    if ((window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = (window as any).Telegram.WebApp.initDataUnsafe.user;
      setName(`${user.first_name || ""} ${user.last_name || ""}`.trim());
    }
  }, []);
  return (
    <Box sx={{ minHeight: "100svh", }}>
      <Grid container justifyContent={"center"}>
        <Grid item md={11} xs={11} p={4}>
          <Typography variant="h6" textAlign={"center"}>{name} خوش آمدید</Typography>
        </Grid>
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
        <HangOverMenu />
        <Grid item md={11} xs={11} p={4}>
          <AllCard/>
        </Grid>
      </Grid>
    </Box>

  );
}

export default Welcome;
