import { useState } from 'react';
import { IconChevronUp, IconChevronDown, IconChevronRight, IconSearch, IconSelector } from '@tabler/icons-react';
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Collapse,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './TargetsTable.module.css';

interface RowData {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
}

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

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      String(item[key]).toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;
  if (!sortBy) {return filterData(data, payload.search);}

  return filterData(
    [...data].sort((a, b) =>
      payload.reversed
        ? String(b[sortBy]).localeCompare(String(a[sortBy]))
        : String(a[sortBy]).localeCompare(String(b[sortBy]))
    ),
    payload.search
  );
}

const data: RowData[] = [
  { id: 'TGT001', name: 'Appify', baseUrl: 'https://appify.example.com', description: 'Project management app' },
  { id: 'TGT002', name: 'JuiceShop', baseUrl: 'https://juiceshop.example.com', description: 'Security training platform' },
  { id: 'TGT003', name: 'TaskWave', baseUrl: 'https://taskwave.example.com', description: 'Task tracking solution' },
  { id: 'TGT004', name: 'DataZen', baseUrl: 'https://datazen.example.com', description: 'Analytics dashboard' },
  { id: 'TGT005', name: 'CloudNest', baseUrl: 'https://cloudnest.example.com', description: 'Cloud storage and hosting service' },
  { id: 'TGT006', name: 'BrightDesk', baseUrl: 'https://brightdesk.example.com', description: 'Customer support ticketing system' },
  { id: 'TGT007', name: 'Linkify', baseUrl: 'https://linkify.example.com', description: 'Social networking and linking tool' },
  { id: 'TGT008', name: 'NoteHive', baseUrl: 'https://notehive.example.com', description: 'Collaborative note-taking application' },
  { id: 'TGT009', name: 'Taskly', baseUrl: 'https://taskly.example.com', description: 'Personal to-do list manager' },
  { id: 'TGT010', name: 'FlowBoard', baseUrl: 'https://flowboard.example.com', description: 'Kanban-style workflow visualizer' },
  { id: 'TGT011', name: 'ProjectPulse', baseUrl: 'https://projectpulse.example.com', description: 'Real-time project health monitoring' },
  { id: 'TGT012', name: 'VisionHub', baseUrl: 'https://visionhub.example.com', description: 'Design asset and brand management' },
  { id: 'TGT013', name: 'TaskForge', baseUrl: 'https://taskforge.example.com', description: 'Automated task generation engine' },
  { id: 'TGT014', name: 'WorkNest', baseUrl: 'https://worknest.example.com', description: 'Remote team workspace' },
  { id: 'TGT015', name: 'FlowPoint', baseUrl: 'https://flowpoint.example.com', description: 'Strategic process mapping tool' },
  { id: 'TGT016', name: 'CloudPath', baseUrl: 'https://cloudpath.example.com', description: 'DevOps deployment pipeline' },
  { id: 'TGT017', name: 'FlowSpace', baseUrl: 'https://flowspace.example.com', description: 'Infinite canvas for brainstorming' },
];

export function TargetsTable() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {newSet.delete(id);}
    else {newSet.add(id);}
    setExpandedRows(newSet);
  };

  const rows = sortedData.flatMap((row) => {
    const isExpanded = expandedRows.has(row.id);
    return [
      <Table.Tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => toggleRow(row.id)}>
        {/* Narrow arrow column */}
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
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{row.baseUrl}</Table.Td>
      </Table.Tr>,
      <Table.Tr key={`${row.id}-details`}>
        <Table.Td colSpan={4} style={{ padding: 0, border: 0 }}>
          <Collapse expanded={isExpanded}>
            <Box
              p="sm"
              style={{
                backgroundColor: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)',
              }}
            >
              <Text fz="sm" color={isDark ? 'white' : 'dimmed'}>
                {row.description || 'No additional details'}
              </Text>
            </Box>
          </Collapse>
        </Table.Td>
      </Table.Tr>,
    ];
  });

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            {/* Arrow header column */}
            <Table.Th style={{ width: 30, padding: 0 }} />
            <Th sorted={sortBy === 'id'} reversed={reverseSortDirection} onSort={() => setSorting('id')}>
              <Text component="span" fw={700} fz="sm" style={{ color: 'var(--mantine-color-blue-7)' }}>
                Target ID
              </Text>
            </Th>
            <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
              <Text component="span" fw={700} fz="sm" style={{ color: 'var(--mantine-color-blue-7)' }}>
                Name
              </Text>
            </Th>
            <Th sorted={sortBy === 'baseUrl'} reversed={reverseSortDirection} onSort={() => setSorting('baseUrl')}>
              <Text component="span" fw={700} fz="sm" style={{ color: 'var(--mantine-color-blue-7)' }}>
                Base URL
              </Text>
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}