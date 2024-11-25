import PropTypes from 'prop-types';
import dynamic from 'next/dynamic'
    
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

type AppWebsiteVisitsProps = {
  title: string,
  subheader: string,
  chartData: any[],
  chartLabels: string[],
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }:AppWebsiteVisitsProps) {
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y:any) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
