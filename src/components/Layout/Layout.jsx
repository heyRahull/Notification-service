import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  CssBaseline 
} from '@mui/material';

// --- ICONS ---
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import CampaignIcon from '@mui/icons-material/Campaign';

const drawerWidth = 260; // Standard width for a Material UI sidebar

const sidebarItems = [
  { 
    name: 'Notification Definitions', 
    path: '/definitions', 
    icon: <NotificationsIcon /> 
  },
  { 
    name: 'Delivery Mechanisms', 
    path: '/delivery-mechanisms', 
    icon: <SettingsIcon /> 
  },
  { 
    name: 'URL Configuration', 
    path: '/url-configuration', 
    icon: <LinkIcon /> 
  },
  { 
    name: 'Campaigns', 
    path: '/campaigns', 
    icon: <CampaignIcon /> 
  },
];

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 

      {/* --- HEADER Full Width --- */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure the header is above the drawer
          backgroundColor: '#202C45' 
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Notification Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* --- SIDEBAR / DRAWER --- */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#F5F5F5', 
            // The height of the sidebar will automatically start below the AppBar
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Adds necessary space at the top of the drawer to avoid overlapping the AppBar */}
        <Toolbar /> 
        <Box sx={{ overflow: 'auto' }}>
          
          <List>
            {sidebarItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA (Pushed over by the drawer width) --- */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#EAEDED', 
         p: 0, // <--- ZERO LAYOUT PADDING (Crucial Fix)
          minHeight: '100vh', // Ensure it respects full screen height
        }} 
      >
        <Toolbar /> {/* Spacer to push content below the fixed AppBar */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;