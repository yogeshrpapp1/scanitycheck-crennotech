import classes from './Register.module.css';
import { useState, useEffect } from 'react';
import { Button, TextInput, PasswordInput, Paper, Title, Container, Stack, Text, Progress, ThemeIcon, Box, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { IconCheck } from '@tabler/icons-react';
import { registerUser } from '@/api/auth';

const getStrength = (password: string) => {
  let s = 0;
  if (password.length > 7) {s += 1;}
  if (password.match(/[0-9]/)) {s += 1;}
  if (password.match(/[A-Z]/)) {s += 1;}
  if (password.match(/[^a-zA-Z0-9]/)) {s += 1;}
  return s;
};

export function Register() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [livePassword, setLivePassword] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      fullName: (value) => (value.length < 1 ? 'Name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  form.watch('password', ({ value }) => {
    setLivePassword(value || '');
  });

  const strength = getStrength(livePassword);
  const strengthColor = strength === 4 ? 'teal' : strength > 2 ? 'yellow' : 'red';

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      
      setSubmitted(true);
    } catch (error: any) {
      form.setFieldError('email', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (submitted && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (submitted && countdown === 0) {
      navigate('/');
    }
    return () => clearInterval(interval);
  }, [submitted, countdown, navigate]);

  return (

    <Container w={420} my={0}>
      <Title ta="center" className={classes.title}>
        {submitted ? 'Welcome!' : 'Create Account'}
      </Title>

      <Paper withBorder shadow="sm" p="lg" mt="lg" radius="md">
        {submitted ? (
          /* --- SUCCESS VIEW --- */
          <Stack align="center" gap="md">
            <ThemeIcon color="teal" size={60} radius="xl" variant="light">
               <IconCheck size={38} stroke={2.5} />
            </ThemeIcon>
            <Box ta="center">
              <Text fw={700} size="lg">Account Created Successfully!</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Redirecting you to login in <b>{countdown}</b> seconds...
              </Text>
            </Box>
            <Button variant="light" fullWidth onClick={() => navigate('/')}>
              Click here to go now
            </Button>
          </Stack>        
        ) : (
          /* --- FORM VIEW --- */
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Full Name"
              placeholder="John Smith"
              required
              key={form.key('fullName')}
              {...form.getInputProps('fullName')}
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              mt="md"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />

            <Box>
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />

              <Progress 
                  color={strengthColor} 
                  value={livePassword.length > 0 ? (strength / 4) * 100 : 0} 
                  size={5} 
                  mt="xs" 
              />

              <Text c="dimmed" size="xs" mt={5}>
                  Strength: {livePassword.length === 0 ? 'Enter password' : strength === 4 ? 'Strong' : strength > 2 ? 'Medium' : 'Weak'}
              </Text>
            </Box>

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat password"
              required
              mt="md"
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
              <Button type="submit" fullWidth mt="xl" loading={loading}>
                Register
              </Button>
          </form>
        )}
      </Paper>

      {!submitted && (
        <Text ta="center" mt="md" size="sm" c="dimmed">
          Already have an account?{' '}
          <Anchor component={Link} to="/" fz="sm">Login</Anchor>
        </Text>
      )}

    </Container>
  );
}