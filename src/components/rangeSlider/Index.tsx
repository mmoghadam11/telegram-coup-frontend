import React, { useState } from "react";
import { Slider, Box, Typography } from "@mui/material";
import moment from "jalali-moment";

export default function JalaliRangeSlider() {
  // تاریخ شروع و پایان اولیه (شمسی)
  const START = "1403/01/01";
  const END = "1403/12/29";

  // تبدیل تاریخ شمسی به timestamp برای اسلایدر
  const min = moment(START, "jYYYY/jMM/jDD").valueOf();
  const max = moment(END, "jYYYY/jMM/jDD").valueOf();

  const [range, setRange] = useState<any>([min, max]);

  const formatDate = (ts: any) => moment(ts).format("jYYYY/jMM/jDD");

  return (
    <Box sx={{ width: "100%" }}>
      <Typography>از: {formatDate(range[0])}</Typography>
      <Typography>تا: {formatDate(range[1])}</Typography>

      <Slider
        sx={{
        //   direction: "rtl",
          "& .MuiSlider-thumb": {
            // direction: "ltr",
            mr:-2
          },
        }}
        value={range}
        onChange={(e, newVal) => setRange(newVal)}
        min={min}
        max={max}
        step={24 * 60 * 60 * 1000} // یک روز
        valueLabelFormat={(v) => moment(v).format("jYYYY/jMM/jDD")}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}
