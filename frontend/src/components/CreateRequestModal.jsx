// import { useEffect, useState } from 'react';
// import { Modal, TextInput, Select, Button, Group, Stack, Rating, Text } from '@mantine/core'; // Added Rating, Text
// import { DateInput } from '@mantine/dates';
// import { useForm } from '@mantine/form';
// import { notifications } from '@mantine/notifications';
// import { api, endpoints } from '../api';

// export function CreateRequestModal({ opened, close, onSuccess, initialDate }) {
//   const [equipmentList, setEquipmentList] = useState([]);

//   const form = useForm({
//     initialValues: {
//       subject: '',
//       equipment_id: '',
//       request_type: 'Corrective',
//       scheduled_date: null,
//       priority: 1, // Default priority
//     },
//     validate: {
//       subject: (value) => (value.length < 2 ? 'Subject is too short' : null),
//       equipment_id: (value) => (!value ? 'Please select equipment' : null),
//     },
//   });

//   // Watch for initialDate changes (Calendar Click)
//   useEffect(() => {
//     if (opened && initialDate) {
//         form.setValues({
//             request_type: 'Preventive',
//             scheduled_date: initialDate,
//             priority: 2 // Default to 2 stars for scheduled work
//         });
//     }
//   }, [initialDate, opened]);

//   useEffect(() => {
//     api.get(endpoints.equipment).then((res) => {
//       const data = res.data.map((item) => ({
//         value: item.id.toString(),
//         label: `${item.name} (${item.serial_number})`,
//       }));
//       setEquipmentList(data);
//     });
//   }, []);

//   const handleSubmit = async (values) => {
//     try {
//       let finalDate = null;
//       if (values.scheduled_date) {
//         finalDate = values.scheduled_date instanceof Date 
//           ? values.scheduled_date.toISOString() 
//           : values.scheduled_date;
//       }

//       await api.post(endpoints.requests, {
//         ...values,
//         equipment_id: parseInt(values.equipment_id),
//         scheduled_date: finalDate,
//         priority: values.priority, // Send Priority
//       });

//       notifications.show({ title: 'Success', message: 'Request created!', color: 'green' });
//       form.reset();
//       onSuccess();
//       close();
//     } catch (error) {
//       notifications.show({ title: 'Error', message: 'Failed to create request', color: 'red' });
//     }
//   };

//   return (
//     <Modal opened={opened} onClose={close} title="New Maintenance Request" centered>
//       <form onSubmit={form.onSubmit(handleSubmit)}>
//         <Stack>
//           <TextInput
//             label="Subject"
//             placeholder="e.g. Leaking Oil"
//             withAsterisk
//             {...form.getInputProps('subject')}
//           />

//           <Select
//             label="Equipment"
//             placeholder="Select machine"
//             data={equipmentList}
//             searchable
//             withAsterisk
//             {...form.getInputProps('equipment_id')}
//           />

//           <Select
//             label="Request Type"
//             data={['Corrective', 'Preventive']}
//             {...form.getInputProps('request_type')}
//           />

//           {form.values.request_type === 'Preventive' && (
//             <DateInput
//               label="Scheduled Date"
//               placeholder="Pick date"
//               withAsterisk
//               minDate={new Date()}
//               {...form.getInputProps('scheduled_date')}
//             />
//           )}

//           {/* PRIORITY STARS */}
//           <div>
//             <Text size="sm" fw={500} mb={3}>Priority</Text>
//             <Rating 
//                 {...form.getInputProps('priority')} 
//                 size="lg"
//             />
//           </div>

//           <Group justify="flex-end" mt="md">
//             <Button variant="default" onClick={close}>Cancel</Button>
//             <Button type="submit">Create Request</Button>
//           </Group>
//         </Stack>
//       </form>
//     </Modal>
//   );
// }


// import { useEffect, useState } from 'react';
// import { Modal, TextInput, Select, Button, Group, Stack, Rating, Text, SegmentedControl } from '@mantine/core';
// import { DateInput } from '@mantine/dates';
// import { useForm } from '@mantine/form';
// import { notifications } from '@mantine/notifications';
// import { api, endpoints } from '../api';

// export function CreateRequestModal({ opened, close, onSuccess, initialDate }) {
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [workCenterList, setWorkCenterList] = useState([]);
  
//   // Toggle State: 'equipment' or 'work_center'
//   const [maintenanceFor, setMaintenanceFor] = useState('equipment');

//   const form = useForm({
//     initialValues: {
//       subject: '',
//       equipment_id: '',
//       work_center_id: '',
//       request_type: 'Corrective',
//       scheduled_date: null,
//       priority: 1,
//     },
//     validate: {
//       subject: (value) => (value.length < 2 ? 'Subject too short' : null),
//     },
//   });

//   // Watch for initialDate (Calendar click)
//   useEffect(() => {
//     if (opened && initialDate) {
//         form.setValues({
//             request_type: 'Preventive',
//             scheduled_date: initialDate,
//             priority: 2
//         });
//     }
//   }, [initialDate, opened]);

//   // Fetch Data
//   useEffect(() => {
//     api.get(endpoints.equipment).then((res) => {
//       setEquipmentList(res.data.map((item) => ({
//         value: item.id.toString(),
//         label: `${item.name} (${item.serial_number})`,
//       })));
//     });

//     api.get('/work-centers/').then((res) => {
//       setWorkCenterList(res.data.map((wc) => ({
//         value: wc.id.toString(),
//         label: `${wc.name} [${wc.code}]`,
//       })));
//     });
//   }, []);

//   const handleSubmit = async (values) => {
//     try {
//       let finalDate = null;
//       if (values.scheduled_date) {
//         finalDate = values.scheduled_date instanceof Date 
//           ? values.scheduled_date.toISOString() 
//           : values.scheduled_date;
//       }

//       // Payload adjustment based on toggle
//       const payload = {
//         subject: values.subject,
//         request_type: values.request_type,
//         scheduled_date: finalDate,
//         priority: values.priority,
//         // Only send the ID for the selected type
//         equipment_id: maintenanceFor === 'equipment' ? parseInt(values.equipment_id) : null,
//         work_center_id: maintenanceFor === 'work_center' ? parseInt(values.work_center_id) : null,
//       };

//       await api.post(endpoints.requests, payload);

//       notifications.show({ title: 'Success', message: 'Request created!', color: 'green' });
//       form.reset();
//       onSuccess();
//       close();
//     } catch (error) {
//       notifications.show({ title: 'Error', message: 'Failed to create request', color: 'red' });
//     }
//   };

//   return (
//     <Modal opened={opened} onClose={close} title="New Maintenance Request" centered>
//       <form onSubmit={form.onSubmit(handleSubmit)}>
//         <Stack>
//           <TextInput
//             label="Subject"
//             placeholder="e.g. Broken Motor"
//             withAsterisk
//             {...form.getInputProps('subject')}
//           />

//           {/* TOGGLE FOR MAINTENANCE TYPE */}
//           <div>
//               <Text size="sm" fw={500} mb={3}>Maintenance For</Text>
//               <SegmentedControl
//                 fullWidth
//                 value={maintenanceFor}
//                 onChange={setMaintenanceFor}
//                 data={[
//                   { label: 'Equipment', value: 'equipment' },
//                   { label: 'Work Center', value: 'work_center' },
//                 ]}
//               />
//           </div>

//           {/* DYNAMIC DROPDOWN */}
//           {maintenanceFor === 'equipment' ? (
//               <Select
//                 label="Equipment"
//                 placeholder="Select machine"
//                 data={equipmentList}
//                 searchable
//                 withAsterisk
//                 {...form.getInputProps('equipment_id')}
//               />
//           ) : (
//               <Select
//                 label="Work Center"
//                 placeholder="Select work center"
//                 data={workCenterList}
//                 searchable
//                 withAsterisk
//                 {...form.getInputProps('work_center_id')}
//               />
//           )}

//           <Select
//             label="Request Type"
//             data={['Corrective', 'Preventive']}
//             {...form.getInputProps('request_type')}
//           />

//           {form.values.request_type === 'Preventive' && (
//             <DateInput
//               label="Scheduled Date"
//               placeholder="Pick date"
//               withAsterisk
//               minDate={new Date()}
//               {...form.getInputProps('scheduled_date')}
//             />
//           )}

//           <div>
//             <Text size="sm" fw={500} mb={3}>Priority</Text>
//             <Rating {...form.getInputProps('priority')} size="lg" />
//           </div>

//           <Group justify="flex-end" mt="md">
//             <Button variant="default" onClick={close}>Cancel</Button>
//             <Button type="submit">Create Request</Button>
//           </Group>
//         </Stack>
//       </form>
//     </Modal>
//   );
// }


import { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Stack, Rating, Text, SegmentedControl, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, endpoints } from '../api';

export function CreateRequestModal({ opened, close, onSuccess, initialDate }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [workCenterList, setWorkCenterList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);      // <--- NEW
  const [usersList, setUsersList] = useState([]);      // <--- NEW
  
  // Toggle: 'equipment' or 'work_center'
  const [maintenanceFor, setMaintenanceFor] = useState('equipment');

  const form = useForm({
    initialValues: {
      subject: '',
      equipment_id: '',
      work_center_id: '',
      request_type: 'Corrective',
      scheduled_date: null,
      priority: 1,
      // --- NEW FIELDS ---
      team_id: '',
      technician_id: '',
      duration: 0,
    },
    validate: {
      subject: (value) => (value.length < 2 ? 'Subject too short' : null),
    },
  });

  // Watch for initialDate (Calendar click)
  useEffect(() => {
    if (opened && initialDate) {
        form.setValues({
            request_type: 'Preventive',
            scheduled_date: initialDate,
            priority: 2
        });
    }
  }, [initialDate, opened]);

  // Fetch Data (Equipment, WorkCenters, TEAMS, USERS)
  useEffect(() => {
    const loadData = async () => {
        try {
            const [eqRes, wcRes, teamRes, userRes] = await Promise.all([
                api.get(endpoints.equipment),
                api.get('/work-centers/'),
                api.get(endpoints.teams),
                api.get(endpoints.users)
            ]);

            setEquipmentList(eqRes.data.map(item => ({
                value: item.id.toString(),
                label: `${item.name} (${item.serial_number})`,
            })));

            setWorkCenterList(wcRes.data.map(wc => ({
                value: wc.id.toString(),
                label: `${wc.name} [${wc.code}]`,
            })));

            setTeamsList(teamRes.data.map(t => ({
                value: t.id.toString(),
                label: t.name
            })));

            setUsersList(userRes.data.map(u => ({
                value: u.id.toString(),
                label: u.name
            })));

        } catch (err) {
            console.error("Failed to load form data");
        }
    };
    loadData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      let finalDate = null;
      if (values.scheduled_date) {
        finalDate = values.scheduled_date instanceof Date 
          ? values.scheduled_date.toISOString() 
          : values.scheduled_date;
      }

      // Prepare Payload
      const payload = {
        subject: values.subject,
        request_type: values.request_type,
        scheduled_date: finalDate,
        priority: values.priority,
        
        // Context IDs
        equipment_id: maintenanceFor === 'equipment' ? parseInt(values.equipment_id) : null,
        work_center_id: maintenanceFor === 'work_center' ? parseInt(values.work_center_id) : null,
        
        // --- NEW FIELDS ---
        team_id: values.team_id ? parseInt(values.team_id) : null,
        technician_id: values.technician_id ? parseInt(values.technician_id) : null,
        duration: values.duration,
      };

      await api.post(endpoints.requests, payload);

      notifications.show({ title: 'Success', message: 'Request created!', color: 'green' });
      form.reset();
      onSuccess();
      close();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to create request', color: 'red' });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="New Maintenance Request" centered size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Subject"
            placeholder="e.g. Broken Motor"
            withAsterisk
            {...form.getInputProps('subject')}
          />

          {/* TOGGLE FOR MAINTENANCE TYPE */}
          <div>
              <Text size="sm" fw={500} mb={3}>Maintenance For</Text>
              <SegmentedControl
                fullWidth
                value={maintenanceFor}
                onChange={setMaintenanceFor}
                data={[
                  { label: 'Equipment', value: 'equipment' },
                  { label: 'Work Center', value: 'work_center' },
                ]}
              />
          </div>

          {/* DYNAMIC DROPDOWN */}
          {maintenanceFor === 'equipment' ? (
              <Select
                label="Equipment"
                placeholder="Select machine"
                data={equipmentList}
                searchable
                withAsterisk
                {...form.getInputProps('equipment_id')}
              />
          ) : (
              <Select
                label="Work Center"
                placeholder="Select work center"
                data={workCenterList}
                searchable
                withAsterisk
                {...form.getInputProps('work_center_id')}
              />
          )}

          <Group grow>
             <Select
                label="Request Type"
                data={['Corrective', 'Preventive']}
                {...form.getInputProps('request_type')}
             />
             <DateInput
                label="Scheduled Date"
                placeholder="Pick date"
                minDate={new Date()}
                {...form.getInputProps('scheduled_date')}
             />
          </Group>

          {/* --- NEW ROW: TEAM & TECHNICIAN --- */}
          <Group grow>
             <Select
                label="Team"
                placeholder="Auto-assign or select"
                data={teamsList}
                searchable
                clearable
                {...form.getInputProps('team_id')}
             />
             <Select
                label="Technician"
                placeholder="Select technician"
                data={usersList}
                searchable
                clearable
                {...form.getInputProps('technician_id')}
             />
          </Group>

          {/* --- NEW ROW: DURATION & PRIORITY --- */}
          <Group grow align="flex-start">
             <NumberInput
                label="Duration (Hours)"
                min={0}
                step={0.5}
                {...form.getInputProps('duration')}
             />
             <div>
                <Text size="sm" fw={500} mb={3}>Priority</Text>
                <Rating {...form.getInputProps('priority')} size="lg" />
             </div>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit">Create Request</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}