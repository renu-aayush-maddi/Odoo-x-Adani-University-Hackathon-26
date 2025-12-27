import { useState } from 'react';
import { TextInput, PasswordInput, Anchor, Paper, Title, Text, Container, Button, Stack, Notification } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { endpoints } from '../api';

export function SignupPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);
    try {
      await endpoints.signup({
        name: form.name,
        email: form.email,
        password: form.password
      });
      setSuccess("Account created successfully!");
      // Optional: Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>Create Portal Account</Title>
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Notification icon={<IconX size={18} />} color="red" onClose={() => setError(null)} mb="md">{error}</Notification>}
        {success && <Notification icon={<IconCheck size={18} />} color="green" onClose={() => setSuccess(null)} mb="md">{success}</Notification>}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Name" placeholder="Your name" required value={form.name} onChange={(e) => handleChange('name', e.currentTarget.value)} />
            <TextInput label="Email" placeholder="you@example.com" required value={form.email} onChange={(e) => handleChange('email', e.currentTarget.value)} />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" value={form.password} onChange={(e) => handleChange('password', e.currentTarget.value)} />
            <Text size="xs" c="dimmed">Must contain 1 uppercase, 1 lowercase, 1 special char, and &gt;8 chars.</Text>
            <PasswordInput label="Re-Enter Password" placeholder="Confirm password" required mt="sm" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.currentTarget.value)} />
            
            <Button fullWidth mt="xl" type="submit" loading={loading}>Sign up</Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt={20}>
          Already have an account?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Sign In
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}