import { AppShell, Box, Burger, Code, Group, Overlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { NavbarSimpleColored } from './NavbarSimpleColored/NavbarSimpleColored';
import classes from './Layout.module.css'

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // Desktop: height 0 (invisible). Mobile: height 60
      header={{ height: { base: 60, sm: 0 } }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      styles={{
        navbar: {
        // This caps the drawer width on mobile
        width: 300,
        maxWidth: '300px',
        // This ensures it doesn't leave a white gap if the screen is 300px
        left: 0, 
      },
    }}
    >
      {/* Mobile-only header */}
      <AppShell.Header hiddenFrom="sm" className={classes.mobileHeader}>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" style={{ flex: 1, minWidth: 0, flexWrap: 'nowrap' }}>
            <Box w={34} h={34} display="flex" style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Burger opened={opened} onClick={toggle} size="sm" color="white" />
            </Box>
            <Text fw={700} c="white" size="lg" ff="monospace" style={{ letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
              ScanityCheck<Text span c="blue.5" ml={2} className={classes.blinkingCursor}>_</Text>
            </Text>
          </Group>
          <Code fw={700} className={classes.version}>v1.0.0</Code>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={0}>
        {/* Desktop navbar */}
        <NavbarSimpleColored opened={opened} toggle={toggle}/>
      </AppShell.Navbar>

      {opened && (
        <Overlay 
          fixed 
          hiddenFrom="sm" 
          zIndex={99} 
          onClick={toggle} 
          opacity={0.5} 
          color="#000" 
        />
      )}

      <AppShell.Main>
        {/* The is where your Dashboard, Targets, Scans, etc. will appear */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}