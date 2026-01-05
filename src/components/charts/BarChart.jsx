import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';

const color_array = [blueberryTwilightPalette, mangoFusionPalette, cheerfulFiestaPalette]

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

export default function BChart({data, labels, height=250, width=550, isMonth=false, colorIndex=0, colorPhase=0}) {

  return (
    <BarChart
      dataset={data}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: "key",
          valueFormatter: (value) => {
              return isMonth ? months[value] : value.toString()
          },
        }
      ]}
      series={Object.keys(data[0]).filter((value) => value !== "key").map((value) => {
        return {
          dataKey: value,
          label: labels[value]
        }
      })}
      colors={color_array[colorIndex]("dark").slice(colorPhase)}
      width={width}
      height={height}
      sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: "0.9em" } }}
    />
  );
}
