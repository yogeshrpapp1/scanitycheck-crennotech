import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import { useState } from 'react';
import { loginUser } from '@/api/auth';

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    if (e) {e.preventDefault();}
    setLoading(true);
    setError(null);
    try {
      const authResponse = await loginUser({ email, password });

      const { fullName, email: userEmail, role, token } = authResponse;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ fullName, email: userEmail, role }));
      
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container w={420} my={0}>
      <Title ta="center" className={classes.title}>
        Welcome!
      </Title>

      <Paper withBorder shadow="sm" p="lg" mt="lg" radius="md">
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            radius="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            mt="md"
            radius="md"
          />

          {error && <Text c="red.7" size="sm" mt="xl" ta="center">{error}</Text>}

          <Button 
            fullWidth
            mt="xl"
            radius="md"
            loading={loading}
            type="submit"
          >
            Login
          </Button>
        </form>
      </Paper>

      <Text className={classes.subtitle} mt="md">
        Don't have an account?{' '}
        <Anchor component={Link} to="/register" fz="sm">Register</Anchor>
      </Text>

      <Group justify="center" mt="md">
        <DarkModeToggle />
      </Group>

    </Container>
  );
}