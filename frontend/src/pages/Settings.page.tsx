import ScanSettings from '@/components/Settings/ScanSettings';
import { Stack, Title, Box } from '@mantine/core';

export function SettingsPage() {
  return (
    <Stack gap="lg" p="md">
      <Box>
        <Title order={2} mb="md">Settings</Title>
        <ScanSettings />
      </Box>
    </Stack>
  );
}