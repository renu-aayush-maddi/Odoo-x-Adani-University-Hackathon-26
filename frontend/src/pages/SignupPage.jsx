import { useState } from 'react';
import { 
  TextInput, PasswordInput, Anchor, Paper, Title, Text, Container, 
  Button, Stack, Box, ThemeIcon, rem, List 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconSettings, IconX } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { endpoints } from '../api';

export function SignupPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
        notifications.show({
            title: 'Validation Error',
            message: 'Passwords do not match.',
            color: 'orange',
        });
        return;
    }

    setLoading(true);
    try {
      await endpoints.signup({
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      notifications.show({
        title: 'Account Created',
        message: 'Your GearGuard ID is active. Redirecting...',
        color: 'green',
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Signup failed";
      notifications.show({
        title: 'Registration Failed',
        message: msg,
        color: 'red',
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: Branding */}
      <Box 
        visibleFrom="md"
        style={{ 
            flex: 1, 
            backgroundColor: '#2C3E50', 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '4rem'
        }}
      >
        <ThemeIcon size={60} radius="md" variant="filled" color="orange" mb="xl">
            <IconSettings size={34} />
        </ThemeIcon>
        <Title order={1} style={{ fontSize: 36, fontWeight: 900 }}>
            Join GearGuard
        </Title>
        <Text size="lg" mt="md" c="dimmed" style={{ color: '#CBD5E0', maxWidth: 400 }}>
            Create your workspace to start managing:
        </Text>
        
        <List
            mt={30}
            spacing="sm"
            size="md"
            icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                <IconCheck size={16} />
                </ThemeIcon>
            }
        >
            <List.Item style={{ color: 'white' }}>Equipment Lifecycles</List.Item>
            <List.Item style={{ color: 'white' }}>Technician Workflows</List.Item>
            <List.Item style={{ color: 'white' }}>Preventive Maintenance Schedules</List.Item>
        </List>
      </Box>

      {/* RIGHT SIDE: Form */}
      <Box 
        style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#F8F9FA',
            padding: '2rem'
        }}
      >
        <Container size={420} w="100%">
            <Title ta="left" fw={900} order={2}>New Technician ID</Title>
            <Text c="dimmed" size="sm" ta="left" mt={5}>
            Fill in the details to register a new user.
            </Text>
            
            <Paper withBorder shadow="xl" p={30} mt={30} radius="md" bg="white">
            <form onSubmit={handleSubmit}>
                <Stack>
                <TextInput 
                    label="Full Name" 
                    placeholder="John Doe" 
                    required 
                    value={form.name} 
                    onChange={(e) => handleChange('name', e.currentTarget.value)} 
                />
                <TextInput 
                    label="Email" 
                    placeholder="you@gearguard.com" 
                    required 
                    value={form.email} 
                    onChange={(e) => handleChange('email', e.currentTarget.value)} 
                />
                <PasswordInput 
                    label="Password" 
                    placeholder="Create a strong password" 
                    required 
                    mt="sm" 
                    value={form.password} 
                    onChange={(e) => handleChange('password', e.currentTarget.value)} 
                />
                <PasswordInput 
                    label="Confirm Password" 
                    placeholder="Re-enter password" 
                    required 
                    mt="xs" 
                    value={form.confirmPassword} 
                    onChange={(e) => handleChange('confirmPassword', e.currentTarget.value)} 
                />
                
                <Button fullWidth mt="xl" size="md" type="submit" loading={loading} color="orange">
                    CREATE ACCOUNT
                </Button>
                </Stack>
            </form>

            <Text c="dimmed" size="sm" ta="center" mt={20}>
                Already have a team ID?{' '}
                <Anchor component={Link} to="/login" size="sm" fw={700} c="orange">
                Sign In
                </Anchor>
            </Text>
            </Paper>
        </Container>
      </Box>
    </Box>
  );
}