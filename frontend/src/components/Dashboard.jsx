import { useEffect, useState } from 'react';
import { Grid, Title, Text, Group, Table, Badge, Paper, TextInput, Button, LoadingOverlay, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { api, endpoints } from '../api';
import { RequestDetailsDrawer } from './RequestDetailsDrawer'; 
import { CreateRequestModal } from './CreateRequestModal';

export function Dashboard() {
  // 1. Updated state to hold counts for ALL 4 stages
  const [stats, setStats] = useState({ 
    total: 0, 
    critical: 0, 
    load: 0, 
    breakdown: { new: 0, inProgress: 0, repaired: 0, scrap: 0 } 
  });
  
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Create Modal State
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, userRes] = await Promise.all([
          api.get(endpoints.requests),
          api.get(endpoints.users)
      ]);
      
      const reqs = reqRes.data;
      const technicians = userRes.data;

      setRequests(reqs);

      // --- DYNAMIC CALCULATIONS ---
      const criticalCount = reqs.filter(r => r.priority === 3).length; 
      
      // 2. Calculate counts for ALL statuses
      const newCount = reqs.filter(r => r.stage === 'New').length;
      const inProgressCount = reqs.filter(r => r.stage === 'In Progress').length;
      const repairedCount = reqs.filter(r => r.stage === 'Repaired').length;
      const scrapCount = reqs.filter(r => r.stage === 'Scrap').length;

      const activeTasks = newCount + inProgressCount;
      const totalTechs = technicians.length || 1; 
      const maxCapacity = totalTechs * 3; 
      
      let loadPercentage = Math.round((activeTasks / maxCapacity) * 100);
      if (loadPercentage > 100) loadPercentage = 100; 

      setStats({
        total: reqs.length, // Store total count
        critical: criticalCount, 
        load: loadPercentage,
        breakdown: {       
            new: newCount,
            inProgress: inProgressCount,
            repaired: repairedCount,
            scrap: scrapCount
        }
      });

    } catch (error) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
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

  const getStageColor = (stage) => {
      switch (stage) {
          case 'New': return 'blue';
          case 'In Progress': return 'orange';
          case 'Repaired': return 'green';
          case 'Scrap': return 'red';
          default: return 'gray';
      }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      {/* 1. TOP BAR */}
      <Group justify="space-between" mb="lg">
         <Button 
            leftSection={<IconPlus size={16}/>} 
            variant="outline" 
            color="dark" 
            radius="md" 
            style={{ border: '2px solid #333' }}
            onClick={openCreate} 
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
          {/* 3. CHANGED: Request Summary Card */}
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#ebfbee', borderColor: '#b2f2bb', textAlign: 'center' }}>
             <Text c="green" fw={500} mb="xs">Request Summary</Text>
             <Text size="xl" fw={700} c="green" mb={8}>{stats.total} Total</Text>
             
             {/* Dynamic Badges for ALL 4 Statuses */}
             <Group justify="center" gap={6} style={{ rowGap: '8px' }}>
                <Badge variant="dot" color="blue" size="sm">
                    {stats.breakdown.new} New
                </Badge>
                <Badge variant="dot" color="orange" size="sm">
                    {stats.breakdown.inProgress} In Prog
                </Badge>
                <Badge variant="dot" color="green" size="sm">
                    {stats.breakdown.repaired} Fixed
                </Badge>
                <Badge variant="dot" color="red" size="sm">
                    {stats.breakdown.scrap} Scrap
                </Badge>
             </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 3. LIST VIEW TABLE */}
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
                      <Badge variant="light" color={getStageColor(req.stage)}>
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
        onUpdate={fetchData} 
      />

      <CreateRequestModal 
        opened={createOpened} 
        close={closeCreate} 
        onSuccess={fetchData} 
      />
    </Box>
  );
}