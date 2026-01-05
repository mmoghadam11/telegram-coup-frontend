import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import Autoplay from "embla-carousel-autoplay";
// import "./EmblaCarosel.css"

// انواع TypeScript
interface Slide {
  id: number;
  title: string;
  description: string;
  image?: string;
}

interface EmblaCarouselProps {
  slides?: Slide[];
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({
  slides = defaultSlides,
}) => {
  const theme = useTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: "rtl",
    },
    [Autoplay({ delay: 3000 })]
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // اسکرول به اسلاید مشخص
  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // اسکرول به اسلاید بعدی
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // اسکرول به اسلاید قبلی
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  // آپدیت اسنپ‌پوینت‌ها و ایندکس انتخابی
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // تنظیم اسنپ‌پوینت‌ها
    setScrollSnaps(emblaApi.scrollSnapList());

    // ردیابی تغییرات
    emblaApi.on("select", onSelect);
    onSelect();

    // تمیز کردن ایونت‌ها
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Box sx={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
      {/* بخش اصلی کراسل */}
      <Box
        className="embla"
        ref={emblaRef}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          className="embla__container"
          sx={{
            display: "flex",
            backfaceVisibility: "hidden",
          }}
        >
          {slides.map((slide, index) => (
            <Box
              className="embla__slide"
              key={slide.id}
              sx={{
                flex: "0 0 100%",
                minWidth: 0,
                position: "relative",
              }}
            >
              {/* <Card
                sx={{
                  height: "400px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: slide.image
                    ? `url(${slide.image}) center/cover`
                    : `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
                  position: "relative",
                  color: slide.image ? "white" : "inherit",
                  "&::before": slide.image
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 1,
                      }
                    : {},
                }}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={slide.image}
                  alt={slide.title}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <CardContent
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    zIndex: 3,
                    // transition: `opacity ${animationDuration}ms ease-in-out`,
                    // opacity: sliding ? 0.7 : 1,
                  }}
                >
                  <Typography variant="h3" component="h2" gutterBottom>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" component="p">
                    {slide.description}
                  </Typography>
                </CardContent>
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    color: slide.image ? "white" : "text.secondary",
                    zIndex: 2,
                  }}
                >
                  {index + 1} / {slides.length}
                </Typography>
              </Card> */}
              <Paper
                sx={{
                  // width:{md:"100%",xs:"90vw"},
                  height: "400px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: slide.image
                    ? `url(${slide.image}) center/cover`
                    : `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
                  position: "relative",
                  color: slide.image ? "white" : "inherit",
                  "&::before": slide.image
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // تیره کردن عکس
                        // backgroundColor: "rgba(0,0,0,0.2)",
                        zIndex: 1,
                      }
                    : {},
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                    width: "100%",
                    top: 140,
                    height:140
                  }}
                >
                  <Typography variant="h4" component="h2" gutterBottom>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" component="p">
                    {slide.description}
                  </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    color: slide.image ? "white" : "text.secondary",
                    zIndex: 2,
                  }}
                >
                  {index + 1} / {slides.length}
                </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        className="embla__controls"
        display={"flex"}
        justifyContent={"space-between"}
        p={1}
      >
        {/* نقاط نشانگر (دات‌ها) */}
        <Box
          className="embla__dots"
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {scrollSnaps.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => scrollTo(index)}
              sx={{
                width: 12,
                height: 12,
                padding: 0,
                backgroundColor:
                  selectedIndex === index ? "primary.main" : "action.disabled",
                "&:hover": {
                  backgroundColor:
                    selectedIndex === index ? "primary.dark" : "action.active",
                },
              }}
            />
          ))}
        </Box>
        <Box
          className="embla__buttons"
          display={"flex"}
          justifyContent={"space-between"}
          gap={1}
        >
          {/* دکمه‌های ناوبری */}
          <IconButton
            className="embla__prev"
            onClick={scrollPrev}
            sx={{
              //   position: "absolute",
              //   left: 16,
              //   top: "50%",
              //   transform: "translateY(-50%)",
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
              zIndex: 3,
            }}
          >
            <NavigateNext />
          </IconButton>

          <IconButton
            className="embla__next"
            onClick={scrollNext}
            sx={{
              //   position: "absolute",
              //   right: 16,
              //   top: "50%",
              //   transform: "translateY(-50%)",
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
              zIndex: 3,
            }}
          >
            <NavigateBefore />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// داده‌های پیش‌فرض
const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "اسلاید اول",
    description: "این اولین اسلاید کراسل شماست",
    // image: "/assets/images/newLogo1.png", // می‌توانید URL تصویر را اینجا قرار دهید
  },
  {
    id: 2,
    title: "اسلاید دوم",
    description: "این دومین اسلاید کراسل شماست",
    // image: "/assets/images/financial-analysis.gif",
  },
  {
    id: 3,
    title: "اسلاید سوم",
    description: "این سومین اسلاید کراسل شماست",
    image: "/assets/images/newLogo3.jpg",
  },
  {
    id: 4,
    title: "اسلاید چهارم",
    description: "این چهارمین اسلاید کراسل شماست",
    image: "/assets/images/newLogo4.png",
  },
];

// کامپوننت اصلی برنامه
// const App: React.FC = () => {
//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         کراسل زیبای من
//       </Typography>
//       <EmblaCarousel slides={defaultSlides} />
//     </Box>
//   );
// };

export default EmblaCarousel;
