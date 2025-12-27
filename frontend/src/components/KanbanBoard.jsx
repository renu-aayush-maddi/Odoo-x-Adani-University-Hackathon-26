import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Title, Card, Text, Badge, Group, Avatar, ScrollArea, LoadingOverlay, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // <--- 1. Import Hook
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'react-router-dom';
import { IconFilterOff, IconPlus } from '@tabler/icons-react'; // <--- 2. Import Icon
import { api, endpoints } from '../api';
import dayjs from 'dayjs';

// Import the Modal Component
import { CreateRequestModal } from "../components/CreateRequestModal"

const columns = {
  'New': { id: 'New', title: 'New Requests', color: 'blue' },
  'In Progress': { id: 'In Progress', title: 'In Progress', color: 'orange' },
  'Repaired': { id: 'Repaired', title: 'Repaired', color: 'green' },
  'Scrap': { id: 'Scrap', title: 'Scrap', color: 'red' },
};

export function KanbanBoard() {
  // --- Hooks & State ---
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false); // <--- 3. Modal State

  // --- Filtering Logic ---
  const filterEquipmentId = searchParams.get('equipmentId');

  const displayedRequests = filterEquipmentId 
    ? requests.filter(r => r.equipment_id === parseInt(filterEquipmentId)) 
    : requests;

  const clearFilter = () => {
    setSearchParams({});
  };

  const getColumnData = (stage) => displayedRequests.filter(r => r.stage === stage);

  // --- Data Fetching ---
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(endpoints.requests);
      setRequests(res.data);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to fetch requests', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  // --- Drag & Drop Logic ---
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;
    const reqId = parseInt(draggableId);

    // Optimistic Update
    const updatedRequests = requests.map(req => 
      req.id === reqId ? { ...req, stage: newStage } : req
    );
    setRequests(updatedRequests);

    try {
      await api.put(`/requests/${reqId}/stage`, { stage: newStage });
      notifications.show({ title: 'Updated', message: `Moved to ${newStage}`, color: 'green' });
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to update stage', color: 'red' });
      fetchRequests(); // Revert
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      {/* --- HEADER SECTION --- */}
      <Group justify="space-between" mb="md" align="center">
        <Group>
          <Title order={2}>Maintenance Board</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={open} size="sm">
            New Request
          </Button>
        </Group>

        <Button onClick={fetchRequests} variant="light" size="sm">Refresh</Button>
      </Group>

      {/* --- FILTER BANNER --- */}
      {filterEquipmentId && (
        <Card withBorder shadow="sm" radius="md" padding="xs" mb="md" bg="blue.0">
          <Group justify="space-between">
            <Text size="sm" c="blue.9" fw={500}>
              Filtering by Equipment ID: {filterEquipmentId}
            </Text>
            <Button 
              variant="subtle" 
              color="red" 
              size="xs" 
              leftSection={<IconFilterOff size={14}/>}
              onClick={clearFilter}
            >
              Clear Filter
            </Button>
          </Group>
        </Card>
      )}

      {/* --- MODAL --- */}
      <CreateRequestModal 
        opened={opened} 
        close={close} 
        onSuccess={fetchRequests} 
      />

      {/* --- KANBAN COLUMNS --- */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', height: '100%', overflowX: 'auto', paddingBottom: 10 }}>
          {Object.values(columns).map(col => (
            <div key={col.id} style={{ minWidth: 300, width: 350, display: 'flex', flexDirection: 'column' }}>
              
              {/* Column Header */}
              <Card shadow="sm" p="sm" radius="md" mb="sm" withBorder style={{ borderTop: `4px solid var(--mantine-color-${col.color}-filled)` }}>
                <Group justify="space-between">
                  <Text fw={700}>{col.title}</Text>
                  <Badge color={col.color} variant="light">{getColumnData(col.id).length}</Badge>
                </Group>
              </Card>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <ScrollArea 
                    style={{ flex: 1, backgroundColor: snapshot.isDraggingOver ? '#f8f9fa' : 'transparent', borderRadius: 8 }}
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                  >
                    {getColumnData(col.id).map((req, index) => {
                      // Overdue Logic
                      const isOverdue = req.scheduled_date && dayjs(req.scheduled_date).isBefore(dayjs()) && req.stage !== 'Repaired';
                      
                      return (
                        <Draggable key={req.id} draggableId={req.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Card 
                              shadow={snapshot.isDragging ? 'xl' : 'sm'} 
                              mb="sm" 
                              radius="md" 
                              withBorder 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ 
                                ...provided.draggableProps.style,
                                borderColor: isOverdue ? 'red' : undefined,
                                borderWidth: isOverdue ? 2 : 1
                              }}
                            >
                              <Group justify="space-between" align="start" mb="xs">
                                <Text fw={600} size="sm" lineClamp={2}>{req.subject}</Text>
                                {isOverdue && <Badge color="red" size="xs">Overdue</Badge>}
                              </Group>

                              <Text size="xs" c="dimmed" mb="xs">
                                {req.equipment ? req.equipment.name : 'Unknown Eq'} • {req.team ? req.team.name : 'No Team'}
                              </Text>

                              <Group justify="space-between" mt="md">
                                <Badge size="xs" variant="outline">{dayjs(req.scheduled_date || req.created_at).format('MMM D')}</Badge>
                                {req.technician && (
                                  <Avatar src={req.technician.avatar_url} size="sm" radius="xl" />
                                )}
                              </Group>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <LoadingOverlay visible={loading} />
    </div>
  );
}