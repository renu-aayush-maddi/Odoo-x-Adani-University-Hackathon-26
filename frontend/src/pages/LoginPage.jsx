import { useState } from 'react';
import { 
  TextInput, PasswordInput, Anchor, Paper, Title, Text, Container, 
  Button, Stack, Box, ThemeIcon, rem 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSettings, IconLogin, IconX } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { endpoints } from '../api';
import { useAuthStore } from '../store/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await endpoints.login({ email, password });
      login(response.data);
      
      notifications.show({
        title: 'Welcome back',
        message: 'Successfully logged in to GearGuard',
        color: 'teal',
        icon: <IconLogin style={{ width: rem(18), height: rem(18) }} />,
      });

      navigate('/dashboard'); 
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      notifications.show({
        title: 'Authentication Failed',
        message: msg,
        color: 'red',
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: Branding - Fixed to take 50% width and full height */}
      <Box 
        visibleFrom="md" 
        style={{ 
            flex: 1, 
            backgroundColor: '#1A202C', 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '4rem' 
        }}
      >
        <ThemeIcon size={80} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="xl">
            <IconSettings size={50} />
        </ThemeIcon>
        <Title order={1} style={{ fontSize: 48, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1 }}>
            GearGuard
        </Title>
        <Text size="xl" mt="md" c="dimmed" style={{ maxWidth: 450 }}>
            The Ultimate Maintenance Tracker. Seamlessly connect Equipment, Teams, and Requests.
        </Text>
      </Box>

      {/* RIGHT SIDE: Form - Fixed to take 50% width and full height */}
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
            <Title ta="left" fw={900} order={2}>Admin Portal</Title>
            <Text c="dimmed" size="sm" ta="left" mt={5}>
            Please sign in to access maintenance schedules.
            </Text>
            
            <Paper withBorder shadow="xl" p={30} mt={30} radius="md" bg="white">
            <form onSubmit={handleSubmit}>
                <Stack>
                <TextInput 
                    label="Email Address" 
                    placeholder="tech@gearguard.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <PasswordInput 
                    label="Password" 
                    placeholder="Your secure password" 
                    required 
                    mt="sm" 
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button fullWidth mt="xl" size="md" type="submit" loading={loading}>
                    ACCESS PORTAL
                </Button>
                </Stack>
            </form>

            <Text c="dimmed" size="sm" ta="center" mt={20}>
                Don't have an account?{' '}
                <Anchor component={Link} to="/signup" size="sm" fw={700}>
                Initialize New Account
                </Anchor>
            </Text>
            </Paper>
        </Container>
      </Box>
    </Box>
  );
}