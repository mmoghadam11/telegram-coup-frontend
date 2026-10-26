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
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "motion/react";
import Carousel from "components/Carousel/Carousel";
import EmblaCarousel from "components/Carousel/EmblaCarouselWithScaleAndLazy";
import { useAuthorization } from "hooks/useAutorization";
import { AccountBalance, BusinessCenter, People } from "@mui/icons-material";
import HangOverMenu from "components/HangOverMenu";
import AllCard from "components/AllCard";
import FireButton from "components/FireButton";
import PushButton from "components/PushButton";
import ParallaxBackdrop from "./ParallaxBackdrop";
import SkinsEntryCard from "./SkinsEntryCard";

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
    url: "COUP/disciplinary-order",
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

// جابه‌جایی عمودی با اسکرول (پارالکس). y یک MotionValue است و جدا از انیمیشن ورود اعمال می‌شود
function Parallax({ y, children }: { y: MotionValue<number>; children: React.ReactNode }) {
  return <motion.div style={{ y, width: "100%", willChange: "transform" }}>{children}</motion.div>;
}

// ظاهر شدن نرم، یک‌بار وقتی وارد دید می‌شود
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function Welcome() {
  const Auth = useAuth();
  const theme = useTheme();
  const authFunctions = useAuthorization();
  const [name, setName] = useState("");

  const reduce = !!useReducedMotion();
  const k = reduce ? 0 : 1; // کاربری که حرکت کم می‌خواهد، پارالکس نمی‌بیند
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 300], [0, -40 * k]);
  const titleOpacity = useTransform(scrollY, [0, 260], [1, reduce ? 1 : 0.35]);
  const menuY = useTransform(scrollY, [0, 400], [0, -26 * k]);
  const skinsY = useTransform(scrollY, [0, 500], [0, -48 * k]);
  const cardsY = useTransform(scrollY, [0, 500], [0, -20 * k]);

  useEffect(() => {
    if ((window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
      const user = (window as any).Telegram.WebApp.initDataUnsafe.user;
      setName(`${user.first_name || ""} ${user.last_name || ""}`.trim());
      // console.log('telegram ok=>',(window as any).Telegram.WebApp.initDataUnsafe.user)
    }
  }, []);
  //   useEffect(() => {
  //   try {
  //     const tg = (window as any).Telegram?.WebApp;

  //     if (tg?.initDataUnsafe?.user) {
  //       const user = tg.initDataUnsafe.user;
  //       setName(`${user.first_name || ""} ${user.last_name || ""}`.trim());
  //     }

  //     // نمایش موقت وضعیت روی خود صفحه (به‌جای console.log که توی تلگرام قابل دیدن نیست)
  //     const debugEl = document.createElement('div');
  //     debugEl.style.cssText = 'position:fixed;top:0;left:0;right:0;background:yellow;color:black;font-size:10px;z-index:9999;padding:8px;white-space:pre-wrap;direction:ltr;text-align:left';
  //     debugEl.textContent = `Telegram: ${!!(window as any).Telegram}\nWebApp: ${!!tg}\ninitData: ${tg?.initData || 'خالی'}\nuser: ${JSON.stringify(tg?.initDataUnsafe?.user) || 'خالی'}`;
  //     document.body.prepend(debugEl);

  //   } catch (e) {
  //     document.body.innerHTML = `<pre style="color:red;white-space:pre-wrap;direction:ltr;text-align:left">${String(e)}\n${(e as Error)?.stack}</pre>`;
  //   }
  // }, []);
  return (
    // minHeight بیشتر از ۱۰۰: بدون اسکرول‌شدنی بودن صفحه، پارالکس دیده نمی‌شود
    <Box sx={{ minHeight: "115svh", position: "relative" }}>
      <ParallaxBackdrop scrollY={scrollY} reduce={reduce} />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Grid container justifyContent={"center"} width={"100svw"}>
          <Grid item md={11} xs={11} p={4}>
            {/* <Typography variant="h6" textAlign={"center"}>{name} welcome</Typography> */}
            {/* <Typography variant="h6" textAlign={"center"}>{Auth?.userInfo?.first_name} خوش آمدید</Typography> */}
            <Parallax y={titleY}>
              <motion.div style={{ opacity: titleOpacity }}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Typography variant="h5" textAlign={"center"}>
                    {/* نیمه‌ی راست و چپ گرادیان یکسان‌اند؛ پس حلقه بدون پرش تکرار می‌شود */}
                    <motion.span
                      animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      style={{
                        background: "linear-gradient(90deg,#c98a1a,#f5c451,#c98a1a,#f5c451,#c98a1a)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 800,
                      }}
                    >
                      {Auth?.userInfo?.first_name ?? ""}
                    </motion.span>{" "}
                    خوش آمدید
                  </Typography>
                  {/* <Typography variant="body2" textAlign={"center"} color="text.secondary" sx={{ mt: 0.5 }}>
                    آماده‌ی یه دست بلوف و کودتا؟
                  </Typography> */}
                </motion.div>
              </motion.div>
            </Parallax>
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
          <Parallax y={menuY}>
            <Reveal delay={0.1}>
              <HangOverMenu />
            </Reveal>
          </Parallax>
          <Grid container item md={11} xs={11} justifyContent={"space-between"}>
            {/* اسلات اسکین: روی موبایل ۳ از ۱۲ و padding ۴ (۳۲ پیکسل) جایی برای کارت نمی‌گذاشت */}
            <Grid container item md={3} xs={4} p={{ xs: 1, md: 4 }} alignItems="center">
              <Parallax y={skinsY}>
                <Reveal delay={0.2}>
                  <SkinsEntryCard />
                </Reveal>
              </Parallax>
            </Grid>
            <Grid container item md={9} xs={8} p={1} >
              <Parallax y={cardsY}>
                <Reveal delay={0.3}>
                  <AllCard />
                </Reveal>
              </Parallax>
            </Grid>
          </Grid>
          {/* <Grid item md={11} xs={11} p={4} justifyContent={"center"} alignContent={"center"} display={"flex"}>
          <PushButton size={200} onClick={() => console.log("Button Pressed!")} />
        </Grid> */}
        </Grid>
      </Box>
    </Box>

  );
}

export default Welcome;