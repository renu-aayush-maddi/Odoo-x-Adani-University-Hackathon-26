import { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Stack, Rating, Text } from '@mantine/core'; // Added Rating, Text
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, endpoints } from '../api';

export function CreateRequestModal({ opened, close, onSuccess, initialDate }) {
  const [equipmentList, setEquipmentList] = useState([]);

  const form = useForm({
    initialValues: {
      subject: '',
      equipment_id: '',
      request_type: 'Corrective',
      scheduled_date: null,
      priority: 1, // Default priority
    },
    validate: {
      subject: (value) => (value.length < 2 ? 'Subject is too short' : null),
      equipment_id: (value) => (!value ? 'Please select equipment' : null),
    },
  });

  // Watch for initialDate changes (Calendar Click)
  useEffect(() => {
    if (opened && initialDate) {
        form.setValues({
            request_type: 'Preventive',
            scheduled_date: initialDate,
            priority: 2 // Default to 2 stars for scheduled work
        });
    }
  }, [initialDate, opened]);

  useEffect(() => {
    api.get(endpoints.equipment).then((res) => {
      const data = res.data.map((item) => ({
        value: item.id.toString(),
        label: `${item.name} (${item.serial_number})`,
      }));
      setEquipmentList(data);
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      let finalDate = null;
      if (values.scheduled_date) {
        finalDate = values.scheduled_date instanceof Date 
          ? values.scheduled_date.toISOString() 
          : values.scheduled_date;
      }

      await api.post(endpoints.requests, {
        ...values,
        equipment_id: parseInt(values.equipment_id),
        scheduled_date: finalDate,
        priority: values.priority, // Send Priority
      });

      notifications.show({ title: 'Success', message: 'Request created!', color: 'green' });
      form.reset();
      onSuccess();
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

          {form.values.request_type === 'Preventive' && (
            <DateInput
              label="Scheduled Date"
              placeholder="Pick date"
              withAsterisk
              minDate={new Date()}
              {...form.getInputProps('scheduled_date')}
            />
          )}

          {/* PRIORITY STARS */}
          <div>
            <Text size="sm" fw={500} mb={3}>Priority</Text>
            <Rating 
                {...form.getInputProps('priority')} 
                size="lg"
            />
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit">Create Request</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}