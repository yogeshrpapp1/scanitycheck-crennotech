import { Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import image from '@/assets/notfound.svg'
import classes from './NotFound.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '@/api/client';

export function NotFound() {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    const token = getAuthToken();
    const target = token ? '/dashboard' : '/';
    navigate(target, { replace: true });
  };

  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image} className={classes.mobileImage} alt="Page not found" />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Endpoint not found. Our scanner checked every port, but this page isn't here. You may have mistyped the address, or the page has been moved to another URL.
          </Text>
          <Button onClick={handleGoHome} variant="outline" size="md" mt="xl" className={classes.control}>
            Get back to safety
          </Button>
        </div>
        <Image src={image} className={classes.desktopImage} alt="Page not found" />
      </SimpleGrid>
    </Container>
  );
}