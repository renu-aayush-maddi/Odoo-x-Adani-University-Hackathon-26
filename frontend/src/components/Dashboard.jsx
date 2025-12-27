// import { useEffect, useState } from 'react';
// import { Grid, Card, Title, Text, Group, ThemeIcon, RingProgress } from '@mantine/core';
// import { IconTool, IconAlertCircle, IconCheck } from '@tabler/icons-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// import { api, endpoints } from '../api';

// export function Dashboard() {
//   const [stats, setStats] = useState({ total: 0, open: 0, repaired: 0 });
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await api.get(endpoints.requests);
//       const reqs = res.data;

//       // 1. Calculate KPI Cards
//       const total = reqs.length;
//       const open = reqs.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;
//       const repaired = reqs.filter(r => r.stage === 'Repaired').length;

//       setStats({ total, open, repaired });

//       // 2. Prepare Chart Data (Group by Team)
//       // Result: [{ name: 'Mechanics', count: 5 }, { name: 'IT', count: 2 }]
//       const teamCounts = {};
//       reqs.forEach(r => {
//         const teamName = r.team ? r.team.name : 'Unassigned';
//         teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;
//       });

//       const data = Object.keys(teamCounts).map(key => ({
//         name: key,
//         requests: teamCounts[key],
//       }));

//       setChartData(data);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data");
//     }
//   };

//   return (
//     <div>
//       <Title order={2} mb="lg">Maintenance Overview</Title>

//       {/* KPI CARDS */}
//       <Grid mb="xl">
//         <Grid.Col span={4}>
//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Group justify="space-between" mb="xs">
//               <Text fw={500}>Active Requests</Text>
//               <ThemeIcon color="blue" variant="light"><IconAlertCircle size={20} /></ThemeIcon>
//             </Group>
//             <Text size="xl" fw={700}>{stats.open}</Text>
//             <Text size="xs" c="dimmed">Currently pending</Text>
//           </Card>
//         </Grid.Col>
        
//         <Grid.Col span={4}>
//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Group justify="space-between" mb="xs">
//               <Text fw={500}>Repaired Assets</Text>
//               <ThemeIcon color="green" variant="light"><IconCheck size={20} /></ThemeIcon>
//             </Group>
//             <Text size="xl" fw={700}>{stats.repaired}</Text>
//             <Text size="xs" c="dimmed">Successfully closed</Text>
//           </Card>
//         </Grid.Col>

//         <Grid.Col span={4}>
//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Group justify="space-between" mb="xs">
//               <Text fw={500}>Total Requests</Text>
//               <ThemeIcon color="gray" variant="light"><IconTool size={20} /></ThemeIcon>
//             </Group>
//             <Text size="xl" fw={700}>{stats.total}</Text>
//             <Text size="xs" c="dimmed">All time volume</Text>
//           </Card>
//         </Grid.Col>
//       </Grid>

//       {/* CHART SECTION */}
//       <Grid>
//         <Grid.Col span={8}>
//           <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Title order={4} mb="md">Requests per Team</Title>
//             <div style={{ height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis allowDecimals={false} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="requests" fill="#228be6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Grid.Col>

//         <Grid.Col span={4}>
//            {/* You could add a Pie Chart here for Request Types (Corrective vs Preventive) if you want */}
//            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
//              <Title order={4} mb="md">Health Score</Title>
//              <Group justify="center" mt="xl">
//                 <RingProgress
//                   size={180}
//                   thickness={16}
//                   roundCaps
//                   sections={[{ value: (stats.repaired / stats.total) * 100 || 0, color: 'green' }]}
//                   label={
//                     <Text ta="center" fz="lg" fw={700}>
//                       {stats.total > 0 ? Math.round((stats.repaired / stats.total) * 100) : 0}%
//                     </Text>
//                   }
//                 />
//              </Group>
//              <Text ta="center" mt="md" size="sm" c="dimmed">Completion Rate</Text>
//            </Card>
//         </Grid.Col>
//       </Grid>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Grid, Card, Title, Text, Group, Table, Badge, Paper, TextInput, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { api, endpoints } from '../api';
import dayjs from 'dayjs';
import { RequestDetailsDrawer } from './RequestDetailsDrawer'; // Import the new component

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, load: 0 });
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  
  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(endpoints.requests);
      const reqs = res.data;
      setRequests(reqs);

      // --- CALCULATE KPI MOCK DATA ---
      // 1. Critical Equipment (Health < 30%) - We'll mock this based on "Scrap" or "Corrective" volume
      const criticalCount = reqs.filter(r => r.priority === 3).length; 

      // 2. Open Requests
      const openCount = reqs.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;
      
      // 3. Technician Load (Mock calculation)
      // Assume 40 hours capacity. Total hours assigned?
      const loadPercentage = 85; 

      setStats({
        critical: criticalCount + 2, // Mocking a bit to match "5 Units" in image
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

  // Filter for the list view
  const filteredRequests = requests.filter(r => 
    r.subject.toLowerCase().includes(search.toLowerCase()) || 
    r.equipment?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 1. TOP BAR with Search and "New" Button (Matches wireframe layout) */}
      <Group justify="space-between" mb="lg">
         <Button variant="outline" color="dark" radius="md" style={{ border: '2px solid #333' }}>
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

      {/* 2. KPI CARDS (Matching Colors: Red, Blue, Green) */}
      <Grid mb="xl">
        {/* RED CARD: Critical Equipment */}
        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fff5f5', borderColor: '#ffc9c9', textAlign: 'center' }}>
            <Text c="red" fw={500} mb="xs">Critical Equipment</Text>
            <Text size="xl" fw={700} c="red">{stats.critical} Units</Text>
            <Text size="xs" c="red.6">(Health &lt; 30%)</Text>
          </Paper>
        </Grid.Col>
        
        {/* BLUE CARD: Technician Load */}
        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#e7f5ff', borderColor: '#a5d8ff', textAlign: 'center' }}>
            <Text c="blue" fw={500} mb="xs">Technician Load</Text>
            <Text size="xl" fw={700} c="blue">{stats.load}% Utilized</Text>
            <Text size="xs" c="blue.6">(Assign Carefully)</Text>
          </Paper>
        </Grid.Col>

        {/* GREEN CARD: Open Requests */}
        <Grid.Col span={4}>
          <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#ebfbee', borderColor: '#b2f2bb', textAlign: 'center' }}>
             <Text c="green" fw={500} mb="xs">Open Requests</Text>
             <Text size="xl" fw={700} c="green">{stats.open} Pending</Text>
             <Text size="xs" c="green.6">3 Overdue</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 3. LIST VIEW (Table) */}
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

      {/* 4. THE REQUEST DETAILS DRAWER */}
      <RequestDetailsDrawer 
        opened={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        request={selectedRequest} 
      />
    </div>
  );
}