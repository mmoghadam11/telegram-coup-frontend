import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';

const color_array = [blueberryTwilightPalette, mangoFusionPalette, cheerfulFiestaPalette]


export default function PChart({data, colorIndex=0}) {
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      colors={color_array[colorIndex]("dark")}
      width={400}
      height={150}
      onItemClick={(event, params) => {console.log(params.dataIndex)}}
    />
  );
}