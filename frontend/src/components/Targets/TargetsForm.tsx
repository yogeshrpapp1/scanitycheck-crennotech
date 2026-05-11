import { Button, Checkbox, Group, TextInput, Textarea, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

interface TargetsFormProps {
  closeModal: () => void;
}

export function TargetsForm( {closeModal}: TargetsFormProps ) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      Name: '',
      BaseUrl: '',
      OpenApiUrl: '',
      RequiresAuth: false,
      ClientName: '',
      ProductName: '',
      Environment: '',
      Notes: '',
    },

    validate: {
      Name: (value) => (value.length < 1 ? 'Name is required' : null),
      // BaseUrl: (value) => (/^https?:\/\/\S+/.test(value) ? null : 'Invalid URL'),
    },
  });

  // oxlint-disable-next-line no-console
  const handleSave = (values: any) => {console.log(values);
    // 1. You would normally do your API call here
    // 2. Then close the modal
    closeModal();
  };

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="e.g. Juice Shop"
          withAsterisk
          key={form.key('Name')}
          {...form.getInputProps('Name')}
        />

        <TextInput
          label="Base URL"
          placeholder="https://api.example.com"
          withAsterisk
          key={form.key('BaseUrl')}
          {...form.getInputProps('BaseUrl')}
        />

        <TextInput
          label="OpenAPI URL"
          placeholder="https://api.example.com/swagger.json"
          key={form.key('OpenApiUrl')}
          {...form.getInputProps('OpenApiUrl')}
        />

        <TextInput
          label="Client Name"
          placeholder="Client Name"
          key={form.key('ClientName')}
          {...form.getInputProps('ClientName')}
        />

        <TextInput
          label="Product Name"
          placeholder="Product Name"
          key={form.key('ProductName')}
          {...form.getInputProps('ProductName')}
        />

        <TextInput
          label="Environment"
          placeholder="e.g., Production, Staging"
          withAsterisk
          key={form.key('Environment')}
          {...form.getInputProps('Environment')}
        />

        <Checkbox
          label="Requires Authentication"
          key={form.key('RequiresAuth')}
          {...form.getInputProps('RequiresAuth', { type: 'checkbox' })}
        />

        <Textarea
          label="Notes"
          placeholder="Any additional information..."
          minRows={3}
          key={form.key('Notes')}
          {...form.getInputProps('Notes')}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={closeModal}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}