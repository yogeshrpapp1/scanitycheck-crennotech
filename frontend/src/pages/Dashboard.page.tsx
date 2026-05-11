import { StatsGrid } from '@/components/Dashboard/StatsGrid';
import { TrendChart } from '@/components/Dashboard/TrendChart';
import { Stack, Title, Box } from '@mantine/core';

export function DashboardPage() {
  return (
    <Stack gap="lg" p="md">
      <Box>
        <Title order={2} mb="md">Summary</Title>
        <StatsGrid />
      </Box>

      <Box mt={50}>
        <Title order={2} mb="md">Trends</Title>
        <Box mx="auto" w="100%" style={{ minWidth: 0 }}>
          <TrendChart />
        </Box>
      </Box>
    </Stack>
  );
}
