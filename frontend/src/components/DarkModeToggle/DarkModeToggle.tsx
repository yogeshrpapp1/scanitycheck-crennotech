import { Switch, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

interface DarkModeToggleProps {
variant?: 'default' | 'transparent';
}

export function DarkModeToggle({ variant = 'default' }: DarkModeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [checked, setChecked] = useState(computedColorScheme === 'dark');

  useEffect(() => {
    setChecked(computedColorScheme === 'dark');
  }, [computedColorScheme]);

  const handleToggle = (value: boolean) => {
    setChecked(value);

    setTimeout(() => {
      setColorScheme(value ? 'dark' : 'light');
    }, 100);
  };

  const iconColor = variant === 'transparent' 
    ? 'white' 
    : undefined;

  return (
    <Switch
      size="md"
      color="dark.5"
      checked={checked}
      onChange={(event) => handleToggle(event.currentTarget.checked)}
      onLabel={<IconSun size={16} color={iconColor || "var(--mantine-color-yellow-4)"} />}
      offLabel={<IconMoonStars size={16} color={iconColor || "var(--mantine-color-blue-6)"} />}
      styles={{
        track: {
          cursor: 'pointer',
          backgroundColor: variant === 'transparent' ? 'transparent' : undefined,
          border: variant === 'transparent' ? '1px solid rgba(255, 255, 255, 0.3)' : undefined,
        },
        thumb: {
          cursor: 'pointer',
          border: variant === 'transparent' ? 'none' : undefined,
        },
      }}
    />
  );
}