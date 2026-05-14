import { useState } from 'react';
import { Button, Group, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { ScansTable } from '@/components/Scans/ScansTable';
import { NewScanDrawer } from '@/components/Scans/NewScanDrawer';

export function ScansPage() {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleScanQueued = (_scanId: number) => {
    // Bump the refresh key so the table refetches and shows the new scan.
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={2}>Scans</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openDrawer}>
          New Scan
        </Button>
      </Group>

      <ScansTable refreshKey={refreshKey} />

      <NewScanDrawer
        opened={drawerOpened}
        onClose={closeDrawer}
        onScanQueued={handleScanQueued}
      />
    </Stack>
  );
}
