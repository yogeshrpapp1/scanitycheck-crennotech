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

export function Login() {
  const navigate = useNavigate();

  return (
    <Container w={420} my={0}>
      <Title ta="center" className={classes.title}>
        Welcome!
      </Title>

      <Paper withBorder shadow="sm" p="lg" mt="lg" radius="md">
        <TextInput label="Email" placeholder="your@email.com" required radius="md" />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" radius="md" />
        <Button fullWidth mt="xl" radius="md" onClick={() => navigate('/dashboard')}>
          Login
        </Button>
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