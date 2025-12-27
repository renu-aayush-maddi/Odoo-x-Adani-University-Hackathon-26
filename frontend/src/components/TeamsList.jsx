import { useEffect, useState } from 'react';
import { Avatar, Group, Text, Title, Badge, Card, SimpleGrid, LoadingOverlay, Button, Modal, TextInput, MultiSelect, ActionIcon, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
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

  // Prepare User Options for MultiSelect
  const userOptions = users.map(u => ({ value: String(u.id), label: u.name }));

  const handleOpenModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setName(team.name);
      // Pre-fill existing members
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
      // FIXED: Changed '#' to '//' below
      member_ids: selectedMembers.map(id => parseInt(id)) // Convert back to Int for API
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
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Maintenance Teams</Title>
        <Button leftSection={<IconPlus size={16}/>} onClick={() => handleOpenModal()}>Create Team</Button>
      </Group>

      <LoadingOverlay visible={loading} />
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {teams.map(team => (
          <Card key={team.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={700} size="lg">{team.name}</Text>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16}/></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEdit size={14}/>} onClick={() => handleOpenModal(team)}>Edit</Menu.Item>
                  <Menu.Item leftSection={<IconTrash size={14}/>} color="red" onClick={() => handleDelete(team.id)}>Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              {team.members ? team.members.length : 0} Members assigned.
            </Text>
            
            <Group gap="xs">
              {team.members && team.members.length > 0 ? (
                team.members.map(member => (
                   <Group key={member.id} gap="xs" style={{ border: '1px solid #eee', padding: '4px 8px', borderRadius: '16px' }}>
                     <Avatar src={member.avatar_url} radius="xl" size="xs" />
                     <Text size="sm">{member.name}</Text>
                   </Group>
                ))
              ) : (
                <Text size="sm" c="dimmed" fs="italic">No technicians</Text>
              )}
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Modal opened={opened} onClose={close} title={editingTeam ? "Edit Team" : "Create Team"}>
        <TextInput 
          label="Team Name" 
          placeholder="e.g. Electrical Repair" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          mb="md"
        />
        
        <MultiSelect
          label="Assign Members"
          placeholder="Select technicians"
          data={userOptions}
          value={selectedMembers}
          onChange={setSelectedMembers}
          searchable
          nothingFoundMessage="No users found"
          mb="lg"
        />
        
        <Button fullWidth onClick={handleSubmit}>
          {editingTeam ? "Update Team" : "Create Team"}
        </Button>
      </Modal>
    </div>
  );
}