// import { useEffect, useState } from 'react';
// import { Table, Title, Paper, Badge, Group, TextInput } from '@mantine/core';
// import { IconSearch } from '@tabler/icons-react';
// import { api } from '../api';

// export function WorkCenterList() {
//   const [centers, setCenters] = useState([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     api.get('/work-centers/').then(res => setCenters(res.data));
//   }, []);

//   const rows = centers
//     .filter(wc => wc.name.toLowerCase().includes(search.toLowerCase()))
//     .map((wc) => (
//       <Table.Tr key={wc.id}>
//         <Table.Td fw={500}>{wc.name}</Table.Td>
//         <Table.Td>{wc.code}</Table.Td>
//         <Table.Td>${wc.cost_per_hour.toFixed(2)}</Table.Td>
//         <Table.Td>{wc.capacity}</Table.Td>
//         <Table.Td>
//           <Badge color={wc.oee_target > 80 ? 'green' : 'orange'}>
//             {wc.oee_target}%
//           </Badge>
//         </Table.Td>
//       </Table.Tr>
//     ));

//   return (
//     <div>
//       <Group justify="space-between" mb="md">
//         <Title order={2}>Work Centers</Title>
//         <TextInput 
//           placeholder="Search..." 
//           leftSection={<IconSearch size={14} />} 
//           value={search} 
//           onChange={(e) => setSearch(e.target.value)} 
//         />
//       </Group>

//       <Paper shadow="sm" radius="md" withBorder>
//         <Table stickyHeader striped highlightOnHover>
//           <Table.Thead>
//             <Table.Tr>
//               <Table.Th>Work Center</Table.Th>
//               <Table.Th>Code</Table.Th>
//               <Table.Th>Cost per Hour</Table.Th>
//               <Table.Th>Capacity</Table.Th>
//               <Table.Th>OEE Target</Table.Th>
//             </Table.Tr>
//           </Table.Thead>
//           <Table.Tbody>{rows}</Table.Tbody>
//         </Table>
//       </Paper>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { Table, Title, Paper, Badge, Group, TextInput, Button, Modal, NumberInput, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { api } from '../api';

export function WorkCenterList() {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState('');
  
  // Modal & Form State
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', cost_per_hour: 0, capacity: 100, oee_target: 85
  });

  const fetchCenters = () => {
    api.get('/work-centers/').then(res => setCenters(res.data));
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleOpen = (wc = null) => {
    if (wc) {
      setEditingId(wc.id);
      setFormData({ 
        name: wc.name, code: wc.code, 
        cost_per_hour: wc.cost_per_hour, 
        capacity: wc.capacity, oee_target: wc.oee_target 
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '', cost_per_hour: 0, capacity: 100, oee_target: 85 });
    }
    open();
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`/work-centers/${editingId}`, formData);
      } else {
        await api.post('/work-centers/', formData);
      }
      close();
      fetchCenters();
    } catch (err) {
      console.error(err);
      alert("Error saving work center");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this work center?")) {
      await api.delete(`/work-centers/${id}`);
      fetchCenters();
    }
  };

  const rows = centers
    .filter(wc => wc.name.toLowerCase().includes(search.toLowerCase()))
    .map((wc) => (
      <Table.Tr key={wc.id}>
        <Table.Td fw={500}>{wc.name}</Table.Td>
        <Table.Td>{wc.code}</Table.Td>
        <Table.Td>${wc.cost_per_hour.toFixed(2)}</Table.Td>
        <Table.Td>{wc.capacity}</Table.Td>
        <Table.Td>
          <Badge color={wc.oee_target > 80 ? 'green' : 'orange'}>{wc.oee_target}%</Badge>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon variant="light" color="blue" onClick={() => handleOpen(wc)}><IconEdit size={16}/></ActionIcon>
            <ActionIcon variant="light" color="red" onClick={() => handleDelete(wc.id)}><IconTrash size={16}/></ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Work Centers</Title>
        <Group>
          <TextInput 
            placeholder="Search..." 
            leftSection={<IconSearch size={14} />} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <Button leftSection={<IconPlus size={16}/>} onClick={() => handleOpen()}>Add New</Button>
        </Group>
      </Group>

      <Paper shadow="sm" radius="md" withBorder>
        <Table stickyHeader striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Work Center</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Cost/Hr</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>OEE Target</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={opened} onClose={close} title={editingId ? "Edit Work Center" : "New Work Center"}>
        <TextInput label="Name" mb="sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <TextInput label="Code" mb="sm" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required />
        
        <Group grow mb="sm">
          <NumberInput label="Cost per Hour" prefix="$" value={formData.cost_per_hour} onChange={(v) => setFormData({...formData, cost_per_hour: v})} />
          <NumberInput label="Capacity" value={formData.capacity} onChange={(v) => setFormData({...formData, capacity: v})} />
        </Group>
        
        <NumberInput label="OEE Target (%)" mb="lg" value={formData.oee_target} onChange={(v) => setFormData({...formData, oee_target: v})} />
        
        <Button fullWidth onClick={handleSubmit}>Save</Button>
      </Modal>
    </div>
  );
}