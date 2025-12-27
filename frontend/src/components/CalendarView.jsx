// import { useEffect, useState } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import format from 'date-fns/format';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import getDay from 'date-fns/getDay';
// import enUS from 'date-fns/locale/en-US';
// import { Title, Card, LoadingOverlay, Badge, Group, Text, Modal, Button } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { api, endpoints } from '../api';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import dayjs from 'dayjs';

// // Setup Localizer for the Calendar
// const locales = { 'en-US': enUS };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// export function CalendarView() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [opened, { open, close }] = useDisclosure(false);

//   useEffect(() => {
//     fetchPreventiveRequests();
//   }, []);

//   const fetchPreventiveRequests = async () => {
//     try {
//       const res = await api.get(endpoints.requests);
//       // Filter for Preventive requests AND ensure they have a date
//       const calendarEvents = res.data
//         .filter(req => req.request_type === 'Preventive' && req.scheduled_date)
//         .map(req => ({
//           id: req.id,
//           title: `${req.equipment ? req.equipment.name : 'Unknown'} - ${req.subject}`,
//           start: new Date(req.scheduled_date),
//           end: new Date(req.scheduled_date), // 1-day event
//           allDay: true,
//           resource: req
//         }));
//       setEvents(calendarEvents);
//     } catch (error) {
//       console.error("Failed to fetch calendar events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event.resource);
//     open();
//   };

//   // Custom styling for events
//   const eventStyleGetter = (event) => {
//     const isOverdue = dayjs(event.start).isBefore(dayjs(), 'day') && event.resource.stage !== 'Repaired';
//     const backgroundColor = isOverdue ? '#fa5252' : '#228be6'; // Red if overdue, Blue otherwise
//     return {
//       style: {
//         backgroundColor,
//         borderRadius: '5px',
//         opacity: 0.8,
//         color: 'white',
//         border: '0px',
//         display: 'block'
//       }
//     };
//   };

//   return (
//     <div style={{ height: 'calc(100vh - 100px)' }}>
//       <Title order={2} mb="md">Preventive Maintenance Schedule</Title>
      
//       <Card shadow="sm" radius="md" withBorder style={{ height: '90%' }}>
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: '100%' }}
//           onSelectEvent={handleSelectEvent}
//           eventPropGetter={eventStyleGetter}
//           views={['month', 'week', 'agenda']}
//         />
//       </Card>

//       <LoadingOverlay visible={loading} />

//       {/* Event Detail Modal */}
//       <Modal opened={opened} onClose={close} title="Maintenance Details" centered>
//         {selectedEvent && (
//           <div>
//             <Badge color={selectedEvent.stage === 'Repaired' ? 'green' : 'blue'} mb="md">
//               {selectedEvent.stage}
//             </Badge>
//             <Title order={4}>{selectedEvent.subject}</Title>
//             <Text c="dimmed" size="sm" mb="xs">
//               {selectedEvent.equipment?.name} ({selectedEvent.equipment?.serial_number})
//             </Text>
            
//             <Group mt="md">
//               <Text fw={500} size="sm">Scheduled:</Text>
//               <Text size="sm">{dayjs(selectedEvent.scheduled_date).format('MMMM D, YYYY')}</Text>
//             </Group>
            
//             <Group mt="xs">
//               <Text fw={500} size="sm">Team:</Text>
//               <Text size="sm">{selectedEvent.team?.name}</Text>
//             </Group>

//             <Group justify="flex-end" mt="xl">
//                <Button onClick={close}>Close</Button>
//             </Group>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { Title, Card, LoadingOverlay, Badge, Group, Text, Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { api, endpoints } from '../api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';

// Import Create Modal
import { CreateRequestModal } from './CreateRequestModal';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Modal State for Details
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  
  // Modal State for Creating New Request
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [clickedDate, setClickedDate] = useState(null);

  useEffect(() => {
    fetchPreventiveRequests();
  }, []);

  const fetchPreventiveRequests = async () => {
    try {
      const res = await api.get(endpoints.requests);
      const calendarEvents = res.data
        .filter(req => req.request_type === 'Preventive' && req.scheduled_date)
        .map(req => ({
          id: req.id,
          title: `${req.equipment ? req.equipment.name : 'Unknown'} - ${req.subject}`,
          start: new Date(req.scheduled_date),
          end: new Date(req.scheduled_date),
          allDay: true,
          resource: req
        }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    openDetails();
  };

  // Handle clicking a blank date slot
  const handleSelectSlot = ({ start }) => {
    setClickedDate(start);
    openCreate();
  };

  const eventStyleGetter = (event) => {
    const isOverdue = dayjs(event.start).isBefore(dayjs(), 'day') && event.resource.stage !== 'Repaired';
    const backgroundColor = isOverdue ? '#fa5252' : '#228be6';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Title order={2} mb="md">Preventive Maintenance Schedule</Title>
      
      <Card shadow="sm" radius="md" withBorder style={{ height: '90%' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'agenda']}
          selectable={true} // Enable clicking slots
          onSelectSlot={handleSelectSlot} // Handle the click
        />
      </Card>

      <LoadingOverlay visible={loading} />

      {/* Detail Modal */}
      <Modal opened={detailsOpened} onClose={closeDetails} title="Maintenance Details" centered>
        {selectedEvent && (
          <div>
            <Badge color={selectedEvent.stage === 'Repaired' ? 'green' : 'blue'} mb="md">
              {selectedEvent.stage}
            </Badge>
            <Title order={4}>{selectedEvent.subject}</Title>
            <Text c="dimmed" size="sm" mb="xs">
              {selectedEvent.equipment?.name} ({selectedEvent.equipment?.serial_number})
            </Text>
            
            <Group mt="md">
              <Text fw={500} size="sm">Scheduled:</Text>
              <Text size="sm">{dayjs(selectedEvent.scheduled_date).format('MMMM D, YYYY')}</Text>
            </Group>
            
            <Group mt="xs">
              <Text fw={500} size="sm">Team:</Text>
              <Text size="sm">{selectedEvent.team?.name}</Text>
            </Group>

            <Group justify="flex-end" mt="xl">
               <Button onClick={closeDetails}>Close</Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* Create Request Modal (Pre-filled Date) */}
      <CreateRequestModal 
        opened={createOpened} 
        close={closeCreate} 
        onSuccess={fetchPreventiveRequests}
        initialDate={clickedDate} 
      />
    </div>
  );
}