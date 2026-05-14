import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { startScan, ScanTool } from '@/api/scans';
import { listTargets, TargetListItem } from '@/api/targets';

interface NewScanDrawerProps {
  opened: boolean;
  onClose: () => void;
  // Called after a scan is successfully queued so the parent can refresh the table.
  onScanQueued: (scanId: number) => void;
}

interface NewScanFormValues {
  targetId: string; // Select returns string; we coerce to number on submit.
  tool: ScanTool;
  scope: string;
}

const TOOL_OPTIONS: { label: string; value: ScanTool }[] = [
  { label: 'ZAP', value: 'ZAP' },
  { label: 'Nuclei', value: 'Nuclei' },
  { label: 'ZAP + Nuclei', value: 'ZAP+Nuclei' },
  { label: 'Simulated', value: 'Simulated' },
];

export function NewScanDrawer({ opened, onClose, onScanQueued }: NewScanDrawerProps) {
  const [targets, setTargets] = useState<TargetListItem[]>([]);
  const [targetsLoading, setTargetsLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<NewScanFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      targetId: '',
      tool: 'Simulated',
      scope: 'Full',
    },
    validate: {
      targetId: (value) => (value ? null : 'Please pick a target'),
      tool: (value) => (value ? null : 'Please pick a tool'),
      scope: (value) => (value.trim().length > 0 ? null : 'Scope is required'),
    },
  });

  // Load targets each time the drawer opens (cheap, and keeps the dropdown fresh).
  useEffect(() => {
    if (!opened) {
      return undefined;
    }
    const controller = new AbortController();
    setTargetsLoading(true);
    setErrorMessage(null);

    listTargets(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setTargets(data);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load the target list.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setTargetsLoading(false);
        }
      });

    return () => controller.abort();
  }, [opened]);

  const handleClose = () => {
    if (submitting) {
      return;
    }
    form.reset();
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (values: NewScanFormValues) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await startScan({
        targetId: Number(values.targetId),
        tool: values.tool,
        scope: values.scope.trim(),
      });
      onScanQueued(result.scanId);
      form.reset();
      onClose();
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Failed to start the scan.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const targetOptions = targets.map((target) => ({
    value: String(target.id),
    label: `${target.name} — ${target.baseUrl}`,
  }));

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      position="right"
      size="md"
      title={
        <Text fw={700} fz="lg">
          New Scan
        </Text>
      }
      overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
      closeOnClickOutside={!submitting}
      closeOnEscape={!submitting}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text fz="sm" c="dimmed">
            Pick a target, choose your tooling, and we'll queue the scan. You'll see it appear in
            the history table with status <strong>Pending</strong>.
          </Text>

          {errorMessage ? (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Couldn't start scan">
              {errorMessage}
            </Alert>
          ) : null}

          <Select
            label="Target"
            placeholder={targetsLoading ? 'Loading targets…' : 'Select a target'}
            data={targetOptions}
            searchable
            required
            disabled={targetsLoading || submitting}
            nothingFoundMessage="No targets found"
            key={form.key('targetId')}
            {...form.getInputProps('targetId')}
          />

          <Stack gap={4}>
            <Text fz="sm" fw={500}>
              Tool
            </Text>
            <SegmentedControl
              fullWidth
              data={TOOL_OPTIONS}
              disabled={submitting}
              key={form.key('tool')}
              {...form.getInputProps('tool')}
            />
            {form.errors.tool ? (
              <Text c="red" fz="xs">
                {form.errors.tool}
              </Text>
            ) : null}
          </Stack>

          <TextInput
            label="Scope"
            placeholder="e.g. Full, Auth, /api"
            description="Free-form scope passed to the scanner."
            required
            disabled={submitting}
            key={form.key('scope')}
            {...form.getInputProps('scope')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={targetsLoading}>
              Start scan
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
