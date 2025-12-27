import { useEffect, useState } from 'react';
import { Avatar, Group, Text, Title, Badge, Card, SimpleGrid, LoadingOverlay } from '@mantine/core';
import { api, endpoints } from '../api';

export function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoints.teams)
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Title order={2} mb="lg">Maintenance Teams</Title>
      <LoadingOverlay visible={loading} />
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {teams.map(team => (
          <Card key={team.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={700} size="lg">{team.name}</Text>
              <Badge color="blue" variant="light">
                {team.members ? team.members.length : 0} Members
              </Badge>
            </Group>

            <Text c="dimmed" size="sm" mb="md">
              Specialized in {team.name} repairs and maintenance for {team.name === 'IT Support' ? 'Computers' : 'Machinery'}.
            </Text>

            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
              Technicians
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
                <Text size="sm" c="dimmed" fs="italic">No technicians assigned</Text>
              )}
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}