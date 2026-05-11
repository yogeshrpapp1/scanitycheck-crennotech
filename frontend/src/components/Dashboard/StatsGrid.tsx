import {
  IconAlertOctagon,
  IconAlertHexagon,
  IconAlertTriangle,
  IconAlertCircle,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import classes from './StatsGrid.module.css';

const severityConfig = {
  critical: { icon: IconAlertOctagon, color: 'red' },
  high: { icon: IconAlertHexagon, color: 'orange' },
  medium: { icon: IconAlertTriangle, color: 'yellow' },
  low: { icon: IconAlertCircle, color: 'blue' },
};

const data = [
  { title: 'Critical', icon: 'critical', value: '98', diff: 34 },
  { title: 'High', icon: 'high', value: '1,341', diff: -13 },
  { title: 'Medium', icon: 'medium', value: '822', diff: 18 },
  { title: 'Low', icon: 'low', value: '8,762', diff: -30 },
] as const;

export function StatsGrid() {
  const stats = data.map((stat) => {
    const config = severityConfig[stat.icon];
    const Icon = config.icon
    const DiffIcon = stat.diff > 0 ? IconArrowUp : IconArrowDown;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}
        // bg={`var(--mantine-color-${config.color}-light)`}
        bg={`color-mix(in srgb, var(--mantine-color-${config.color}-filled), transparent 85%)`}
        style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `var(--mantine-color-${config.color}-6)` }}>
        <Group justify="space-between">
          <Text size="sm" className={classes.title}
            style={{ color: `var(--mantine-color-${config.color}-7)` }}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} color={`var(--mantine-color-${config.color}-filled)`}/>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text c={stat.diff > 0 ? 'red' : 'teal'} fz="sm" fw={500} className={classes.diff}>
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" mt={7}>
          Active vulnerabilities
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}