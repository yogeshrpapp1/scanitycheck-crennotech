import { Center } from '@mantine/core';
import { Login } from '@/components/Login/Login';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <Center mih="100vh" py="md">
      <Login />
    </Center>
  );
}
