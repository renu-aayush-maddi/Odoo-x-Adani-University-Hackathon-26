import { AppShell, Burger, Group, NavLink, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTool, IconUsers, IconSettings, IconLayoutKanban,  IconCalendar } from '@tabler/icons-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { IconChartBar } from '@tabler/icons-react';
import { IconBuildingFactory2 } from '@tabler/icons-react';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', icon: IconChartBar, link: '/dashboard' },
    { label: 'Maintenance Board', icon: IconLayoutKanban, link: '/' },
    { label: 'Calendar', icon: IconCalendar, link: '/calendar' },
    { label: 'Equipment', icon: IconTool, link: '/equipment' },
    { label: 'Work Centers', icon: IconBuildingFactory2, link: '/work-centers' },
    { label: 'Teams', icon: IconUsers, link: '/teams' },
  ];

  const items = links.map((item) => (
    <NavLink
      key={item.label}
      label={item.label}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      active={location.pathname === item.link}
      onClick={() => {
        navigate(item.link);
        if (window.innerWidth < 768) toggle(); // Mobile close
      }}
    />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap="xs">
            <IconSettings size={28} color="#228be6" />
            <Title order={3}>GearGuard</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" fw={500} c="dimmed" mb="sm">MODULES</Text>
        {items}
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet /> 
      </AppShell.Main>
    </AppShell>
  );
}