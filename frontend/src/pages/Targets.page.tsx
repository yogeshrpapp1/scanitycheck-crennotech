import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Title, ScrollArea, Stack } from '@mantine/core';
import { TargetsTable } from "@/components/Targets/TargetsTable";
import { TargetsForm } from "@/components/Targets/TargetsForm";
import { useRef, useCallback } from 'react';

function CustomScrollArea(props: any) {
  return (
    <ScrollArea.Autosize
      scrollbarSize={6}
      type="hover"
      {...props}
    />
  );
}

export function TargetsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  // const [refreshTable, setRefreshTable] = useState<(isInitial: boolean) => void>(() => {});

  const refreshTableRef = useRef<(isInitial: boolean) => void>(() => {});

  const triggerRefresh = useCallback(() => {
    refreshTableRef.current(false); // Call the function stored in the ref
  }, []);

  const handleRegister = useCallback((fn: (isInitial: boolean) => void) => {
      refreshTableRef.current = fn;
    }, []);


  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={2}>Targets</Title>
        {/* Step 1: Add a button to open the modal */}
        <Button onClick={open}>Add Target</Button>
      </Group>

      {/* Step 2: Wrap your form in the Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Input New Target Information" 
        centered
        size="lg"
        scrollAreaComponent={CustomScrollArea}
      >
        {/* Step 3: Pass 'close' to the form so it can shut the modal on save */}
        <TargetsForm 
          closeModal={close}
          onRefresh={triggerRefresh}
        />
      </Modal>

      <TargetsTable onRegisterRefresh={handleRegister} />
    </Stack>
  );
}