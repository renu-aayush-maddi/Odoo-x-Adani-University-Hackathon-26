import { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, endpoints } from '../api';

export function CreateRequestModal({ opened, close, onSuccess }) {
  const [equipmentList, setEquipmentList] = useState([]);

  // Form state management
  const form = useForm({
    initialValues: {
      subject: '',
      equipment_id: '',
      request_type: 'Corrective', // Default to breakdown
      scheduled_date: null,
    },
    validate: {
      subject: (value) => (value.length < 2 ? 'Subject is too short' : null),
      equipment_id: (value) => (!value ? 'Please select equipment' : null),
    },
  });

  // Fetch equipment list for the dropdown
  useEffect(() => {
    api.get(endpoints.equipment).then((res) => {
      // Format for Mantine Select: { value: '1', label: 'Name' }
      const data = res.data.map((item) => ({
        value: item.id.toString(),
        label: `${item.name} (${item.serial_number})`,
      }));
      setEquipmentList(data);
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      await api.post(endpoints.requests, {
        ...values,
        equipment_id: parseInt(values.equipment_id),
        // Send date only if it exists (for Preventive)
        scheduled_date: values.scheduled_date ? values.scheduled_date.toISOString() : null,
      });

      notifications.show({ title: 'Success', message: 'Request created!', color: 'green' });
      form.reset();
      onSuccess(); // Refresh the parent board
      close();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to create request', color: 'red' });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="New Maintenance Request" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Subject"
            placeholder="e.g. Leaking Oil"
            withAsterisk
            {...form.getInputProps('subject')}
          />

          <Select
            label="Equipment"
            placeholder="Select machine"
            data={equipmentList}
            searchable
            withAsterisk
            {...form.getInputProps('equipment_id')}
          />

          <Select
            label="Request Type"
            data={['Corrective', 'Preventive']}
            {...form.getInputProps('request_type')}
          />

          {/* Only show Date Picker for Preventive requests [cite: 48] */}
          {form.values.request_type === 'Preventive' && (
            <DateInput
              label="Scheduled Date"
              placeholder="Pick date"
              withAsterisk
              minDate={new Date()}
              {...form.getInputProps('scheduled_date')}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit">Create Request</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}