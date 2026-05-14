import {
  IconShieldCode,
  IconHeartRateMonitor,
  IconTargetArrow,
  IconSearch,
  IconSettings,
  IconLogout,
  IconUsers,
  IconSquareLetterH,
  IconCodeDots,
  IconExternalLink,
  IconUserCircle,
  IconAt,
} from '@tabler/icons-react';

import { Avatar, Box, Code, Divider, Group, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import classes from './NavbarSimpleColored.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import { logoutUser } from '@/api/auth';
import { useEffect, useState } from 'react';

type NavItem = {
  type: 'internal' | 'external' | 'action';
  label: string;
  icon: any;
  // optional depending on type
  link?: string;
  onClick?: () => void;
};

const generalData: NavItem[] = [
  { type: 'internal', label: 'Dashboard', icon: IconHeartRateMonitor, link: '/dashboard', },
  { type: 'internal', label: 'Targets', icon: IconTargetArrow, link: '/targets', },
  { type: 'internal', label: 'Scans', icon: IconSearch, link: '/scans', },
  { type: 'internal', label: 'Settings', icon: IconSettings, link: '/settings', },
];

const adminData: NavItem[] = [
  { type: 'internal', label: 'Users', icon: IconUsers, link: '/users', },
  { type: 'external', label: 'Hangfire', icon: IconSquareLetterH, link: '/hangfire', },
  { type: 'external', label: 'Swagger UI Docs', icon: IconCodeDots, link: '/swagger', },
];

export function NavbarSimpleColored({ opened, toggle }: { opened: boolean; toggle: () => void; }) {
  const handleMobileClose = () => {
    if (window.innerWidth < 768) {
      toggle();
    }
  };  
  
  const navigate = useNavigate();

  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          name: parsedUser.fullName || 'First Last',
          email: parsedUser.email || 'email@email',
          role: parsedUser.role || 'Role',
        });
      } catch (error) {
        // If JSON is malformed, clear it
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const footerData: NavItem[] = [
    { type: 'action', label: 'Logout', icon: IconLogout,
      onClick: () => {
        modals.openConfirmModal({
          title: 'Logout Confirmation',
          centered: true,
          children: (
            <Text size="sm" ta='center'>
              Are you sure you want to log out?
            </Text>
          ),
          labels: { confirm: 'Logout', cancel: 'Cancel' },
          confirmProps: { color: 'red' },
          onConfirm: async () => {
            await logoutUser();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/', { replace: true });
          },
        });
      },
    },
  ];
  
  const renderLinks = (linkList: NavItem[]) =>
    linkList.map((item) => {
      // Internal Link
      if (item.type === 'internal') {
        return (
          <NavLink
            key={item.label}
            to={item.link!}
            className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link}
            onClick={handleMobileClose}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
          </NavLink>
        );
      }

      // External Link
      if (item.type === 'external') {
        return (
          <a
            key={item.label}
            href={item.link}
            className={classes.link}
            target="_blank"
            rel="noreferrer"
            style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <item.icon className={classes.linkIcon} stroke={1.5} />
              <span>{item.label}</span>
            </Box>

            <IconExternalLink className={classes.externalIcon}
              size={14} 
              stroke={1.5} 
            /> 
          </a>
        );
      }
      
      // Action Button
      return (
        <UnstyledButton
          key={item.label}
          className={classes.link}
          data-logout={item.label === 'Logout' || undefined}
          onClick={() => {
            item.onClick?.();
          }}
          style={{
            width: '100%',
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </UnstyledButton>
      );
    });

  return (
    <nav className={classes.navbar}>
      {/* 
          This group (the logo area) should only be visible on desktop.
          On mobile, the user already sees the logo in the AppShell.Header.
      */}
      <Group className={classes.header} justify="space-between" visibleFrom="sm">
        <Group gap="xs" h="100%" style={{ flex: 1, minWidth: 0 }}>
          <Box w={34} h={34} display="flex" style={{ flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
            <IconShieldCode size={28} color="white" />
          </Box>
          <Text fw={700} c="white" size="lg" ff="monospace" style={{ letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}> 
            ScanityCheck<Text span c="blue.5" ml={2} className={classes.blinkingCursor}>_</Text>
          </Text>
        </Group>
        <Code fw={700} className={classes.version} style={{ flexShrink: 0 }} visibleFrom="sm">
          v1.0.0
        </Code>
      </Group>

      <ScrollArea className={classes.navbarMain} scrollbarSize={6} type="hover" overscrollBehavior="contain">
        <div className={classes.navbarMain} data-opened={opened}>
          {/* General Section */}
          {renderLinks(generalData)}
          
          {/* Admin Section: Conditionally Rendered */}
          {user?.role === 'Admin' && (
            <>
              <Divider 
                my="md" 
                label={<Text size="xs" c="white">Admin</Text>}
                labelPosition="center" 
                color="blue.7"
              />
              {renderLinks(adminData)}
            </>
          )}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        {/* Footer Section */}
        <Box py="md" mb="md" style={{ borderBottom: '1px solid var(--mantine-color-blue-5)' }}>
          <Group wrap="nowrap" px="xs" align="center">
            {/* Column 1: Avatar + Toggle */}
            <Stack align="center" gap="xs">
              <Avatar
                size={56}
                radius="md"
                color="blue.1"
                variant="outline"
              >
                <IconUserCircle size={42} stroke={1} />
              </Avatar>
              
              <DarkModeToggle variant="transparent" />
            </Stack>

            {/* Column 2: User Text Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text fz="xs" c="gray.5" tt="uppercase" fw={700} style={{ wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                {user?.role || 'Loading...'}
              </Text>

              <Text fz="md" c="white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} >
                {user?.name || 'Loading...'}
              </Text>

              <Group wrap="nowrap" gap={5} mt={3} align="flex-start">
                <IconAt stroke={1.5} size={16} color="var(--mantine-color-gray-5)" style={{ flexShrink: 0, marginTop: 1 }}/>
                <Text fz="xs" c="gray.5" style={{ wordBreak: 'break-all' }}>
                  {user?.email || 'Loading...'}
                </Text>
              </Group>
            </div>
          </Group>
        </Box>
        {renderLinks(footerData)}
      </div>
    </nav>
  );
}
