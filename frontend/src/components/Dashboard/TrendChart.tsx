import { LineChart } from '@mantine/charts';
import { Box } from '@mantine/core';
import { data } from './data';

const severityOrder: Record<string, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function TrendChart() {
  const series = [
    { name: 'Low', color: 'blue.6' },
    { name: 'Medium', color: 'yellow.6' },
    { name: 'High', color: 'orange.6' },
    { name: 'Critical', color: 'red.9' },
  ];

  return (
    <Box
      w="100%"
      style={{
        border: '1.5px solid var(--mantine-color-gray-6)',
        borderRadius: 8,                        
        padding: '50px 40px 20px 20px',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <LineChart
        h={400}
        w="100%"
        data={data}
        dataKey="date"
        series={series}
        curveType="linear"
        withLegend
        legendProps={{
          itemSorter: (item) => severityOrder[item.value ?? ''] ?? 999,
          verticalAlign: 'bottom',
          layout: 'horizontal',
          wrapperStyle: {
            justifyContent: 'center',
            display: 'flex',
            width: '100%',
          },
        }}
        style={{
          flexGrow: 1,
        }}
      />
    </Box>
  );
}