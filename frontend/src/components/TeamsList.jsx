import { useEffect, useState } from 'react';
import { 
  Avatar, Group, Text, Title, Card, SimpleGrid, LoadingOverlay, 
  Button, Modal, TextInput, MultiSelect, ActionIcon, Menu, 
  ThemeIcon, Tooltip, Divider, Badge, Box 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPlus, IconDotsVertical, IconEdit, IconTrash, 
  IconUsers, IconBriefcase 
} from '@tabler/icons-react';
import { api, endpoints } from '../api';

export function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [editingTeam, setEditingTeam] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get(endpoints.teams),
      api.get('/users/') 
    ])
    .then(([teamsRes, usersRes]) => {
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userOptions = users.map(u => ({ value: String(u.id), label: u.name }));

  const handleOpenModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setName(team.name);
      setSelectedMembers(team.members ? team.members.map(m => String(m.id)) : []);
    } else {
      setEditingTeam(null);
      setName('');
      setSelectedMembers([]);
    }
    open();
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      member_ids: selectedMembers.map(id => parseInt(id))
    };

    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, payload);
      } else {
        await api.post('/teams/', payload);
      }
      close();
      fetchData(); 
    } catch (error) {
      console.error("Failed to save team", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? Members will be unassigned.")) {
      await api.delete(`/teams/${id}`);
      fetchData();
    }
  };

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl" align="center">
        <div>
          <Title order={2}>Maintenance Teams</Title>
          <Text c="dimmed" size="sm">Manage your workforce and assignments</Text>
        </div>
        <Button leftSection={<IconPlus size={18}/>} onClick={() => handleOpenModal()} size="md">
          Create New Team
        </Button>
      </Group>

      <div style={{ position: 'relative', minHeight: '200px' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {teams.map(team => (
            <Card 
              key={team.id} 
              shadow="sm" 
              padding="lg" 
              radius="md" 
              withBorder 
              style={{ 
                borderTop: '4px solid var(--mantine-color-blue-filled)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <IconBriefcase size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} size="lg" style={{ lineHeight: 1.2 }}>{team.name}</Text>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={1}>Team</Text>
                  </div>
                </Group>
                
                <Menu position="bottom-end" shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={18}/></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEdit size={16}/>} onClick={() => handleOpenModal(team)}>
                      Edit Team
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<IconTrash size={16}/>} color="red" onClick={() => handleDelete(team.id)}>
                      Delete Team
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Divider mb="md" />

              <Group mb="xs">
                <IconUsers size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                <Text size="sm" fw={500} c="dimmed">
                  Team Members ({team.members ? team.members.length : 0})
                </Text>
              </Group>
              
              <div style={{ minHeight: '40px' }}>
                {team.members && team.members.length > 0 ? (
                  <Tooltip.Group openDelay={300} closeDelay={100}>
                    <Avatar.Group spacing="sm">
                      {team.members.slice(0, 5).map(member => (
                        <Tooltip key={member.id} label={member.name} withArrow>
                          <Avatar src={member.avatar_url} radius="xl" alt={member.name} color="initials">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                          </Avatar>
                        </Tooltip>
                      ))}
                      {team.members.length > 5 && (
                        <Tooltip label={`${team.members.length - 5} more technicians`}>
                          <Avatar radius="xl">+{team.members.length - 5}</Avatar>
                        </Tooltip>
                      )}
                    </Avatar.Group>
                  </Tooltip.Group>
                ) : (
                  <Badge color="gray" variant="light" size="lg" fullWidth style={{ textTransform: 'none', fontWeight: 500 }}>
                    No technicians assigned
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </div>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Title order={3}>{editingTeam ? "Edit Team Details" : "Create New Team"}</Title>}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput 
          label="Team Name" 
          description="Enter a descriptive name for the team"
          placeholder="e.g. Mechanical Repair Alpha" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          mb="md"
          data-autofocus
        />
        
        <MultiSelect
          label="Assign Technicians"
          description="Select users to add to this team"
          placeholder="Search for technicians..."
          data={userOptions}
          value={selectedMembers}
          onChange={setSelectedMembers}
          searchable
          nothingFoundMessage="No users found"
          clearable
          mb="xl"
          maxDropdownHeight={200}
        />
        
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>Cancel</Button>
          <Button onClick={handleSubmit} color="blue">
            {editingTeam ? "Save Changes" : "Create Team"}
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}