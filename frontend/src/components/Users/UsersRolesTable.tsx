import { useEffect, useMemo, useState } from 'react';
import { Avatar, Group, Select, Table, Text, Loader, Center, Badge, Pagination, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { usersService } from '@/api/usersService';
import { UserResponse } from '@/api/types';
import { IconChevronDown } from '@tabler/icons-react';

const rolesData = ['Admin', 'Manager', 'Staff'];

export function UsersRolesTable() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return users.slice(start, start + itemsPerPage);
  }, [users, activePage]);

  useEffect(() => {
    usersService.getAll()
      .then(setUsers)
      .catch(() => {
        notifications.show({
          title: 'Error',
          message: 'Failed to load users',
          color: 'red',
        });
      })
      .finally(() => setLoading(false));
      setUpdatingId(null);
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    // Guard: Do not allow changes to the primary admin
    if (userId === 1) {return;}

    setUpdatingId(userId);
    try {
      await usersService.updateRole(userId, newRole);
      notifications.show({ message: `Role updated for user ${userId}`, color: 'green' });
    } catch (error) {
      notifications.show({ message: 'Failed to update role', color: 'red' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Center p="xl"><Loader /></Center>;
  }

  const rows = paginatedUsers.map((user) => {

    const initials = (user.fullName || '?')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

    const colors = ['blue', 'cyan', 'grape', 'indigo', 'violet', 'teal'];
    const avatarColor = colors[(user.fullName || '').length % colors.length];
    
    return (
    <Table.Tr key={user.id}>
      {/* ID Column */}
      <Table.Td style={{ width: 80 }}>
        <Text fz="xs" c="dimmed" fw={700}>#{user.id}</Text>
      </Table.Td>

      {/* Employee Info with Initials Avatar */}
      <Table.Td>
        <Group gap="sm" align="center" wrap="nowrap">
          {/* Providing no src and just a name generates initials-based colors/letters */}
          <Avatar 
            size={40} 
            radius={40} 
            color={avatarColor} 
            variant="light"
          >
            {initials}
          </Avatar>
          <div>
            <Group gap={5}>
              <Text fz="sm" fw={500} truncate>
                {user.fullName}
              </Text>
              {user.id === 1 && (
                <Badge size="xs" variant="outline" color="gray">System</Badge>
              )}
            </Group>
            <Text fz="xs" c="dimmed" truncate>
              {user.email}
            </Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        <Select
          data={rolesData}
          defaultValue={user.role}
          variant="unstyled"
          allowDeselect={false}
          onChange={(value) => value && handleRoleChange(user.id, value)}
          disabled={user.id === 1 || updatingId === user.id} 
          rightSection={
            updatingId === user.id ? (
              <Loader size={12} />
            ) : user.id === 1 ? (
              null // Hide arrow for the system user who can't be edited
            ) : (
              <IconChevronDown size={14} stroke={1.5} style={{ opacity: 1 }} />
            )
          }

          rightSectionPointerEvents="none"

          styles={{
            input: {
              // Removes the gray background and border-like artifacts
              backgroundColor: 'transparent',
              paddingRight: '30px',
              '&:disabled': {
                backgroundColor: 'transparent',
                opacity: 1, // Keep text fully visible or keep your 0.7 from below
                color: 'inherit',
                cursor: 'not-allowed',
              },
            },
          }}    
          style={{ 
            opacity: user.id === 1 ? 0.7 : 1,
            cursor: user.id === 1 ? 'not-allowed' : 'default'
          }}
        />
      </Table.Td>
      
      <Table.Td>
        <Text fz="xs" c="dimmed">
          {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </Table.Td>
    </Table.Tr>
    );
  });

return (
  <Stack gap="md">
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Joined</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={4} ta="center">No users found</Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>

    {totalPages > 1 && (
      <Group justify="flex-end" pb="xl">
        <Pagination 
          total={totalPages} 
          value={activePage} 
          onChange={setActivePage} 
          color="blue"
          size="sm"
          withEdges
        />
      </Group>
    )}
  </Stack>
  );
}