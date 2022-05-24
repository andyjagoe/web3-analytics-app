import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
        light: '#5d89ca',
        main: '#255c99',
        dark: '#00336a',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ec4a43',
        main: '#b3001b',
        dark: '#7b0000',
        contrastText: '#fff',
    }
  }
});

export default theme;