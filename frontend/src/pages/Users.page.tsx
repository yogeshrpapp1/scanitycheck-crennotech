import { Stack, Title, Box } from '@mantine/core';
import { UsersRolesTable } from "@/components/Users/UsersRolesTable";

export function UsersPage() {
  return (
    <Stack gap="lg" p="md">
      <Box>
        <Title order={2} mb="md">Users</Title>
        <UsersRolesTable />
      </Box>
    </Stack>
  );
}