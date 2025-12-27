// import { AppShell, Burger, Group, NavLink, Text, Title } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { IconTool, IconUsers, IconSettings, IconLayoutKanban,  IconCalendar } from '@tabler/icons-react';
// import { useNavigate, useLocation, Outlet } from 'react-router-dom';
// import { IconChartBar } from '@tabler/icons-react';
// import { IconBuildingFactory2 } from '@tabler/icons-react';

// export function Layout() {
//   const [opened, { toggle }] = useDisclosure();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const links = [
//     { label: 'Dashboard', icon: IconChartBar, link: '/dashboard' },
//     { label: 'Maintenance Board', icon: IconLayoutKanban, link: '/' },
//     { label: 'Calendar', icon: IconCalendar, link: '/calendar' },
//     { label: 'Equipment', icon: IconTool, link: '/equipment' },
//     { label: 'Work Centers', icon: IconBuildingFactory2, link: '/work-centers' },
//     { label: 'Teams', icon: IconUsers, link: '/teams' },
//   ];

//   const items = links.map((item) => (
//     <NavLink
//       key={item.label}
//       label={item.label}
//       leftSection={<item.icon size="1rem" stroke={1.5} />}
//       active={location.pathname === item.link}
//       onClick={() => {
//         navigate(item.link);
//         if (window.innerWidth < 768) toggle(); // Mobile close
//       }}
//     />
//   ));

//   return (
//     <AppShell
//       header={{ height: 60 }}
//       navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
//       padding="md"
//     >
//       <AppShell.Header>
//         <Group h="100%" px="md">
//           <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
//           <Group gap="xs">
//             <IconSettings size={28} color="#228be6" />
//             <Title order={3}>GearGuard</Title>
//           </Group>
//         </Group>
//       </AppShell.Header>

//       <AppShell.Navbar p="md">
//         <Text size="xs" fw={500} c="dimmed" mb="sm">MODULES</Text>
//         {items}
//       </AppShell.Navbar>

//       <AppShell.Main bg="gray.0">
//         <Outlet /> 
//       </AppShell.Main>
//     </AppShell>
//   );
// }

import { AppShell, Burger, Group, NavLink, Text, Title, Menu, Avatar, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTool, IconUsers, IconSettings, IconLayoutKanban, IconCalendar, IconChartBar, IconBuildingFactory2, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // <--- Import Store

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get User and Logout function from store
  const { user, logout } = useAuthStore(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        if (window.innerWidth < 768) toggle();
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
        <Group h="100%" px="md" justify="space-between">
          {/* LEFT SIDE: Logo */}
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconSettings size={28} color="#228be6" />
            <Title order={3}>GearGuard</Title>
          </Group>

          {/* RIGHT SIDE: User Profile */}
          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar radius="xl" color="blue">
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>{user.name}</Text>
                      <Text size="xs" c="dimmed">{user.user_type}</Text>
                    </div>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
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