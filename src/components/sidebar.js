import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import AdbIcon from '@material-ui/icons/Adb';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import { Link , BrowserRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserImage from '../images/user.png';

import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const iconList = Object
  .keys(Icons)
  .filter(key => key !== "fas" && key !== "prefix" )
  .map(icon => Icons[icon])

library.add(...iconList)

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
      backgroundColor : '#3f51b5 ',
      marginTop : '25px'
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const StyledList = styled(List)`
  background-color: #3f51b5;
  color: #fff;    
  font-weight: 400 !important;
  &:hover {
  }
`;

const StyledListItem = styled(ListItem)`
  background-color: #3f51b5;
`;

const StyledListText = styled(ListItemText)`
  background-color: #3f51b5;
  color: #fff;
  font-size: 0.5rem !important;
  font-weight: 400 !important;
  &:hover {
  }
`;

function ResponsiveDrawer(props) {
    const menuList = {
        module: '116',
        icon: 'faEdit',
        menu : [
            {
                name : 'Home',
                openned : false,
                submenu : false,
                icon : 'home',
                href : '/home'
            },
            // {
            //     name : 'Data Upload',
            //     submenu : true,
            //     openned : false,
            //     icon : 'database',
            //     submenuList : [
            //         {
            //             name : 'Load Status',
            //             icon : 'exchange-alt',
            //             href : '/transactions',
            //             submenu : false
            //         },
            //         {
            //             name : 'CSV Upload',
            //             icon : 'cloud-upload-alt',
            //             href : '/upload',
            //             submenu : false
            //         }
            //     ]
            // },
            // {
            //     name : 'Reports',
            //     submenu : true,
            //     openned : false,
            //     icon : 'copy',
            //     submenuList : [
            //         {
            //             name : 'Schedule Summary Report',
            //             icon : 'calendar-alt',
            //             href : '/sch_summary_report',
            //             submenu : false
            //         },
            //         {
            //             name : 'Schedule Detail Report',
            //             icon : 'calendar-check',
            //             href : '/sch_sumary_details',
            //             submenu : false
            //         },
            //         {
            //             name : 'Ac Postiings',
            //             icon : 'comments-dollar',
            //             submenu : true,
            //             openned : false,
            //             submenuList : [
            //                 {
            //                     name : ' Inception / Transition Postings',
            //                     icon : 'bars',
            //                     href : '/inception_transition_report'
            //                 },
            //                 {
            //                     name : ' Depreciation Postings',
            //                     icon : 'chart-area',
            //                     href : '/depreciation_report'
            //                 },
            //                 {
            //                     name : 'Interest Postings',
            //                     icon : 'address-card',
            //                     href : '/cost_liability_report'
            //                 }
            //             ]
                    // },
                // ]
            // },
        ]
    }
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [ menus, setMenu] = React.useState(menuList);

    const handleClick = (obj) => {
    // console.log(val);
        var newMenus = menus;
        var t = newMenus.menu.find(element => element.name === obj.name)
        var index = newMenus.menu.findIndex(x => x.name === obj.name);
        t.openned = !t.openned;
        
        newMenus.menu[index] = t;
        console.log(newMenus.menu, menus.menu);
        setMenu({
            ...menus,
            menu : newMenus.menu
          })
        }

    var toggleSecondLevelMenu = (obj,sm) =>{
        var newMenus = menus;
        var t = newMenus.menu.find(element => element.name === obj.name)
        var index = newMenus.menu.findIndex(x => x.name === obj.name);

        var f = t.submenuList.find(element => element.name === sm.name);
        var fIndex = t.submenuList.findIndex(element => element.name === sm.name);
        f.openned = !f.openned;
        t.submenuList[fIndex] = f;
        newMenus.menu[index] = t;
        console.log(newMenus.menu, menus.menu);
        setMenu({
            ...menus,
            menu : newMenus.menu
          })
    }

    // console.log(menus)

    const logout = () => {
        // this.setState({
        //     ...this.state,
        //     redirect : '/'
        // })
        localStorage.setItem("name", '');
        localStorage.setItem("email", '');
        localStorage.setItem("phone", '');
        localStorage.setItem("token", '');
        localStorage.setItem("logged", false);
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
        <div className="batch-holder">
            <h3>Crazy Things</h3>
            <img src={UserImage} className="logo" alt="Company Logo" />
            <h4>{ localStorage.getItem("name") }</h4>
            <Button variant="outlined" color="secondary" size="small" onClick={ () => logout() }>Logout</Button>
        </div>
        <Divider />
        <StyledList>
            { menus.menu.map((obj, index) => (
                typeof obj === 'object' ?
                <>
                <BrowserRouter>
                    <Link to={obj.href}>
                        <StyledListItem button key={obj.name}  onClick={ () => handleClick(obj) }>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={obj.icon} /> 
                            </ListItemIcon>
                                <StyledListText primary={obj.name } /> 
                                
                                { obj.submenu ?
                                    obj.openned ? <ExpandLess /> : <ExpandMore />
                                    : null }
                        </StyledListItem>
                    </Link>
                        { obj.submenu ?
                            obj.submenuList.map((sm) => (
                                <Collapse in={obj.openned} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                <Link to={sm.href}>
                                    <StyledListItem button key={sm.name} className={classes.nested}  onClick={ () => toggleSecondLevelMenu(obj,sm) }>
                                        <ListItemIcon>
                                            <FontAwesomeIcon icon={sm.icon} /> 
                                        </ListItemIcon>
                                            <StyledListText primary={sm.name} />
                                            
                                            { sm.submenu ?
                                                sm.openned ? <ExpandLess /> : <ExpandMore />
                                                : null }
                                    </StyledListItem>
                                </Link>
                                    
                                    { sm.submenu ?
                                        sm.submenuList.map((ssm) => (
                                            <Collapse in={sm.openned} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <Link to={ssm.href}>
                                                    <StyledListItem key={ssm.name} button className={classes.nested}>
                                                    <ListItemIcon>
                                                        <FontAwesomeIcon icon={ssm.icon} /> 
                                                    </ListItemIcon>
                                                        <StyledListText primary={ssm.name} />
                                                    </StyledListItem>
                                                </Link>
                                            </List>
                                            </Collapse>
                                        ))
                                        : null }
                                </List>
                                </Collapse>
                            ))
                            : null }
                        {/* }
                        } */}
                </BrowserRouter>
                </>
                : null
        
            ))}
        </StyledList>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                <FontAwesomeIcon icon="mail-bulk" size="2x" /> { '  ' }
                Email Reply Bot
            </Typography>
            </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
            <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                paper: classes.drawerPaper,
                }}
                ModalProps={{
                keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
            <Drawer
                classes={{
                paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
            >
                {drawer}
            </Drawer>
            </Hidden>
        </nav>
        <main className={classes.content}>
            {/* <div className="main-conntaer">
                { props.component }
            </div> 
            <h1>Hari Prakash </h1> */}
        </main>
        </div>
    );
    }

    ResponsiveDrawer.propTypes = {
        /**
         * Injected by the documentation to work in an iframe.
         * You won't need it on your project.
         */
        window: PropTypes.func,
    };

export default ResponsiveDrawer;
