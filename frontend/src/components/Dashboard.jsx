
import { useEffect, useState } from 'react';
import { Grid, Card, Title, Text, Group, Table, Badge, Paper, TextInput, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // <--- Import this
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { api, endpoints } from '../api';
import dayjs from 'dayjs';
import { RequestDetailsDrawer } from './RequestDetailsDrawer'; 
import { CreateRequestModal } from './CreateRequestModal'; // <--- Import the Modal

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, load: 0 });
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  
  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Create Modal State
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false); // <--- Hook

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(endpoints.requests);
      const reqs = res.data;
      setRequests(reqs);

      // --- CALCULATE KPI MOCK DATA ---
      const criticalCount = reqs.filter(r => r.priority === 3).length; 
      const openCount = reqs.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;
      const loadPercentage = 85; 

      setStats({
        critical: criticalCount + 2, 
        load: loadPercentage,
        open: openCount
      });

    } catch (error) {
      console.error("Failed to fetch dashboard data");
    }
  };

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    setDrawerOpen(true);
  };

  const filteredRequests = requests.filter(r => 
    r.subject.toLowerCase().includes(search.toLowerCase()) || 
    r.equipment?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 1. TOP BAR with "New" Button Working */}
      <Group justify="space-between" mb="lg">
         <Button 
            leftSection={<IconPlus size={16}/>} 
            variant="outline" 
            color="dark" 
            radius="md" 
            style={{ border: '2px solid #333' }}
            onClick={openCreate} // <--- CLICK HANDLER
         >
            New
         </Button>

         <TextInput 
            placeholder="Search..." 
            leftSection={<IconSearch size={16} />} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 400 }}
         />
      </Group>

      {/* 2. KPI CARDS */}
      <Grid mb="xl">
        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fff5f5', borderColor: '#ffc9c9', textAlign: 'center' }}>
            <Text c="red" fw={500} mb="xs">Critical Equipment</Text>
            <Text size="xl" fw={700} c="red">{stats.critical} Units</Text>
            <Text size="xs" c="red.6">(Health &lt; 30%)</Text>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#e7f5ff', borderColor: '#a5d8ff', textAlign: 'center' }}>
            <Text c="blue" fw={500} mb="xs">Technician Load</Text>
            <Text size="xl" fw={700} c="blue">{stats.load}% Utilized</Text>
            <Text size="xs" c="blue.6">(Assign Carefully)</Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#ebfbee', borderColor: '#b2f2bb', textAlign: 'center' }}>
             <Text c="green" fw={500} mb="xs">Open Requests</Text>
             <Text size="xl" fw={700} c="green">{stats.open} Pending</Text>
             <Text size="xs" c="green.6">3 Overdue</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 3. LIST VIEW */}
      <Paper shadow="sm" radius="md" withBorder>
        <Table stickyHeader striped highlightOnHover>
          <Table.Thead style={{ borderBottom: '2px dashed #ccc' }}>
            <Table.Tr>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Technician</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Stage</Table.Th>
              <Table.Th>Company</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRequests.map((req) => (
               <Table.Tr key={req.id} onClick={() => handleRowClick(req)} style={{ cursor: 'pointer' }}>
                  <Table.Td fw={500}>{req.subject}</Table.Td>
                  <Table.Td>Mitchell Admin</Table.Td>
                  <Table.Td>{req.technician?.name || 'Unassigned'}</Table.Td>
                  <Table.Td>{req.equipment?.category || 'Machinery'}</Table.Td>
                  <Table.Td>
                      <Badge variant="light" color={req.stage === 'New' ? 'blue' : req.stage === 'In Progress' ? 'orange' : 'green'}>
                        {req.stage}
                      </Badge>
                  </Table.Td>
                  <Table.Td>My Company</Table.Td>
               </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* 4. DRAWER & MODAL */}
      <RequestDetailsDrawer 
        opened={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        request={selectedRequest} 
      />

      <CreateRequestModal 
        opened={createOpened} 
        close={closeCreate} 
        onSuccess={fetchData} // Refresh dashboard after create
      />
    </div>
  );
}