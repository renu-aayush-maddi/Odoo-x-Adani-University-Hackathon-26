// import { Drawer, Title, Group, Text, Badge, Stack, Grid, TextInput, Button, Tabs, Radio, Rating, Select, Avatar } from '@mantine/core';
// import { IconPencil, IconFileDescription } from '@tabler/icons-react';
// import { DateInput } from '@mantine/dates';
// import dayjs from 'dayjs';

// export function RequestDetailsDrawer({ opened, onClose, request }) {
//   if (!request) return null;

//   // Visual Helper for the "Pipeline" (New > In Progress > Repaired > Scrap)
//   const PipelineStage = ({ label, active, completed }) => {
//     let color = '#e9ecef'; // gray
//     let textColor = '#adb5bd';
    
//     if (active) { color = '#228be6'; textColor = 'white'; } // Blue
//     if (completed) { color = '#e7f5ff'; textColor = '#228be6'; } // Light Blue

//     return (
//       <div style={{ padding: '4px 12px', backgroundColor: color, borderRadius: '4px', cursor: 'default' }}>
//         <Text size="xs" fw={700} c={textColor} style={{ whiteSpace: 'nowrap' }}>{label}</Text>
//       </div>
//     );
//   };

//   const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
//   const currentStageIndex = stages.indexOf(request.stage);

//   return (
//     <Drawer 
//       opened={opened} 
//       onClose={onClose} 
//       position="right" 
//       size="80%" // Wide drawer matches the mockups "full page" feel
//       title={<Text fw={500} c="dimmed">Maintenance Requests / {request.subject}</Text>}
//       padding="xl"
//     >
//       <Stack gap="lg">
        
//         {/* --- HEADER: BUTTONS & PIPELINE --- */}
//         <Group justify="space-between" align="center">
//             {/* Left: Buttons */}
//             <Group>
//                  <Button variant="outline" color="gray" size="xs">Edit</Button>
//                  <Button variant="outline" color="gray" size="xs">Create Report</Button>
//             </Group>

//             {/* Right: Pipeline & Worksheet Button */}
//             <Group>
//                 {/* The "Worksheet" Smart Button */}
//                 <Button 
//                     variant="default" 
//                     leftSection={<IconFileDescription size={16} color="#7950f2"/>}
//                     style={{ borderTop: '1px solid #eee' }}
//                 >
//                     Worksheet
//                 </Button>

//                 {/* The Pipeline Status Bar */}
//                 <Group gap={5} style={{ border: '1px solid #eee', padding: 5, borderRadius: 8 }}>
//                     {stages.map((s, index) => (
//                         <PipelineStage 
//                             key={s} 
//                             label={s} 
//                             active={s === request.stage} 
//                             completed={index < currentStageIndex}
//                         />
//                     ))}
//                 </Group>
//             </Group>
//         </Group>

//         <div style={{ borderBottom: '1px solid #eee' }} />

//         {/* --- MAIN TITLE --- */}
//         <Title order={1}>{request.subject}</Title>

//         {/* --- FORM LAYOUT --- */}
//         <Grid gutter={40}>
//             {/* LEFT COLUMN */}
//             <Grid.Col span={6}>
//                 <Stack gap="md">
//                     <Group grow>
//                         <Text size="sm" fw={500} w={120}>Created By</Text>
//                         <Text size="sm">Mitchell Admin</Text> {/* Hardcoded as per wireframe example */}
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={120}>Maintenance For</Text>
//                         <Text size="sm">{request.work_center ? 'Work Center' : 'Equipment'}</Text>
//                     </Group>

//                     <Group grow>
//                          <Text size="sm" fw={500} w={120}>{request.work_center ? 'Work Center' : 'Equipment'}</Text>
//                          <Text size="sm" fw={700} c="blue">
//                             {request.work_center 
//                                 ? `${request.work_center.name} [${request.work_center.code}]` 
//                                 : `${request.equipment?.name} (${request.equipment?.serial_number})`
//                             }
//                          </Text>
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={120}>Category</Text>
//                         <div style={{ borderBottom: '1px solid #eee', width: '100%' }}>
//                             <Text size="sm">{request.equipment?.category || 'Machinery'}</Text>
//                         </div>
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={120}>Request Date</Text>
//                          <div style={{ borderBottom: '1px solid #eee', width: '100%' }}>
//                             <Text size="sm">{dayjs(request.created_at).format('MM/DD/YYYY')}</Text>
//                         </div>
//                     </Group>

//                     <Group align="flex-start" mt="sm">
//                         <Text size="sm" fw={500} w={120}>Maintenance Type</Text>
//                         <Radio.Group value={request.request_type}>
//                             <Group>
//                                 <Radio value="Corrective" label="Corrective" />
//                                 <Radio value="Preventive" label="Preventive" />
//                             </Group>
//                         </Radio.Group>
//                     </Group>
//                 </Stack>
//             </Grid.Col>

//             {/* RIGHT COLUMN */}
//             <Grid.Col span={6}>
//                  <Stack gap="md">
//                     <Group grow>
//                         <Text size="sm" fw={500} w={100}>Team</Text>
//                         <Text size="sm" style={{ borderBottom: '1px solid #eee' }}>
//                             {request.team?.name || 'Internal Maintenance'}
//                         </Text>
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={100}>Technician</Text>
//                         <Group gap="xs" style={{ borderBottom: '1px solid #eee' }}>
//                              <Avatar size={20} src={request.technician?.avatar_url} radius="xl"/>
//                              <Text size="sm">{request.technician?.name || 'Unassigned'}</Text>
//                         </Group>
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={100}>Scheduled Date</Text>
//                         <Text size="sm" style={{ borderBottom: '1px solid #eee' }}>
//                             {request.scheduled_date ? dayjs(request.scheduled_date).format('MM/DD/YYYY HH:mm:ss') : '-'}
//                         </Text>
//                     </Group>

//                      <Group grow>
//                         <Text size="sm" fw={500} w={100}>Duration</Text>
//                         <Text size="sm" style={{ borderBottom: '1px solid #eee' }}>
//                             {request.duration_hours?.toFixed(2)} hours
//                         </Text>
//                     </Group>

//                     <Group grow>
//                         <Text size="sm" fw={500} w={100}>Priority</Text>
//                         <Rating value={request.priority} readOnly count={3} />
//                     </Group>

//                     <Group grow mt="lg">
//                         <Text size="sm" fw={500} w={100}>Company</Text>
//                         <Text size="sm" style={{ borderBottom: '1px solid #333' }}>
//                             My Company (San Francisco)
//                         </Text>
//                     </Group>
//                  </Stack>
//             </Grid.Col>
//         </Grid>

//         {/* --- TABS SECTION --- */}
//         <Tabs defaultValue="notes" mt="xl">
//             <Tabs.List>
//                 <Tabs.Tab value="notes">Notes</Tabs.Tab>
//                 <Tabs.Tab value="instructions">Instructions</Tabs.Tab>
//             </Tabs.List>

//             <Tabs.Panel value="notes" pt="xs">
//                 <Text size="sm" c="dimmed">No internal notes added yet.</Text>
//             </Tabs.Panel>
//              <Tabs.Panel value="instructions" pt="xs">
//                 <Text size="sm" c="dimmed">Follow standard safety procedures.</Text>
//             </Tabs.Panel>
//         </Tabs>

//       </Stack>
//     </Drawer>
//   );
// }

import { useState } from 'react';
import { Drawer, Title, Group, Text, Badge, Stack, Grid, TextInput, Button, Tabs, Radio, Rating, Select, Avatar, Textarea, Modal } from '@mantine/core';
import { IconPencil, IconFileDescription, IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';

export function RequestDetailsDrawer({ opened, onClose, request }) {
  if (!request) return null;

  // --- LOCAL STATE FOR INTERACTIVITY ---
  const [isEditing, setIsEditing] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [instructions, setInstructions] = useState("Standard safety protocols apply.");

  // Helper for Pipeline
  const PipelineStage = ({ label, active, completed }) => {
    let color = '#e9ecef'; 
    let textColor = '#adb5bd';
    if (active) { color = '#228be6'; textColor = 'white'; } 
    if (completed) { color = '#e7f5ff'; textColor = '#228be6'; } 

    return (
      <div style={{ padding: '4px 12px', backgroundColor: color, borderRadius: '4px', cursor: 'default' }}>
        <Text size="xs" fw={700} c={textColor} style={{ whiteSpace: 'nowrap' }}>{label}</Text>
      </div>
    );
  };

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
  const currentStageIndex = stages.indexOf(request.stage);

  // --- HANDLERS ---
  const toggleEdit = () => {
    if (isEditing) {
        // "Save" logic mock
        notifications.show({ title: 'Saved', message: 'Changes updated successfully', color: 'green' });
    }
    setIsEditing(!isEditing);
  };

  const handleCreateReport = () => {
    notifications.show({ 
        title: 'Report Generated', 
        message: 'PDF Report has been sent to your email.', 
        color: 'blue',
        icon: <IconFileDescription size={18} />
    });
  };

  return (
    <>
      <Drawer 
        opened={opened} 
        onClose={() => { setIsEditing(false); onClose(); }} 
        position="right" 
        size="80%" 
        title={<Text fw={500} c="dimmed">Maintenance Requests / {request.subject}</Text>}
        padding="xl"
      >
        <Stack gap="lg">
          
          {/* HEADER */}
          <Group justify="space-between" align="center">
              <Group>
                   <Button 
                      variant="outline" 
                      color={isEditing ? "green" : "gray"} 
                      size="xs"
                      leftSection={isEditing ? <IconDeviceFloppy size={14}/> : <IconPencil size={14}/>}
                      onClick={toggleEdit}
                   >
                      {isEditing ? "Save" : "Edit"}
                   </Button>
                   
                   <Button 
                      variant="outline" 
                      color="gray" 
                      size="xs"
                      onClick={handleCreateReport}
                   >
                      Create Report
                   </Button>
              </Group>

              <Group>
                  {/* SMART BUTTON FOR WORKSHEET */}
                  <Button 
                      variant="default" 
                      leftSection={<IconFileDescription size={16} color="#7950f2"/>}
                      style={{ borderTop: '1px solid #eee' }}
                      onClick={() => setWorksheetOpen(true)}
                  >
                      Worksheet
                  </Button>

                  <Group gap={5} style={{ border: '1px solid #eee', padding: 5, borderRadius: 8 }}>
                      {stages.map((s, index) => (
                          <PipelineStage 
                              key={s} 
                              label={s} 
                              active={s === request.stage} 
                              completed={index < currentStageIndex}
                          />
                      ))}
                  </Group>
              </Group>
          </Group>

          <div style={{ borderBottom: '1px solid #eee' }} />
          <Title order={1}>{request.subject}</Title>

          {/* FORM GRID */}
          <Grid gutter={40}>
              <Grid.Col span={6}>
                  <Stack gap="md">
                      <Group grow>
                          <Text size="sm" fw={500} w={120}>Created By</Text>
                          <Text size="sm">Mitchell Admin</Text>
                      </Group>

                      <Group grow>
                           <Text size="sm" fw={500} w={120}>{request.work_center ? 'Work Center' : 'Equipment'}</Text>
                           <Text size="sm" fw={700} c="blue">
                              {request.work_center 
                                  ? `${request.work_center.name} [${request.work_center.code}]` 
                                  : `${request.equipment?.name} (${request.equipment?.serial_number})`
                              }
                           </Text>
                      </Group>

                      <Group grow>
                          <Text size="sm" fw={500} w={120}>Category</Text>
                          <div style={{ borderBottom: '1px solid #eee', width: '100%' }}>
                              <Text size="sm">{request.equipment?.category || 'Machinery'}</Text>
                          </div>
                      </Group>

                      <Group grow>
                          <Text size="sm" fw={500} w={120}>Request Date</Text>
                           <div style={{ borderBottom: '1px solid #eee', width: '100%' }}>
                              <Text size="sm">{dayjs(request.created_at).format('MM/DD/YYYY')}</Text>
                          </div>
                      </Group>

                      <Group align="flex-start" mt="sm">
                          <Text size="sm" fw={500} w={120}>Maintenance Type</Text>
                          <Radio.Group value={request.request_type}>
                              <Group>
                                  <Radio value="Corrective" label="Corrective" disabled={!isEditing} />
                                  <Radio value="Preventive" label="Preventive" disabled={!isEditing} />
                              </Group>
                          </Radio.Group>
                      </Group>
                  </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                   <Stack gap="md">
                      <Group grow>
                          <Text size="sm" fw={500} w={100}>Team</Text>
                          <Text size="sm" style={{ borderBottom: '1px solid #eee' }}>
                              {request.team?.name || 'Internal Maintenance'}
                          </Text>
                      </Group>

                      <Group grow>
                          <Text size="sm" fw={500} w={100}>Technician</Text>
                          <Group gap="xs" style={{ borderBottom: '1px solid #eee' }}>
                               <Avatar size={20} src={request.technician?.avatar_url} radius="xl"/>
                               <Text size="sm">{request.technician?.name || 'Unassigned'}</Text>
                          </Group>
                      </Group>

                      <Group grow>
                          <Text size="sm" fw={500} w={100}>Duration</Text>
                          <Text size="sm" style={{ borderBottom: '1px solid #eee' }}>
                              {request.duration_hours?.toFixed(2)} hours
                          </Text>
                      </Group>

                      <Group grow>
                          <Text size="sm" fw={500} w={100}>Priority</Text>
                          <Rating value={request.priority} readOnly={!isEditing} count={3} />
                      </Group>
                   </Stack>
              </Grid.Col>
          </Grid>

          {/* TABS */}
          <Tabs defaultValue="notes" mt="xl">
              <Tabs.List>
                  <Tabs.Tab value="notes">Notes</Tabs.Tab>
                  <Tabs.Tab value="instructions">Instructions</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="notes" pt="xs">
                  <Textarea 
                    placeholder="Internal notes..." 
                    minRows={4} 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    variant={isEditing ? "default" : "unstyled"}
                    readOnly={!isEditing}
                  />
              </Tabs.Panel>
               <Tabs.Panel value="instructions" pt="xs">
                   <Textarea 
                    minRows={4} 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    variant={isEditing ? "default" : "unstyled"}
                    readOnly={!isEditing}
                   />
              </Tabs.Panel>
          </Tabs>

        </Stack>
      </Drawer>

      {/* WORKSHEET MODAL */}
      <Modal 
        opened={worksheetOpen} 
        onClose={() => setWorksheetOpen(false)} 
        title="Maintenance Worksheet" 
        centered
      >
        <Stack>
            <Text size="sm">Log your technical steps here:</Text>
            <Textarea placeholder="Step 1: Check voltage..." minRows={6} />
            <Button onClick={() => { setWorksheetOpen(false); notifications.show({ message: 'Worksheet saved', color: 'green'}); }}>
                Save Worksheet
            </Button>
        </Stack>
      </Modal>
    </>
  );
}