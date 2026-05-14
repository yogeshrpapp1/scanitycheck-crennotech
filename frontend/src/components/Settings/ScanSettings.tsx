import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Slider,
  SegmentedControl,
  TextInput,
  Button,
  Divider,
  NumberInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconSettings, IconDeviceFloppy } from '@tabler/icons-react';

interface ScanSettings {
  nucleiRateLimit: number;
  zapMode: 'Safe' | 'Protected' | 'Standard' | 'ATTACK';
  userAgent: string;
}

export default function ScanSettings() {
  const form = useForm<ScanSettings>({
    initialValues: {
      nucleiRateLimit: 150,
      zapMode: 'Protected',
      userAgent: 'SecurityScanner/1.0 (Enterprise-Audit)',
    },
  });

  const handleSave = (values: ScanSettings) => {
    console.log('Configurations saved:', values);
    // Logic to persist settings to your backend/local storage
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Scan Engine Settings</Title>
            <Text c="dimmed" size="sm">
              Configure global parameters for ZAP and Nuclei background jobs.
            </Text>
          </div>
          <IconSettings size={32} stroke={1.5} color="var(--mantine-color-blue-filled)" />
        </Group>

        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            {/* Nuclei Configuration */}
            <Paper withBorder p="md" radius="md">
              <Group mb="xs">
                <Text fw={500}>Nuclei Rate Limits</Text>
                <Tooltip label="Requests per second to prevent 429 Rate Limiting">
                  <IconInfoCircle size={16} color="gray" />
                </Tooltip>
              </Group>
              <Text size="xs" c="dimmed" mb="sm">
                Adjust the maximum number of requests sent per second.
              </Text>
              <Slider
                marks={[
                  { value: 50, label: '50' },
                  { value: 150, label: '150' },
                  { value: 300, label: '300' },
                  { value: 500, label: '500' },
                ]}
                min={10}
                max={500}
                step={10}
                {...form.getInputProps('nucleiRateLimit')}
              />
              <NumberInput
                mt="xl"
                label="Manual limit"
                placeholder="150"
                {...form.getInputProps('nucleiRateLimit')}
              />
            </Paper>

            {/* ZAP Configuration */}
            <Paper withBorder p="md" radius="md">
              <Text fw={500} mb="xs">ZAP Scan Mode</Text>
              <Text size="xs" c="dimmed" mb="md">
                Higher strength increases the number of payloads per injection point.
              </Text>
              <SegmentedControl
                fullWidth
                data={['Safe', 'Protected', 'Standard', 'ATTACK']}
                {...form.getInputProps('zapMode')}
              />
            </Paper>

            {/* Global Identity */}
            <Paper withBorder p="md" radius="md">
              <Text fw={500} mb="xs">Global User-Agent</Text>
              <TextInput
                description="Custom header for identification"
                placeholder="User-Agent string..."
                {...form.getInputProps('userAgent')}
              />
            </Paper>

            <Divider my="sm" />

            <Group justify="flex-end">
              <Button variant="subtle" color="gray" onClick={() => form.reset()}>
                Reset Changes
              </Button>
              <Button 
                type="submit" 
                leftSection={<IconDeviceFloppy size={18} />}
                color="blue"
              >
                Save Configuration
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}