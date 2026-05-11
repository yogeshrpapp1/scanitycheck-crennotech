import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Title, ScrollArea, Stack } from '@mantine/core';
import { TargetsTable } from "@/components/Targets/TargetsTable";
import { TargetsForm } from "@/components/Targets/TargetsForm";

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

  return (
    <>
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
          <TargetsForm closeModal={close} />
        </Modal>

        <TargetsTable />
      </Stack>
    </>
  );
}