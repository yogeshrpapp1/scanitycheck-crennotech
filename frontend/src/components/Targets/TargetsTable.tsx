import { useEffect, useState, useCallback } from 'react';
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
  Stack,
  SimpleGrid,
  Loader,
  Pagination,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classes from './TargetsTable.module.css';
import { TargetResponse } from '@/api/types';
import { targetsService } from '@/api/targetsService';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  width?: number | string;
}

interface TargetsTableProps {
  onRegisterRefresh?: (refreshFn: (isInitial: boolean) => void) => void;
}

function Th({ children, reversed, sorted, onSort, width }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronDown : IconChevronUp) : IconSelector;
  return (
    <Table.Th style={{ width }} className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={700} fz="sm" c="blue.7">
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

function filterData(data: TargetResponse[], search: string) {
  const query = search.toLowerCase().trim();
  if (!query) {return data;}
  return data.filter((item) =>
    keys(item).some((key) =>
      String(item[key as keyof TargetResponse]).toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: TargetResponse[],
  payload: { sortBy: keyof TargetResponse | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;
  const filtered = filterData(data, payload.search);

  if (!sortBy) {return filtered;}

  return [...filtered].sort((a, b) => {
    const valA = String(a[sortBy]);
    const valB = String(b[sortBy]);
    
    if (payload.reversed) {
      return valB.localeCompare(valA);
    }
    return valA.localeCompare(valB);
  });
}

export function TargetsTable({ onRegisterRefresh }: TargetsTableProps) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [masterData, setMasterData] = useState<TargetResponse[]>([]); // Source of truth
  const [sortedData, setSortedData] = useState<TargetResponse[]>([]);
  const [sortBy, setSortBy] = useState<keyof TargetResponse | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 10;

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchTargets = useCallback(async (isInitialLoad = false) => {
      if (isInitialLoad) {setLoading(true);}
      try {
        const res = await targetsService.getAll();
        setMasterData(res);
        // Immediately apply current sort/search to new data
        setSortedData(sortData(res, { sortBy, reversed: reverseSortDirection, search }));
      } catch (err) {
        notifications.show({
          title: 'Error',
          message: 'Failed to load targets.',
          color: 'red',
        });
      } finally {
        if (isInitialLoad) {setLoading(false);}
      }
    }, [sortBy, reverseSortDirection, search]);

  useEffect(() => {
    if (onRegisterRefresh) {
      onRegisterRefresh(fetchTargets);
    }
  }, [onRegisterRefresh, fetchTargets]);

  useEffect(() => {
    fetchTargets(true);
  }, [fetchTargets]);

  const setSorting = (field: keyof TargetResponse) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(masterData, { sortBy: field, reversed, search }));
  };

  const startRange = (activePage - 1) * rowsPerPage;
  const endRange = startRange + rowsPerPage;
  const paginatedData = sortedData.slice(startRange, endRange);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setActivePage(1);
    setSortedData(sortData(masterData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {newSet.delete(id);}
    else {newSet.add(id);}
    setExpandedRows(newSet);
  };

  // if (loading) {
  //   return <Center p="xl"><Loader /></Center>;
  // }

  const rows = paginatedData.flatMap((row) => {
    const isExpanded = expandedRows.has(row.id.toString());
    return [
      <Table.Tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => toggleRow(row.id.toString())}>
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
        <Table.Td> 
          <Text size="sm" truncate="end">
            {row.baseUrl}
          </Text>
        </Table.Td>
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
              <Stack gap="md">
                <SimpleGrid cols={3} spacing="lg">
                  <div>
                    <Text size="xs" fw={700} c="dimmed">CLIENT NAME</Text>
                    <Text size="sm" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>{row.clientName || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text size="xs" fw={700} c="dimmed">PRODUCT NAME</Text>
                    <Text size="sm" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>{row.productName || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text size="xs" fw={700} c="dimmed">ENVIRONMENT</Text>
                    <Text size="sm" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>{row.environment}</Text>
                  </div>
                </SimpleGrid>

                <SimpleGrid cols={3} spacing="lg">
                  <div>
                    <Text size="xs" fw={700} c="dimmed">AUTH REQUIRED</Text>
                    <Text size="sm">{row.requiresAuth ? 'Yes' : 'No'}</Text>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Text size="xs" fw={700} c="dimmed">AUTH HEADER</Text>
                    <Box
                      style={{
                        maxHeight: 100,
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        fontSize: 'var(--mantine-font-size-xs)',
                        backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`
                      }}
                    >
                     {row.authHeader || 'None'}
                    </Box>
                  </div>
                </SimpleGrid>

                <div>
                  <Text size="xs" fw={700} c="dimmed">BASE URL</Text>
                  <Text size="sm" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>{row.baseUrl || 'N/A'}</Text>
                </div>

                <div>
                  <Text size="xs" fw={700} c="dimmed">NOTES</Text>
                  <Text size="sm" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>{row.notes || 'No notes available.'}</Text>
                </div>
              </Stack>
            </Box>
          </Collapse>
        </Table.Td>
      </Table.Tr>,
    ];
  });

  return (
    <ScrollArea>
      {loading && masterData.length === 0 ? (
        <Center p="xl" h={300}><Loader /></Center>
      ) : (
        <>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {/* Arrow header column */}
              <Table.Th style={{ width: 30, padding: 0 }} />
    
                <Th width={180} sorted={sortBy === 'id'} reversed={reverseSortDirection} onSort={() => setSorting('id')}>
                    Target ID
                </Th>

                <Th width={300} sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
                    Name
                </Th>
    
                <Th sorted={sortBy === 'baseUrl'} reversed={reverseSortDirection} onSort={() => setSorting('baseUrl')}>
                    Base URL
                </Th>
    
            </Table.Tr>
          </Table.Thead>
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

        <Group justify="right" mt="xl" mb="md">
          <Pagination 
            total={Math.ceil(sortedData.length / rowsPerPage)} 
            value={activePage} 
            onChange={(page) => {
              setActivePage(page);
              // Optional: Scroll to top of table when page changes
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </Group>
        </>
      )}
    </ScrollArea>
  );
}