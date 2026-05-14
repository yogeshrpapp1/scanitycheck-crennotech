import { Badge, MantineColor } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
}

// Map backend enum -> visual treatment. The brief mentions Pending/Running/Completed;
// our backend uses Queued/Running/Completed/Failed — we surface Queued as "Pending".
function describe(status: string): { label: string; color: MantineColor } {
  switch (status) {
    case 'Queued':
      return { label: 'Pending', color: 'yellow' };
    case 'Running':
      return { label: 'Running', color: 'blue' };
    case 'Completed':
      return { label: 'Completed', color: 'teal' };
    case 'Failed':
      return { label: 'Failed', color: 'red' };
    default:
      return { label: status || 'Unknown', color: 'gray' };
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = describe(status);
  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
}
