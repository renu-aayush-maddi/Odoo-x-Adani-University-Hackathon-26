

import { useState, useEffect } from 'react';
import { Drawer, Title, Group, Text, Stack, Grid, Button, Tabs, Radio, Rating, Avatar, Textarea, Modal } from '@mantine/core';
import { IconPencil, IconFileDescription, IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api } from '../api';
import dayjs from 'dayjs';

export function RequestDetailsDrawer({ opened, onClose, request }) {
  // If no request is selected, return nothing
  if (!request) return null;

  // --- LOCAL STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  
  // Form Fields State
  const [notes, setNotes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [worksheetLog, setWorksheetLog] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [priority, setPriority] = useState(1);

  // Sync state when the request prop changes
  useEffect(() => {
    if (request) {
        setNotes(request.notes || "");
        setInstructions(request.instructions || "Standard safety protocols apply.");
        setWorksheetLog(request.worksheet_log || "");
        setCurrentStage(request.stage);
        setPriority(request.priority || 1);
    }
  }, [request]);

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    try {
        await api.put(`/requests/${request.id}/stage`, {
            notes: notes,
            instructions: instructions,
            priority: priority,
        });
        notifications.show({ title: 'Saved', message: 'Request updated successfully', color: 'green' });
        setIsEditing(false);
    } catch (error) {
        notifications.show({ title: 'Error', message: 'Failed to save changes', color: 'red' });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
        handleSave(); // Save if currently editing
    } else {
        setIsEditing(true); // Enter edit mode
    }
  };

  // --- STAGE CHANGE HANDLER ---
  const handleStageClick = async (newStage) => {
    try {
        await api.put(`/requests/${request.id}/stage`, { stage: newStage });
        setCurrentStage(newStage); // Update UI immediately
        notifications.show({ title: 'Status Updated', message: `Moved to ${newStage}`, color: 'blue' });
    } catch (error) {
        notifications.show({ title: 'Error', message: 'Failed to update status', color: 'red' });
    }
  };

  // --- WORKSHEET SAVE HANDLER ---
  const saveWorksheet = async () => {
      try {
          await api.put(`/requests/${request.id}/stage`, { worksheet_log: worksheetLog });
          setWorksheetOpen(false);
          notifications.show({ message: 'Worksheet saved to database', color: 'green'});
      } catch (error) {
          notifications.show({ title: 'Error', message: 'Failed to save worksheet', color: 'red' });
      }
  };

  // Pipeline Component
  const PipelineStage = ({ label, active, completed }) => {
    let color = '#e9ecef'; 
    let textColor = '#adb5bd';
    let cursor = 'pointer'; 

    if (active) { color = '#228be6'; textColor = 'white'; } 
    if (completed) { color = '#e7f5ff'; textColor = '#228be6'; } 

    return (
      <div 
        onClick={() => handleStageClick(label)}
        style={{ padding: '4px 12px', backgroundColor: color, borderRadius: '4px', cursor }}
      >
        <Text size="xs" fw={700} c={textColor} style={{ whiteSpace: 'nowrap' }}>{label}</Text>
      </div>
    );
  };

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
  const currentStageIndex = stages.indexOf(currentStage);

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
                   <Button variant="outline" color="gray" size="xs">Create Report</Button>
              </Group>

              <Group>
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
                              active={s === currentStage} 
                              completed={index < currentStageIndex}
                          />
                      ))}
                  </Group>
              </Group>
          </Group>

          <div style={{ borderBottom: '1px solid #eee' }} />
          <Title order={1}>{request.subject}</Title>

          {/* FORM GRID - ALL FIELDS RESTORED */}
          <Grid gutter={40}>
              <Grid.Col span={6}>
                  <Stack gap="md">
                      <Group grow>
                          <Text size="sm" fw={500} w={120}>Created By</Text>
                          <Text size="sm">
                              {request.created_by ? request.created_by.name : 'Unknown User'}
                          </Text>
                      </Group>

                      {/* RESTORED: Maintenance For / Equipment / Category / Date / Type */}
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
                          <Rating value={priority} onChange={setPriority} readOnly={!isEditing} count={3} />
                      </Group>

                      <Group grow mt="lg">
                        <Text size="sm" fw={500} w={100}>Company</Text>
                        <Text size="sm" style={{ borderBottom: '1px solid #333' }}>
                            My Company (San Francisco)
                        </Text>
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
            <Textarea 
                placeholder="Step 1: Check voltage..." 
                minRows={6} 
                value={worksheetLog}
                onChange={(e) => setWorksheetLog(e.target.value)}
            />
            <Button onClick={saveWorksheet}>
                Save Worksheet
            </Button>
        </Stack>
      </Modal>
    </>
  );
}





// import { useState, useEffect } from 'react';
// import { Drawer, Title, Group, Text, Stack, Grid, Button, Tabs, Radio, Rating, Avatar, Textarea, Modal, Menu, ActionIcon } from '@mantine/core'; 
// import { IconPencil, IconFileDescription, IconDeviceFloppy, IconCircleFilled } from '@tabler/icons-react';
// import { notifications } from '@mantine/notifications';
// import { api } from '../api';
// import dayjs from 'dayjs';

// export function RequestDetailsDrawer({ opened, onClose, request, onUpdate }) {
//   if (!request) return null;

//   const [isEditing, setIsEditing] = useState(false);
//   const [worksheetOpen, setWorksheetOpen] = useState(false);
  
//   // Form State
//   const [notes, setNotes] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [worksheetLog, setWorksheetLog] = useState("");
//   const [currentStage, setCurrentStage] = useState("");
//   const [priority, setPriority] = useState(1);
//   const [kanbanState, setKanbanState] = useState("normal"); // <--- NEW STATE

//   useEffect(() => {
//     if (request) {
//         setNotes(request.notes || "");
//         setInstructions(request.instructions || "Standard safety protocols apply.");
//         setWorksheetLog(request.worksheet_log || "");
//         setCurrentStage(request.stage);
//         setPriority(request.priority || 1);
//         setKanbanState(request.kanban_state || "normal"); // <--- Load State
//     }
//   }, [request]);

//   const handleSave = async () => {
//     try {
//         await api.put(`/requests/${request.id}/stage`, {
//             notes, instructions, priority, kanban_state: kanbanState 
//         });
//         notifications.show({ title: 'Saved', message: 'Request updated', color: 'green' });
//         setIsEditing(false);
//         if (onUpdate) onUpdate();
//     } catch (error) {
//         notifications.show({ title: 'Error', message: 'Failed to save', color: 'red' });
//     }
//   };

//   const toggleEdit = () => isEditing ? handleSave() : setIsEditing(true);

//   // --- TRAFFIC LIGHT HANDLER ---
//   const handleKanbanStateChange = async (newState) => {
//       try {
//           await api.put(`/requests/${request.id}/stage`, { kanban_state: newState });
//           setKanbanState(newState);
//           if (onUpdate) onUpdate(); // Refresh dashboard so dot updates there too if needed
//       } catch (error) {
//           console.error(error);
//       }
//   };

//   const getKanbanColor = (state) => {
//       if (state === 'blocked') return 'red';
//       if (state === 'done') return 'green';
//       return 'gray'; // normal
//   };

//   // Pipeline Component
//   const PipelineStage = ({ label, active, completed }) => {
//     let color = '#e9ecef'; 
//     let textColor = '#adb5bd';
//     let cursor = 'pointer';

//     if (active) { color = '#228be6'; textColor = 'white'; } 
//     if (completed) { color = '#e7f5ff'; textColor = '#228be6'; } 

//     return (
//       <div 
//         onClick={() => { /* Add your stage click logic here from previous steps */ }}
//         style={{ padding: '4px 12px', backgroundColor: color, borderRadius: '4px', cursor }}
//       >
//         <Text size="xs" fw={700} c={textColor} style={{ whiteSpace: 'nowrap' }}>{label}</Text>
//       </div>
//     );
//   };

//   const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
//   const currentStageIndex = stages.indexOf(currentStage);

//   return (
//     <>
//       <Drawer 
//         opened={opened} 
//         onClose={() => { setIsEditing(false); onClose(); }} 
//         position="right" 
//         size="80%" 
//         padding="xl"
//         title={<Text fw={500} c="dimmed">Maintenance Requests / {request.subject}</Text>}
//       >
//         <Stack gap="lg">
//           {/* HEADER */}
//           <Group justify="space-between" align="center">
//               <Group>
//                    <Button 
//                       variant="outline" 
//                       color={isEditing ? "green" : "gray"} 
//                       size="xs"
//                       leftSection={isEditing ? <IconDeviceFloppy size={14}/> : <IconPencil size={14}/>}
//                       onClick={toggleEdit}
//                    >
//                       {isEditing ? "Save" : "Edit"}
//                    </Button>
//                    <Button variant="outline" color="gray" size="xs">Create Report</Button>
//               </Group>

//               <Group>
//                   <Button 
//                       variant="default" 
//                       leftSection={<IconFileDescription size={16} color="#7950f2"/>}
//                       onClick={() => setWorksheetOpen(true)}
//                   >
//                       Worksheet
//                   </Button>

//                   <Group gap={5} style={{ border: '1px solid #eee', padding: 5, borderRadius: 8 }}>
//                       {stages.map((s, index) => (
//                           <PipelineStage 
//                               key={s} 
//                               label={s} 
//                               active={s === currentStage} 
//                               completed={index < currentStageIndex}
//                           />
//                       ))}
//                   </Group>

//                   {/* --- TRAFFIC LIGHT MENU --- */}
//                   <Menu shadow="md" width={200}>
//                       <Menu.Target>
//                           <ActionIcon variant="transparent">
//                               <IconCircleFilled size={24} color={getKanbanColor(kanbanState)} />
//                           </ActionIcon>
//                       </Menu.Target>

//                       <Menu.Dropdown>
//                           <Menu.Item 
//                             leftSection={<IconCircleFilled size={14} color="gray"/>}
//                             onClick={() => handleKanbanStateChange('normal')}
//                           >
//                               In Progress
//                           </Menu.Item>
//                           <Menu.Item 
//                             leftSection={<IconCircleFilled size={14} color="red"/>}
//                             onClick={() => handleKanbanStateChange('blocked')}
//                           >
//                               Blocked
//                           </Menu.Item>
//                           <Menu.Item 
//                             leftSection={<IconCircleFilled size={14} color="green"/>}
//                             onClick={() => handleKanbanStateChange('done')}
//                           >
//                               Ready for next stage
//                           </Menu.Item>
//                       </Menu.Dropdown>
//                   </Menu>
//                   {/* ------------------------- */}
//               </Group>
//           </Group>

//           <div style={{ borderBottom: '1px solid #eee' }} />
//           <Title order={1}>{request.subject}</Title>
          
//           {/* ... (Keep the rest of your form Grid/Tabs here) ... */}
          
//         </Stack>
//       </Drawer>
//       {/* ... (Keep Worksheet Modal) ... */}
//     </>
//   );
// }