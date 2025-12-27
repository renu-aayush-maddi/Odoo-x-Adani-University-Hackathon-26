import { useEffect, useState } from 'react';
import { Table, Title, Paper, Badge, Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { api } from '../api';

export function WorkCenterList() {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/work-centers/').then(res => setCenters(res.data));
  }, []);

  const rows = centers
    .filter(wc => wc.name.toLowerCase().includes(search.toLowerCase()))
    .map((wc) => (
      <Table.Tr key={wc.id}>
        <Table.Td fw={500}>{wc.name}</Table.Td>
        <Table.Td>{wc.code}</Table.Td>
        <Table.Td>${wc.cost_per_hour.toFixed(2)}</Table.Td>
        <Table.Td>{wc.capacity}</Table.Td>
        <Table.Td>
          <Badge color={wc.oee_target > 80 ? 'green' : 'orange'}>
            {wc.oee_target}%
          </Badge>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Work Centers</Title>
        <TextInput 
          placeholder="Search..." 
          leftSection={<IconSearch size={14} />} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </Group>

      <Paper shadow="sm" radius="md" withBorder>
        <Table stickyHeader striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Work Center</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Cost per Hour</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>OEE Target</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}