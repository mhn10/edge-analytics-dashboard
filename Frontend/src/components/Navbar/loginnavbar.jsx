import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Redirect } from "react-router";
import {extractNameFromEmail,capitalizeFirstLetter} from '../../utility';
import jwtDecode from "jwt-decode";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
	// authh = false;
  state = {
    auth: false,
    anchorEl: null,
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
	handleDeploy = event =>{
		this.props.history.push('/task')
	}
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
	};  
	
	handleDashboard = event => {
		this.props.history.push('/dashboard')
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };


  render() {
	const { classes } = this.props;
    const { auth, anchorEl } = this.state;
	const open = Boolean(anchorEl);  
	let userLogin = null;
	if(localStorage.getItem('userToken') !== null){
		console.log('Able to read session.');
		userLogin =(
			<div>
			<IconButton
			  aria-owns={open ? 'menu-appbar' : undefined}
			  aria-haspopup="true"
			  onClick={this.handleMenu}
			  color="inherit"
			>
			<AccountCircle /> &nbsp;
			<Typography variant = "h6" color="inherit" className={classes.grow}>Howdy! {capitalizeFirstLetter(extractNameFromEmail(jwtDecode(localStorage.getItem('userToken')).email))}</Typography>
			</IconButton>
			<Menu	
			  id="menu-appbar"
			  anchorEl={anchorEl}
			  anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			  }}
			  transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			  }}
			  open={open}
			  onClose={this.handleClose}
			>
			  <MenuItem onClick={this.handleDashboard}>Dashboard</MenuItem>
				<MenuItem onClick={this.handleTask}>New Task</MenuItem>
				<MenuItem onClick={this.handleDeploy}>Deploy Task</MenuItem>
			  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
			</Menu>
		  </div>
		);
	} else {
		userLogin = (<div></div>);
	}
	let redirectVar = null;  
	if(localStorage.getItem('userToken') === null){
		return redirectVar = <Redirect to="/signup"/>;
	} else {
		return (
			<div className={classes.root}>
			  <AppBar style={{ background: '#03a9f4' }} position="static">
				<Toolbar>
				  <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
					<MenuIcon />
				  </IconButton>
				  <Typography variant="h6" color="inherit" className={classes.grow}>
				  Vision Analytics on the Edge
				  </Typography>
				  {userLogin}
				</Toolbar>
			  </AppBar>
			</div>
		  );
	}
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(MenuAppBar));