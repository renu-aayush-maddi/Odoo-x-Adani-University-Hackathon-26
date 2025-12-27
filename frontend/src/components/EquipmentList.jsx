import { useEffect, useState } from 'react';
import { Table, Title, Button, Drawer, Group, Text, Badge, ActionIcon, Stack, Grid, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEye, IconTool, IconBuildingFactory } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../api';
import dayjs from 'dayjs';

export function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(endpoints.equipment).then(res => setEquipment(res.data));
  }, []);

  // When opening details, fetch the "Smart Button" count
  const handleViewDetails = async (item) => {
    setSelectedItem(item);
    try {
      const res = await api.get(`/equipment/${item.id}/stats`);
      setRequestCount(res.data.open_requests);
      open();
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  // The Smart Button Action: Go to Kanban filtered by this machine
  const navigateToMaintenance = () => {
    navigate(`/?equipmentId=${selectedItem.id}`);
  };

  const rows = equipment.map((item) => {
    // --- SCRAP LOGIC VISUALS ---
    // If is_active is false (0), the machine is Scrapped.
    const isScrapped = !item.is_active; 

    return (
      <Table.Tr 
        key={item.id} 
        style={{ 
            opacity: isScrapped ? 0.6 : 1, 
            backgroundColor: isScrapped ? '#fff5f5' : undefined 
        }}
      >
        <Table.Td style={{ fontWeight: 500 }}>
          {item.name}
          {isScrapped && <Badge color="red" size="xs" ml="xs">SCRAPPED</Badge>}
        </Table.Td>
        <Table.Td>{item.serial_number}</Table.Td>
        <Table.Td><Badge variant="outline">{item.category}</Badge></Table.Td>
        <Table.Td>{item.department}</Table.Td>
        <Table.Td>
          <ActionIcon variant="light" onClick={() => handleViewDetails(item)}>
            <IconEye size="1rem" />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <Title order={2} mb="md">Equipment Assets</Title>
      
      <Table stickyHeader striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Serial #</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* The "Equipment Form" Drawer */}
      <Drawer 
        opened={opened} 
        onClose={close} 
        title={<Text fw={700} size="lg">{selectedItem?.name}</Text>} 
        position="right"
        size="md"
      >
        {selectedItem && (
          <Stack gap="lg">
            {/* --- THE SMART BUTTON  --- */}
            <Button 
              fullWidth 
              size="lg" 
              variant="light" 
              color="blue"
              leftSection={<IconTool />}
              rightSection={
                <Badge color="blue" variant="filled" circle>
                  {requestCount}
                </Badge>
              }
              onClick={navigateToMaintenance}
            >
              Maintenance Requests
            </Button>
            {/* ------------------------- */}

            {!selectedItem.is_active && (
                <Badge color="red" size="xl" fullWidth>⚠️ EQUIPMENT SCRAPPED</Badge>
            )}

            <Grid>
              <Grid.Col span={6}>
                <Text c="dimmed" size="xs">SERIAL NUMBER</Text>
                <Text fw={500}>{selectedItem.serial_number}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text c="dimmed" size="xs">CATEGORY</Text>
                <Text fw={500}>{selectedItem.category}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text c="dimmed" size="xs">LOCATION</Text>
                <Text fw={500}>{selectedItem.location}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text c="dimmed" size="xs">WARRANTY EXP</Text>
                <Text fw={500}>{selectedItem.warranty_expiration ? dayjs(selectedItem.warranty_expiration).format('YYYY-MM-DD') : 'N/A'}</Text>
              </Grid.Col>
            </Grid>

            <Group>
              <ThemeIcon variant="light" size="xl"><IconBuildingFactory /></ThemeIcon>
              <div>
                <Text size="sm" fw={500}>Department</Text>
                <Text c="dimmed">{selectedItem.department}</Text>
              </div>
            </Group>
          </Stack>
        )}
      </Drawer>
    </div>
  );
}