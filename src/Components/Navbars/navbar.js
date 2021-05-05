import React from 'react'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BugReportIcon from '@material-ui/icons/BugReport';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Homepage from '../Dashboardcomponents/homepage'
import Profile from '../Dashboardcomponents/profile'
import UserTickets from '../Dashboardcomponents/usertickets'
import UserProjects from '../Dashboardcomponents/userprojects'
import ManageUsers from '../Dashboardcomponents/manageusers'
import ManageProjects from '../Dashboardcomponents/manageprojects'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


export default function Navbar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(window.innerWidth<=600 ? false : true);
  const [page, currentPage] = React.useState("home")

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const setPage = (evt) => {
    currentPage(evt.currentTarget.getAttribute("value"))
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{ backgroundColor: '#121110' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="text-capitalize" variant="h5" noWrap><strong>Hello {window.localStorage.Name}</strong> | <span className="text-capitalize h6">{window.localStorage.Role==="projectmanager" ? "project manager" : window.localStorage.Role}</span></Typography>
          <Button className="ml-auto" onClick={props.logout} size="large" variant="contained" color="secondary"><strong>LOGOUT</strong></Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[{page:'home', name:'Home', icon: <HomeIcon />}, {page:'manageroles', name:'Manage Roles', icon: <SupervisorAccountIcon />}, {page:'manageprojects', name:'Manage Projects', icon: <CreateNewFolderIcon />}].map((text, index) => (
            <ListItem onClick={setPage} value={text.page} button key={text.name}>
              <ListItemIcon>{text.icon}</ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[{page:'myprojects', name:'My Projects', icon: <AccountTreeIcon />}, {page:'mytickets', name:'My Tickets', icon: <BugReportIcon />}, {page:'myprofile', name:'My Profile', icon: <AssignmentIndIcon />}].map((text, index) => (
            <ListItem onClick={setPage} value={text.page} button key={text.name}>
              <ListItemIcon>{text.icon}</ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        {/* ALL COMPONENTS AND CONTENT GOES HERE */}
        {page==="home" && <Homepage/>}
        {page==="manageroles" && <ManageUsers/>}
        {page==="manageprojects" && <ManageProjects/>}
        {page==="myprojects" && <UserProjects/>}
        {page==="mytickets" && <UserTickets/>}
        {page==="myprofile" && <Profile/>}
        
      </main>
    </div>
  );
}