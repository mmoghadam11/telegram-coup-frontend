import {
    alpha,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import React from 'react'

type Props = {}
type CardProps = {
    image: string;
    title: string;
    description: string;
    animationDuration?: number;
}

const MyCard = ({ image, title, description, animationDuration = 500 }: CardProps) => {
    return (
        <Card
            sx={{
                flex: "0 0 50%",
                borderRadius: "5px",
                position: "relative",
                // top: "18px", // کارت از پایین گرید بیرون می‌زند بدون افزایش ارتفاع
                width: "100%",
                // height: "20vh",
                // aspectRatio: "15/16",
            }}
            onClick={() => {console.log(title+" clicked")}}
        >
            {/* <CardHeader title={item.title} /> */}
            {/* <CardContent
                onClick={() => { }}
            sx={{ p: "0" }}
            > */}
                <CardMedia
                    component="img"
                    height="100%"
                    width={"100%"}
                    image={image}
                    alt={title}
                    sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 64,
                    p: 1,
                    // display: "flex",
                    // justifyContent:"flex-end",
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    zIndex: 3,
                    transition: `opacity ${animationDuration}ms ease-in-out`,
                    opacity: 0.7
                }}>
                    <Typography variant="body1" fontWeight={"bold"} fontSize={"0.9rem"} gutterBottom>
                        {title}
                    </Typography>
                    <Typography
                        variant="caption"
                        fontSize={"0.7rem"}
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                        {description}
                    </Typography>
                </Box>
            {/* </Card  Content> */}
        </Card>
    )
}
const AllCard = (props: Props) => {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        direction: "rtl",
        // align: "start",
        // dragFree: true,
    });
    const cardItems = [
        {
            image: "/assets/images/cards/dokht1.jpg",
            title: "شاهدخت",
            description: "امنیت شما در برابر دشمن",
        },
        {
            image: "/assets/images/cards/tajer1.jpg",
            title: "آقازاده",
            description: "درآمد بیشتر",
        },
        {
            image: "/assets/images/cards/assassin1.jpg",
            title: "قاتل",
            description: "قتل در سکوت",
        },
        {
            image: "/assets/images/cards/safir1.jpg",
            title: "سفیر",
            description: "مذاکره برای رد وبدل کارت",
        },
    ]
    return (
        <Box  ref={emblaRef} overflow={"hidden"}>
            <Box  display={"flex"}>
                {
                    cardItems?.map((cardItem, cardIndex) => (
                        <MyCard key={cardIndex} image={cardItem.image} title={cardItem.title} description={cardItem?.description} />
                    ))
                }
            </Box>
        </Box>
    )
}

export default AllCard

