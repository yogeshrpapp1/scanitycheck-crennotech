import { Button, Checkbox, Group, TextInput, Textarea, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { CreateTargetRequest } from '@/api/types';
import { targetsService } from '@/api/targetsService';

interface TargetsFormProps {
  closeModal: () => void;
  onRefresh?: () => void;
}

export function TargetsForm( { closeModal, onRefresh }: TargetsFormProps) {
  const form = useForm<CreateTargetRequest>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      baseUrl: '',
      openApiUrl: null,
      requiresAuth: false,
      clientName: null,
      productName: null,
      environment: '',
      authHeader: null,
      notes: null,
    },

    validate: {
      name: (value) => (value.trim().length < 1 ? 'Name is required' : null),
      baseUrl: (value) => {
        if (!value || value.trim().length < 1) {return 'Base URL is required';}
        return /^https?:\/\/\S+/.test(value) ? null : 'Invalid URL (must start with http:// or https://)';
      },
      environment: (value) => (value.trim().length < 1 ? 'Environment is required' : null),
    },
  });

  form.watch('requiresAuth', () => {});

  const handleSave = async (values: CreateTargetRequest) => {
    try {
      // targetsService.create automatically handles the token via apiRequest
      await targetsService.create(values);

      notifications.show({
        title: 'Success',
        message: 'Target created successfully',
        color: 'green',
      });

      closeModal();
      onRefresh?.();
    } catch (error: any) {
      notifications.show({
        title: 'Submission Error',
        message: error.message || 'Failed to save target. Please check your connection.',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="e.g. Juice Shop"
          withAsterisk
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Base URL"
          placeholder="https://api.example.com"
          withAsterisk
          {...form.getInputProps('baseUrl')}
        />

        <TextInput
          label="OpenAPI URL"
          placeholder="https://api.example.com/swagger.json"
          {...form.getInputProps('openApiUrl')}
        />

        <TextInput
          label="Client Name"
          placeholder="Client Name"
          {...form.getInputProps('clientName')}
        />

        <TextInput
          label="Product Name"
          placeholder="Product Name"
          {...form.getInputProps('productName')}
        />

        <TextInput
          label="Environment"
          placeholder="e.g. Production, Staging"
          withAsterisk
          {...form.getInputProps('environment')}
        />

        <Checkbox
          label="Requires Authentication"
          {...form.getInputProps('requiresAuth', { type: 'checkbox' })}
        />

        {form.getValues().requiresAuth && (
          <Textarea
            label="Auth Header"
            placeholder="e.g. Authorization: Bearer <token>"
            autosize
            minRows={8}
            maxRows={8}
            {...form.getInputProps('authHeader')}
          />
        )}

        <Textarea
          label="Notes"
          placeholder="Any additional information..."
          autosize
          minRows={5}
          maxRows={5}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={closeModal}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}