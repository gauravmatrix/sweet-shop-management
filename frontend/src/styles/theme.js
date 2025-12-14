/**
 * Material-UI Theme Configuration
 * Custom theme for Sweet Shop Management System
 */
import { createTheme } from '@mui/material/styles';

const sweetTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B8B',
      light: '#FF9EBA',
      dark: '#FF3A5E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4',
      light: '#80E1DA',
      dark: '#2CA69E',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#FFD166',
      light: '#FFE199',
      dark: '#FFB833',
      contrastText: '#2A2D43',
    },
    sweet: {
      chocolate: '#7B3F00',
      candy: '#FF4081',
      cake: '#FF9800',
      cookie: '#8D6E63',
      dessert: '#2196F3',
      indian: '#F44336',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
      light: 'rgba(247, 249, 252, 0.8)',
    },
    text: {
      primary: '#2A2D43',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    divider: 'rgba(42, 45, 67, 0.1)',
  },
  typography: {
    fontFamily: [
      '"Comic Neue"',
      'cursive',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Fredoka One", cursive',
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#2A2D43',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Fredoka One", cursive',
      fontSize: '2.75rem',
      fontWeight: 600,
      color: '#2A2D43',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Fredoka One", cursive',
      fontSize: '2.25rem',
      fontWeight: 600,
      color: '#2A2D43',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      color: '#2A2D43',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2A2D43',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2A2D43',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#6B7280',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#6B7280',
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#2A2D43',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#6B7280',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: '#9CA3AF',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(255, 107, 139, 0.25)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B8B 0%, #FFD166 100%)',
          boxShadow: '0 4px 14px 0 rgba(255, 107, 139, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF3A5E 0%, #FFB833 100%)',
            boxShadow: '0 6px 20px 0 rgba(255, 107, 139, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #4ECDC4 0%, #80E1DA 100%)',
          boxShadow: '0 4px 14px 0 rgba(78, 205, 196, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2CA69E 0%, #5AD4CC 100%)',
            boxShadow: '0 6px 20px 0 rgba(78, 205, 196, 0.5)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF6B8B',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF6B8B',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6B7280',
            '&.Mui-focused': {
              color: '#FF6B8B',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FF6B8B 0%, #FFD166 100%)',
          boxShadow: '0 4px 20px 0 rgba(255, 107, 139, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 6px 25px 0 rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          alignItems: 'center',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#065F46',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#7F1D1D',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#78350F',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#1E3A8A',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            background: 'linear-gradient(135deg, #FF6B8B 0%, #FFD166 100%)',
            color: '#FFFFFF',
          },
          '&.MuiChip-colorSecondary': {
            background: 'linear-gradient(135deg, #4ECDC4 0%, #80E1DA 100%)',
            color: '#FFFFFF',
          },
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: '#FF6B8B',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        },
        track: {
          borderRadius: 24 / 2,
          backgroundColor: '#E5E7EB',
          opacity: 1,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          '&.MuiCircularProgress-colorPrimary': {
            color: '#FF6B8B',
          },
          '&.MuiCircularProgress-colorSecondary': {
            color: '#4ECDC4',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          '& .MuiRating-iconFilled': {
            color: '#FFD166',
          },
          '& .MuiRating-iconHover': {
            color: '#FFB833',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          '&.Mui-selected': {
            color: '#FF6B8B',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#FF6B8B',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default sweetTheme;