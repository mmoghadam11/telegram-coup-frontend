import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';

const color_array = [blueberryTwilightPalette, mangoFusionPalette, cheerfulFiestaPalette]

const customize = {
  legend: { hidden: true },
  margin: { top: 5 },
};

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

export default function LChart({data, width=550, isMonth=false, colorIndex=0}) {
    return (
        <LineChart
            xAxis={[
                {
                    dataKey: 'key',
                    valueFormatter: (value) => {
                        return isMonth ? months[value] : value.toString()
                    },
                },
            ]}
            yAxis={[{min: 0}]}
            series={[
                {dataKey: "ntext", label: "تعداد درخواست های متنی"},
                {dataKey: "nvoice", label: "تعداد درخواست های صوتی"},
                {dataKey: "nall", label:"تعداد کل درخواست ها"},
            ]}
            dataset={data}
            {...customize}
            height={250}
            width={width}
            colors={color_array[colorIndex]("dark")}
        />
    );
}
