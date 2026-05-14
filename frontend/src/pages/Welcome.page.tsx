import { Center, Loader } from '@mantine/core';
import { Login } from '@/components/Login/Login';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function WelcomePage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader color="blue" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Center mih="100vh" py="md">
      <Login />
    </Center>
  );
}
