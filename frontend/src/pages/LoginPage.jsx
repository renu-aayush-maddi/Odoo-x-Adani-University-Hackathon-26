import { useState } from 'react';
import { TextInput, PasswordInput, Anchor, Paper, Title, Text, Container, Button, Stack, Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { endpoints } from '../api';
import { useAuthStore } from '../store/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Zustand Action
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await endpoints.login({ email, password });
      login(response.data); // Save to Zustand
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>Welcome back!</Title>
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
            <Notification icon={<IconX size={18} />} color="red" onClose={() => setError(null)} mb="md">
                {error}
            </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput 
                label="Email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput 
                label="Password" 
                placeholder="Your password" 
                required 
                mt="md" 
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt={20}>
          Don't have an account?{' '}
          <Anchor component={Link} to="/signup" size="sm">
            Sign Up
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}