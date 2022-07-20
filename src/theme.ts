import { createTheme } from '@mui/material/styles';
import { blueGrey, grey } from '@mui/material/colors';

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
    },
    connectButton: {
      main: blueGrey[50]
    },
    dashboardNav: {
      main: grey[50]
    }
  }
});

declare module "@mui/material/styles/createPalette" {
  export interface PaletteOptions {
    connectButton: {
      main: string;
    };
    dashboardNav: {
      main: string;
    };
  }
}

export default theme;