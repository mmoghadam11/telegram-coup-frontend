import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  MobileStepper,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PlayArrow,
  Pause
} from '@mui/icons-material';

// تعریف نوع داده‌ها برای آیتم‌های کاروسل
export interface CarouselItem {
  title: string;
  image: string;
  description: string;
}

// تعریف نوع داده‌ها برای props کامپوننت
interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  height?: number;
  animationDuration?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlay = true, 
  interval = 3000,
  height = 400,
  animationDuration = 500
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [sliding, setSliding] = useState<boolean>(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const theme = useTheme();
  const maxSteps = items.length;

  const handleNext = (): void => {
    if (sliding) return;
    
    setDirection('right');
    setSliding(true);
    
    setTimeout(() => {
      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
      setSliding(false);
    }, animationDuration);
  };

  const handleBack = (): void => {
    if (sliding) return;
    
    setDirection('left');
    setSliding(true);
    
    setTimeout(() => {
      setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
      setSliding(false);
    }, animationDuration);
  };

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying && autoPlay) {
      intervalId = setInterval(() => {
        handleNext();
      }, interval + animationDuration);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, autoPlay, interval, animationDuration]);

  // محاسبه موقعیت اسلایدها برای انیمیشن با استفاده از transform
  const getSlideTransform = (index: number): string => {
    if (index === activeStep) return 'translateX(0)';
    
    if (sliding) {
      if (direction === 'right') {
        if (index === (activeStep - 1 + maxSteps) % maxSteps) return 'translateX(-100%)';
        if (index === (activeStep + 1) % maxSteps) return 'translateX(100%)';
      } else {
        if (index === (activeStep - 1 + maxSteps) % maxSteps) return 'translateX(100%)';
        if (index === (activeStep + 1) % maxSteps) return 'translateX(-100%)';
      }
    }
    
    if (index < activeStep) return 'translateX(-100%)';
    return 'translateX(100%)';
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      width: '100%', 
      margin: '0 auto', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Card sx={{ 
        position: 'relative', 
        height: height,
        overflow: 'hidden',
        borderRadius: 2
      }}>
        {/* Container for slides with animation */}
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: getSlideTransform(index),
                transition: `transform ${animationDuration}ms cubic-bezier(0.35, 0.75, 0.5, 1)`,
                zIndex: index === activeStep ? 2 : 1,
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={item.image}
                alt={item.title}
                sx={{ 
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />
            </Box>
          ))}
        </Box>
        
        <CardContent sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          zIndex: 3,
          transition: `opacity ${animationDuration}ms ease-in-out`,
          opacity: sliding ? 0.7 : 1
        }}>
          <Typography variant="h5" component="div" gutterBottom>
            {items[activeStep].title}
          </Typography>
          <Typography variant="body2">
            {items[activeStep].description}
          </Typography>
        </CardContent>
        
        {/* دکمه‌های کنترل */}
        <IconButton
          onClick={handleBack}
          disabled={sliding}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 3,
            transform: 'translateY(-50%)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
            '&:disabled': {
              opacity: 0.5
            }
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          disabled={sliding}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 3,
            transform: 'translateY(-50%)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
            '&:disabled': {
              opacity: 0.5
            }
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
        
        {/* دکمه play/pause */}
        {autoPlay && (
          <IconButton
            onClick={togglePlay}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 3,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        )}
      </Card>
      
      {/* ناوبری پایین */}
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ 
          justifyContent: 'center',
          backgroundColor: 'transparent',
          mt: 1
        }}
        nextButton={null}
        backButton={null}
      />
    </Box>
  );
};

export default Carousel;