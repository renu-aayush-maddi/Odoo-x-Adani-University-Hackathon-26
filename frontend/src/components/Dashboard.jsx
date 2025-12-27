import { useEffect, useState } from 'react';
import { Grid, Card, Title, Text, Group, ThemeIcon, RingProgress } from '@mantine/core';
import { IconTool, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { api, endpoints } from '../api';

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, repaired: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(endpoints.requests);
      const reqs = res.data;

      // 1. Calculate KPI Cards
      const total = reqs.length;
      const open = reqs.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;
      const repaired = reqs.filter(r => r.stage === 'Repaired').length;

      setStats({ total, open, repaired });

      // 2. Prepare Chart Data (Group by Team)
      // Result: [{ name: 'Mechanics', count: 5 }, { name: 'IT', count: 2 }]
      const teamCounts = {};
      reqs.forEach(r => {
        const teamName = r.team ? r.team.name : 'Unassigned';
        teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;
      });

      const data = Object.keys(teamCounts).map(key => ({
        name: key,
        requests: teamCounts[key],
      }));

      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data");
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">Maintenance Overview</Title>

      {/* KPI CARDS */}
      <Grid mb="xl">
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Active Requests</Text>
              <ThemeIcon color="blue" variant="light"><IconAlertCircle size={20} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{stats.open}</Text>
            <Text size="xs" c="dimmed">Currently pending</Text>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Repaired Assets</Text>
              <ThemeIcon color="green" variant="light"><IconCheck size={20} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{stats.repaired}</Text>
            <Text size="xs" c="dimmed">Successfully closed</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Total Requests</Text>
              <ThemeIcon color="gray" variant="light"><IconTool size={20} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{stats.total}</Text>
            <Text size="xs" c="dimmed">All time volume</Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* CHART SECTION */}
      <Grid>
        <Grid.Col span={8}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Requests per Team</Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#228be6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
           {/* You could add a Pie Chart here for Request Types (Corrective vs Preventive) if you want */}
           <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
             <Title order={4} mb="md">Health Score</Title>
             <Group justify="center" mt="xl">
                <RingProgress
                  size={180}
                  thickness={16}
                  roundCaps
                  sections={[{ value: (stats.repaired / stats.total) * 100 || 0, color: 'green' }]}
                  label={
                    <Text ta="center" fz="lg" fw={700}>
                      {stats.total > 0 ? Math.round((stats.repaired / stats.total) * 100) : 0}%
                    </Text>
                  }
                />
             </Group>
             <Text ta="center" mt="md" size="sm" c="dimmed">Completion Rate</Text>
           </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}