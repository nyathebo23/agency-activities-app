import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, CssBaseline, IconButton, styled, Toolbar, Typography, useTheme } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, Outlet, useNavigate } from 'react-router';
import type { jsx } from '@emotion/react';
import { useAxiosInterceptor } from '../utils/axios-interceptor';
import { useAuth } from '../context/auth-context';

import type { JSX } from 'react/jsx-runtime';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppTopBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function Layout() {  
  useAxiosInterceptor();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems: {
    label: string, link: string, icon: jsx.JSX.Element
  }[] = [
    {label: 'Agency agents list', link:'/agency-agents-list', icon: <GroupsIcon/>},
    {label: 'Create tickets', link:'/tickets-create', icon: <BookOnlineIcon/>},
    {label: 'Tickets list review', link:'/tickets-list', icon: <ConfirmationNumberIcon/>},
    {label: 'Travels', link:'/travels', icon: <DirectionsBusFilledIcon/>},
    {label: 'Ticket refunds', link:'/ticket-refunds', icon: <ReceiptIcon/>},
  ];

  const extraNavItems: {
      label: string;
      link: string;
      icon: JSX.Element;
  }[] = [
    //{label: 'Settings', link:'/settings', icon: <SettingsIcon/>},
    //{label: 'Help', link:'/help', icon: <HelpIcon/>},
  ];

  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppTopBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Trip management
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            sx={{ ml: 'auto' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppTopBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {navItems.map((item) => (
          <ListItem component="nav" key={item.label} disablePadding>
            <ListItemButton
                component={NavLink}
                to={item.link}
                sx={{
                    '&.active': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                        color: 'inherit',
                    },
                    },
                }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        </List>
        <Divider />
        <List>
          {extraNavItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.link}
                sx={{
                    '&.active': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                        color: 'inherit',
                    },
                    },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet/>
      </Main>
    </Box>
  );
  // const DrawerList = (
  //   <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
  //     <List>
  //       {navItems.map((item) => (
  //         <ListItem component="nav" key={item.label} disablePadding>
  //           <ListItemButton
  //               component={NavLink}
  //               to={item.link}
  //               sx={{
  //                   '&.active': {
  //                   bgcolor: 'primary.light',
  //                   color: 'primary.contrastText',
  //                   '& .MuiListItemIcon-root': {
  //                       color: 'inherit',
  //                   },
  //                   },
  //               }}
  //           >
  //             <ListItemIcon>
  //               {item.icon}
  //             </ListItemIcon>
  //             <ListItemText primary={item.label} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //   </Box>
  // );

  // return (
  //   <Box sx={{ display: 'flex' }}>
  //       <AppBar position="fixed">
  //           <Toolbar>
  //           <IconButton
  //               size="large"
  //               edge="start"
  //               color="inherit"
  //               aria-label="menu"
  //               onClick={toggleDrawer(true)}
  //               sx={{ mr: 2 }}
  //           >
  //               <MenuIcon />
  //           </IconButton>
  //           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //               Trip management
  //           </Typography>          
  //           </Toolbar>
  //       </AppBar>
  //       <Drawer open={open} onClose={toggleDrawer(false)}>
  //           {DrawerList}
  //       </Drawer>
  //       <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
  //           <Outlet/>
  //       </Box>
  //   </Box>
  // );
}