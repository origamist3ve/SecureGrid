import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#284CEA' },
        secondary: { main: '#ff4081' },

        darkMode: {
            main: '#333',
            contrastText: '#fff',
        },
        typography: {
            button: {
                textTransform: 'none'
            },
        },
    },
    // More theme options...
});


export default theme;
