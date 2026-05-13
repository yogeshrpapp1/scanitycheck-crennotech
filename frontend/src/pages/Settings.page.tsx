import { Stack, Title, Box } from '@mantine/core';

export function SettingsPage() {
  return (
    <Stack gap="lg" p="md">
      <Box>
        <Title order={2} mb="md">Settings</Title>
      </Box>
    </Stack>
  );
}