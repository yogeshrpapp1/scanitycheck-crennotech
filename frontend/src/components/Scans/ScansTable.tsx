import { useEffect, useMemo, useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import {
  Box,
  Center,
  Collapse,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './ScansTable.module.css';
import { StatusBadge } from './StatusBadge';
import { listScans, ScanListItem } from '@/api/scans';

type SortableKey = 'id' | 'targetName' | 'tool' | 'status' | 'startedAt' | 'completedAt';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronDown : IconChevronUp) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function compareBy(a: ScanListItem, b: ScanListItem, key: SortableKey, reversed: boolean): number {
  const direction = reversed ? -1 : 1;
  switch (key) {
    case 'id':
      return (a.id - b.id) * direction;
    case 'startedAt':
    case 'completedAt': {
      const aVal = a[key] ? new Date(a[key] as string).getTime() : 0;
      const bVal = b[key] ? new Date(b[key] as string).getTime() : 0;
      return (aVal - bVal) * direction;
    }
    default:
      return String(a[key] ?? '').localeCompare(String(b[key] ?? '')) * direction;
  }
}

function filterRows(rows: ScanListItem[], search: string): ScanListItem[] {
  const query = search.toLowerCase().trim();
  if (!query) {
    return rows;
  }
  return rows.filter((row) => {
    return [
      String(row.id),
      row.targetName,
      row.productName ?? '',
      row.environment,
      row.tool,
      row.scope,
      row.status,
      row.summary ?? '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

interface ScansTableProps {
  // Bumping this value triggers a refetch (used after a new scan is queued).
  refreshKey?: number;
  // Polling interval for in-flight scans, in ms.
  pollIntervalMs?: number;
}

export function ScansTable({ refreshKey = 0, pollIntervalMs = 5000 }: ScansTableProps) {
  const [rows, setRows] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortableKey | null>('id');
  const [reverseSortDirection, setReverseSortDirection] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Initial load + refresh trigger.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await listScans(controller.signal);
        setRows(data);
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load scans.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [refreshKey]);

  // Background polling while any scan is in-flight.
  const hasInflight = useMemo(
    () => rows.some((row) => row.status === 'Queued' || row.status === 'Running'),
    [rows],
  );

  useEffect(() => {
    if (!hasInflight || pollIntervalMs <= 0) {
      return undefined;
    }
    const controller = new AbortController();
    const handle = window.setInterval(async () => {
      try {
        const data = await listScans(controller.signal);
        if (!controller.signal.aborted) {
          setRows(data);
        }
      } catch {
        // Silent: don't surface transient polling errors. The initial loader handles real failures.
      }
    }, pollIntervalMs);

    return () => {
      controller.abort();
      window.clearInterval(handle);
    };
  }, [hasInflight, pollIntervalMs]);

  const visibleRows = useMemo(() => {
    const filtered = filterRows(rows, search);
    if (!sortBy) {
      return filtered;
    }
    return [...filtered].sort((a, b) => compareBy(a, b, sortBy, reverseSortDirection));
  }, [rows, search, sortBy, reverseSortDirection]);

  const setSorting = (field: SortableKey) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderedRows = visibleRows.flatMap((row) => {
    const isExpanded = expandedRows.has(row.id);
    return [
      <Table.Tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => toggleRow(row.id)}>
        <Table.Td style={{ width: 30, padding: 0 }}>
          <Center style={{ width: 30 }}>
            <IconChevronRight
              size={16}
              stroke={2}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Center>
        </Table.Td>
        <Table.Td>{`SCAN-${String(row.id).padStart(4, '0')}`}</Table.Td>
        <Table.Td>{row.targetName}</Table.Td>
        <Table.Td>{row.tool}</Table.Td>
        <Table.Td>
          <StatusBadge status={row.status} />
        </Table.Td>
        <Table.Td>{formatDate(row.startedAt)}</Table.Td>
        <Table.Td>{formatDate(row.completedAt)}</Table.Td>
      </Table.Tr>,
      <Table.Tr key={`${row.id}-details`}>
        <Table.Td colSpan={7} style={{ padding: 0, border: 0 }}>
          <Collapse in={isExpanded}>
            <Box
              p="sm"
              style={{
                backgroundColor: isDark
                  ? 'var(--mantine-color-dark-8)'
                  : 'var(--mantine-color-gray-0)',
              }}
            >
              <Stack gap={4}>
                <Text fz="sm" c={isDark ? 'white' : 'dimmed'}>
                  <strong>Scope:</strong> {row.scope}
                </Text>
                <Text fz="sm" c={isDark ? 'white' : 'dimmed'}>
                  <strong>Environment:</strong> {row.environment || '—'}
                </Text>
                {row.productName ? (
                  <Text fz="sm" c={isDark ? 'white' : 'dimmed'}>
                    <strong>Product:</strong> {row.productName}
                  </Text>
                ) : null}
                <Text fz="sm" c={isDark ? 'white' : 'dimmed'}>
                  <strong>Summary:</strong> {row.summary ?? 'No summary available.'}
                </Text>
              </Stack>
            </Box>
          </Collapse>
        </Table.Td>
      </Table.Tr>,
    ];
  });

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by ID, target, tool, status…"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={900} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Table.Th style={{ width: 30, padding: 0 }} />
            <Th
              sorted={sortBy === 'id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('id')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Scan ID
              </Text>
            </Th>
            <Th
              sorted={sortBy === 'targetName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('targetName')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Target
              </Text>
            </Th>
            <Th
              sorted={sortBy === 'tool'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('tool')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Tool
              </Text>
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Status
              </Text>
            </Th>
            <Th
              sorted={sortBy === 'startedAt'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('startedAt')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Started
              </Text>
            </Th>
            <Th
              sorted={sortBy === 'completedAt'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('completedAt')}
            >
              <Text component="span" fw={700} fz="sm" c="blue.7">
                Completed
              </Text>
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {loading && rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center" c="dimmed">
                  Loading scans…
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : errorMessage ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center" c="red">
                  {errorMessage}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : renderedRows.length > 0 ? (
            renderedRows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center">
                  No scans yet — click <em>New Scan</em> to launch one.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
