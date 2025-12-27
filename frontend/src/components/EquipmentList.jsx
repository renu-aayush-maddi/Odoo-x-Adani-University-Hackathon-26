// import { useEffect, useState } from 'react';
// import { Table, Title, Button, Drawer, Group, Text, Badge, Stack, Grid, TextInput, Paper, Avatar } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { IconSearch } from '@tabler/icons-react'; // Changed IconTool to IconWrench for better match
// import { useNavigate } from 'react-router-dom';
// import { api, endpoints } from '../api';
// import dayjs from 'dayjs';
// import { IconTool } from '@tabler/icons-react';


// export function EquipmentList() {
//   const [equipment, setEquipment] = useState([]);
//   const [search, setSearch] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [requestCount, setRequestCount] = useState(0);
//   const [opened, { open, close }] = useDisclosure(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get(endpoints.equipment).then(res => setEquipment(res.data));
//   }, []);

//   // Open the "Form View" when a row is clicked
//   const handleRowClick = async (item) => {
//     setSelectedItem(item);
//     try {
//       const res = await api.get(`/equipment/${item.id}/stats`);
//       setRequestCount(res.data.open_requests);
//       open();
//     } catch (error) {
//       console.error("Failed to fetch stats");
//     }
//   };

//   const navigateToMaintenance = () => {
//     navigate(`/?equipmentId=${selectedItem.id}`);
//   };

//   const filteredEquipment = equipment.filter(item => 
//     item.name.toLowerCase().includes(search.toLowerCase()) || 
//     item.serial_number.toLowerCase().includes(search.toLowerCase()) ||
//     item.department.toLowerCase().includes(search.toLowerCase())
//   );

//   const rows = filteredEquipment.map((item) => {
//     const isScrapped = !item.is_active; 
//     return (
//       <Table.Tr 
//         key={item.id} 
//         onClick={() => handleRowClick(item)} // <--- CLICKABLE ROW
//         style={{ 
//             cursor: 'pointer',
//             opacity: isScrapped ? 0.6 : 1, 
//             backgroundColor: isScrapped ? '#fff5f5' : undefined 
//         }}
//       >
//         <Table.Td style={{ fontWeight: 500 }}>
//           {item.name}
//           {isScrapped && <Badge color="red" size="xs" ml="xs">SCRAPPED</Badge>}
//         </Table.Td>
//         <Table.Td>{item.serial_number}</Table.Td>
//         <Table.Td>{item.maintenance_team?.name || 'Unassigned'}</Table.Td>
//         <Table.Td>{item.department}</Table.Td>
//         <Table.Td>{item.category}</Table.Td>
//       </Table.Tr>
//     );
//   });

//   return (
//     <div>
//       <Group justify="space-between" mb="md">
//         <Title order={2}>Equipment Assets</Title>
//         <TextInput 
//           placeholder="Search assets..." 
//           leftSection={<IconSearch size={14} />}
//           value={search}
//           onChange={(event) => setSearch(event.currentTarget.value)}
//           style={{ width: 300 }}
//         />
//       </Group>
      
//       <Paper shadow="sm" radius="md" withBorder>
//         <Table stickyHeader striped highlightOnHover>
//           <Table.Thead>
//             <Table.Tr>
//               <Table.Th>Equipment Name</Table.Th>
//               <Table.Th>Serial Number</Table.Th>
//               <Table.Th>Technician Team</Table.Th>
//               <Table.Th>Department</Table.Th>
//               <Table.Th>Category</Table.Th>
//             </Table.Tr>
//           </Table.Thead>
//           <Table.Tbody>
//             {rows.length > 0 ? rows : (
//                 <Table.Tr><Table.Td colSpan={5} ta="center">No assets found</Table.Td></Table.Tr>
//             )}
//           </Table.Tbody>
//         </Table>
//       </Paper>

//       {/* --- EQUIPMENT FORM VIEW (Matches Wireframe) --- */}
//       <Drawer 
//         opened={opened} 
//         onClose={close} 
//         position="right"
//         size="xl" // Wide drawer to look like a Form Page
//         title={<Text fw={700} size="lg">Equipment / {selectedItem?.name}</Text>}
//       >
//         {selectedItem && (
//           <Stack>
//             {/* 1. TOP BAR WITH SMART BUTTON [image_2e8d2f.png] */}
//             <Group justify="flex-end" mb="md" style={{ borderBottom: '1px solid #eee', paddingBottom: 15 }}>
//                <Button 
//                  variant="default"
//                  style={{ height: 50, paddingLeft: 10, paddingRight: 20, borderColor: '#ddd' }}
//                  onClick={navigateToMaintenance}
//                  leftSection={
//                    <Stack align="center" gap={0} mr={5}>
//                      <IconTool size={20} color="#228be6" />
//                    </Stack>
//                  }
//                >
//                  <Stack gap={0} align="flex-start">
//                    <Text size="xs" fw={700} style={{ lineHeight: 1 }}>{requestCount}</Text>
//                    <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>Maintenance</Text>
//                  </Stack>
//                </Button>
//             </Group>

//             {/* 2. FORM FIELDS [image_2e8cfa.png] */}
//             <Title order={2} mb="lg">{selectedItem.name}</Title>

//             {!selectedItem.is_active && (
//                 <Badge color="red" size="xl" mb="lg">⚠️ EQUIPMENT SCRAPPED</Badge>
//             )}

//             <Grid gutter="xl">
//               {/* LEFT COLUMN */}
//               <Grid.Col span={6}>
//                 <Stack gap="md">
//                   <TextInput label="Serial Number" value={selectedItem.serial_number} readOnly variant="filled" />
//                   <TextInput label="Equipment Category" value={selectedItem.category} readOnly variant="filled" />
//                   <TextInput label="Company" value="My Company (San Francisco)" readOnly variant="filled" />
//                   <TextInput label="Department (Used By)" value={selectedItem.department} readOnly variant="filled" />
//                   <TextInput label="Maintenance Team" value={selectedItem.maintenance_team?.name || 'None'} readOnly variant="filled" />
//                 </Stack>
//               </Grid.Col>

//               {/* RIGHT COLUMN */}
//               <Grid.Col span={6}>
//                  <Stack gap="md">
//                   <TextInput label="Assigned Technician" value={selectedItem.technician?.name || 'Unassigned'} readOnly variant="filled" />
//                   <TextInput label="Location" value={selectedItem.location} readOnly variant="filled" />
//                   <TextInput 
//                     label="Assigned Date (Purchase)" 
//                     value={dayjs(selectedItem.purchase_date).format('MM/DD/YYYY')} 
//                     readOnly 
//                     variant="filled" 
//                   />
//                   <TextInput 
//                     label="Warranty Expiration" 
//                     value={selectedItem.warranty_expiration ? dayjs(selectedItem.warranty_expiration).format('MM/DD/YYYY') : 'N/A'} 
//                     readOnly 
//                     variant="filled" 
//                   />
//                  </Stack>
//               </Grid.Col>
//             </Grid>

//             {/* DESCRIPTION FIELD */}
//             <TextInput 
//                 label="Description" 
//                 placeholder="Add internal notes..." 
//                 mt="md" 
//                 variant="filled"
//                 readOnly
//             />

//           </Stack>
//         )}
//       </Drawer>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Table, Title, Button, Drawer, Group, Text, Badge, Stack, Grid, TextInput, Paper, Select, ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {  IconSearch, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { IconTool } from '@tabler/icons-react';
import { useForm } from '@mantine/form'; 
import { notifications } from '@mantine/notifications';
import { api, endpoints } from '../api';
import dayjs from 'dayjs';

export function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      serial_number: '',
      category: '',
      department: '',
      location: '',
      maintenance_team_id: '',
      technician_id: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name too short' : null),
      serial_number: (value) => (value.length < 1 ? 'Required' : null),
      maintenance_team_id: (value) => (!value ? 'Required' : null),
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const eqRes = await api.get(endpoints.equipment);
    setEquipment(eqRes.data);
    const teamRes = await api.get(endpoints.teams);
    setTeams(teamRes.data.map(t => ({ value: t.id.toString(), label: t.name })));
    const userRes = await api.get(endpoints.users);
    setUsers(userRes.data.map(u => ({ value: u.id.toString(), label: u.name })));
  };

  const handleRowClick = async (item) => {
    setSelectedItem(item);
    try {
      const res = await api.get(`/equipment/${item.id}/stats`);
      setRequestCount(res.data.open_requests);
      openDrawer();
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    form.reset();
    openModal();
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedItem(item);
    form.setValues({
        name: item.name,
        serial_number: item.serial_number,
        category: item.category,
        department: item.department,
        location: item.location,
        maintenance_team_id: item.maintenance_team_id.toString(),
        technician_id: item.technician_id ? item.technician_id.toString() : '',
    });
    openModal();
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        await api.delete(`/equipment/${item.id}`);
        notifications.show({ title: 'Deleted', message: 'Equipment removed', color: 'red' });
        fetchData();
    }
  };

  const submitForm = async (values) => {
    try {
        const payload = {
            ...values,
            maintenance_team_id: parseInt(values.maintenance_team_id),
            technician_id: values.technician_id ? parseInt(values.technician_id) : null,
        };

        if (isEditing) {
            await api.put(`/equipment/${selectedItem.id}`, payload);
            notifications.show({ title: 'Updated', message: 'Equipment updated', color: 'green' });
        } else {
            await api.post('/equipment/', payload);
            notifications.show({ title: 'Created', message: 'Equipment created', color: 'green' });
        }
        closeModal();
        fetchData();
    } catch (error) {
        notifications.show({ title: 'Error', message: 'Operation failed', color: 'red' });
    }
  };

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.serial_number.toLowerCase().includes(search.toLowerCase()) ||
    item.department.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredEquipment.map((item) => {
    const isScrapped = !item.is_active; 
    return (
      <Table.Tr 
        key={item.id} 
        onClick={() => handleRowClick(item)} 
        style={{ 
            cursor: 'pointer',
            opacity: isScrapped ? 0.6 : 1, 
            backgroundColor: isScrapped ? '#fff5f5' : undefined 
        }}
      >
        <Table.Td style={{ fontWeight: 500 }}>
          {item.name}
          {isScrapped && <Badge color="red" size="xs" ml="xs">SCRAPPED</Badge>}
        </Table.Td>
        <Table.Td>{item.serial_number}</Table.Td>
        <Table.Td>{item.maintenance_team?.name}</Table.Td>
        <Table.Td>{item.department}</Table.Td>
        <Table.Td>{item.category}</Table.Td> {/* <--- ADDED BACK CATEGORY */}
        
        <Table.Td>
            <Group gap={0}>
                <ActionIcon variant="subtle" color="gray" onClick={(e) => handleEdit(e, item)}>
                    <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={(e) => handleDelete(e, item)}>
                    <IconTrash size={16} />
                </ActionIcon>
            </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Group>
            <Button leftSection={<IconPlus size={16}/>} variant="white" color="dark" style={{ border: '1px solid #ccc' }} onClick={handleCreate}>
                New
            </Button>
            <Title order={2}>Equipment</Title>
        </Group>
        
        <TextInput 
          placeholder="Search assets..." 
          leftSection={<IconSearch size={14} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ width: 300 }}
        />
      </Group>
      
      <Paper shadow="sm" radius="md" withBorder>
        <Table stickyHeader striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Equipment Name</Table.Th>
              <Table.Th>Serial Number</Table.Th>
              <Table.Th>Technician Team</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Category</Table.Th> {/* <--- ADDED BACK HEADER */}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
                <Table.Tr><Table.Td colSpan={6} ta="center">No assets found</Table.Td></Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* --- MODAL --- */}
      <Modal opened={modalOpened} onClose={closeModal} title={isEditing ? "Edit Equipment" : "New Equipment"} centered>
        <form onSubmit={form.onSubmit(submitForm)}>
            <Stack>
                <TextInput label="Name" withAsterisk {...form.getInputProps('name')} />
                <TextInput label="Serial Number" withAsterisk {...form.getInputProps('serial_number')} />
                <TextInput label="Category" placeholder="e.g. Computers, Machinery" {...form.getInputProps('category')} />
                <TextInput label="Department" placeholder="e.g. Admin, Production" {...form.getInputProps('department')} />
                <TextInput label="Location" {...form.getInputProps('location')} />
                <Select label="Maintenance Team" data={teams} withAsterisk {...form.getInputProps('maintenance_team_id')} />
                <Select label="Default Technician" data={users} {...form.getInputProps('technician_id')} />
                <Button fullWidth mt="md" type="submit">{isEditing ? "Update" : "Create"}</Button>
            </Stack>
        </form>
      </Modal>

      {/* --- DRAWER --- */}
      <Drawer 
        opened={drawerOpened} 
        onClose={closeDrawer} 
        position="right"
        size="xl"
        title={<Text fw={700} size="lg">Equipment / {selectedItem?.name}</Text>}
      >
        {selectedItem && (
          <Stack>
            <Group justify="flex-end" mb="md" style={{ borderBottom: '1px solid #eee', paddingBottom: 15 }}>
               <Button 
                 variant="default"
                 style={{ height: 50, paddingLeft: 10, paddingRight: 20, borderColor: '#ddd' }}
                 onClick={() => navigate(`/?equipmentId=${selectedItem.id}`)}
                 leftSection={
                   <Stack align="center" gap={0} mr={5}>
                     <IconTool size={20} color="#228be6" />
                   </Stack>
                 }
               >
                 <Stack gap={0} align="flex-start">
                   <Text size="xs" fw={700} style={{ lineHeight: 1 }}>{requestCount}</Text>
                   <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>Maintenance</Text>
                 </Stack>
               </Button>
            </Group>

            <Title order={2} mb="lg">{selectedItem.name}</Title>
            {!selectedItem.is_active && <Badge color="red" size="xl" mb="lg">⚠️ EQUIPMENT SCRAPPED</Badge>}
            
            <Grid gutter="xl">
              <Grid.Col span={6}>
                <Stack gap="md">
                  <TextInput label="Serial Number" value={selectedItem.serial_number} readOnly variant="filled" />
                  <TextInput label="Category" value={selectedItem.category} readOnly variant="filled" />
                  <TextInput label="Department" value={selectedItem.department} readOnly variant="filled" />
                  <TextInput label="Maintenance Team" value={selectedItem.maintenance_team?.name || 'None'} readOnly variant="filled" />
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                 <Stack gap="md">
                  <TextInput label="Technician" value={selectedItem.technician?.name || 'Unassigned'} readOnly variant="filled" />
                  <TextInput label="Location" value={selectedItem.location} readOnly variant="filled" />
                  <TextInput label="Purchase Date" value={dayjs(selectedItem.purchase_date).format('MM/DD/YYYY')} readOnly variant="filled" />
                 </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Drawer>
    </div>
  );
}