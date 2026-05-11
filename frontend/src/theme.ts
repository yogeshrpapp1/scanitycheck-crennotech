import { createTheme, MantineColorsTuple } from '@mantine/core';

// A "Deep Security Blue" palette
const securityBlue: MantineColorsTuple = [
  "#edf3ff",
  "#dde4f4",
  "#b9c5e1",
  "#93a6d0",
  "#738ac0",
  "#5f79b8",
  "#5471b4",
  "#4460a0", // Index 7: Main Brand Color
  "#3a5590",
  "#2d4980",
];

export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    'security-blue': securityBlue,
  },

  // You can set global styles for components here
  components: {
    Button: {
      defaultProps: {
        radius: 'md', // Makes buttons slightly rounded throughout the app
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true, // Gives that clean dashboard look
      },
    },
  },

  // Font styling
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Greycliff CF, sans-serif' },
});
