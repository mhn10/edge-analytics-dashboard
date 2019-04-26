import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBox from '@material-ui/icons/AddBox';
import Gavel from '@material-ui/icons/GavelRounded';
import Dashboard from '@material-ui/icons/Dashboard';
import SignOut from '@material-ui/icons/PowerSettingsNew';
import { extractNameFromEmail, capitalizeFirstLetter } from '../../utility';
import jwtDecode from "jwt-decode";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing.unit * 7 + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9 + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
});

class MiniDrawer extends React.Component {
	state = {
		open: false,
	};

	//handle logout to destroy the cookie
	handleLogout = event => {
		let loggedInUser = localStorage.getItem('userToken');
		localStorage.removeItem('userToken');
		window.location.reload();
		// this.setState({auth: false});
		// alert(`${loggedInUser} logged out successfully.`);
		console.log(`User ${loggedInUser} logged out Successfully.`);
	}

	handleTask = event => {
		this.props.history.push('/add')
	}
	handleDeploy = event => {
		this.props.history.push('/task')
	}

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleDashboard = event => {
		this.props.history.push('/dashboard')
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes, theme } = this.props;

		//Map the icons
		const icons = new Map();
		icons.set(0, <AddBox />);
		icons.set(1, <Gavel />);
		icons.set(2, <Dashboard />);
		icons.set(3, <SignOut />);

		//Map the handles 
		const handles = new Map();
		handles.set(0, this.handleTask);
		handles.set(1, this.handleDeploy);
		handles.set(2, this.handleDashboard);
		handles.set(3, this.handleLogout);

		//check the token is present or not, redirect the page accordingly
		let redirectVar = null;
		if (localStorage.getItem('userToken') === null) {
			return redirectVar = <Redirect to="/signup" />;
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="fixed"
						style={{ background: '#03a9f4' }}
						className={classNames(classes.appBar, {
							[classes.appBarShift]: this.state.open,
						})}
					>
						{/* <Avatar src="../../assets/user.png"  /> */}
						<Toolbar disableGutters={!this.state.open}>
							<IconButton
								color="inherit"
								aria-label="Open drawer"
								onClick={this.handleDrawerOpen}
								className={classNames(classes.menuButton, {
									[classes.hide]: this.state.open,
								})}
							>
							<MenuIcon />
							</IconButton>
							<Typography variant="h6" color="inherit" noWrap>
								Vision Analytics on the Edge
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="permanent"
						className={classNames(classes.drawer, {
							[classes.drawerOpen]: this.state.open,
							[classes.drawerClose]: !this.state.open,
						})}
						classes={{
							paper: classNames({
								[classes.drawerOpen]: this.state.open,
								[classes.drawerClose]: !this.state.open,
							}),
						}}
						open={this.state.open}
					>
						<div className={classes.toolbar}>
							<Typography align="left" variant="h6" color="inherit" style={{ flex: 1 }}>
								Howdy! &nbsp;{localStorage.getItem('userToken') !== null ? capitalizeFirstLetter(extractNameFromEmail(jwtDecode(localStorage.getItem('userToken')).email)) : <div></div>}
							</Typography>
							<IconButton onClick={this.handleDrawerClose}>
								{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
							</IconButton>
						</div>
						<Divider />
						<List>
							{['Add Task', 'Run Task', 'Dashboard', 'Logout'].map((text, index) => (
								<ListItem button key={text}>
									<ListItemIcon>{icons.get(index)}</ListItemIcon>
									<ListItemText onClick={handles.get(index)} primary={text} />
								</ListItem>
							))}
						</List>
					</Drawer>
				</div>
			);
		}
	}
}

MiniDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(MiniDrawer));