import React, { Component }from 'react';
import LoginNavbar from "./Navbar/loginnavbar";

import validate from '../validate';

class Signup extends Component{
	// constructor(props) {
    //     super(props);
    //     this.state = {
    //         firstName: "",
    //         lastName: "",
    //         email: "",
    //         password: "",
    //         isTraveler: false,
    //         isRegistered: false,
    //         messagediv: ''
    //     }
    //     //Bind the handlers to this class
    //     this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
    //     this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
    //     this.emailChangeHandler = this.emailChangeHandler.bind(this);
    //     this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    //     this.signUp = this.signUp.bind(this);
    // }

render(){
  return (
	<React.Fragment>
	<LoginNavbar />
	<body>
<div class="container container-signup white z-depth-2">
	<ul class="tabs light-blue">
		<li class="tab col s3"><a class="white-text active" href="#login">login</a></li>
		<li class="tab col s3"><a class="white-text" href="#register">register</a></li>
	</ul>
	<div id="login" class="col s12">
		<form class="col s12">
			<div class="form-container">
				<h3 class="light-blue-text">Hello</h3>
				<div class="row">
					<div class="input-field col s12">
						<input id="email" type="email" class="validate"/>
						<label for="email">Email</label>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<input id="password" type="password" class="validate"/>
						<label for="password">Password</label>
					</div>
				</div>
				<br/>
				<center>
					<button class="btn waves-effect waves-light light-blue" type="submit" name="action">Connect</button>
					<br/>
					<br/>
					<a href = "">Forgotten password?</a>
				</center>
			</div>
		</form>
	</div>
	<div id="register" class="col s12">
		<form class="col s12">
			<div class="form-container">
				<h3 class="light-blue-text">Welcome</h3>
				<div class="row">
					<div class="input-field col s6">
						<input id="last_name" type="text" class="validate"/>
						<label for="last_name">First Name</label>
					</div>
					<div class="input-field col s6">
						<input id="last_name" type="text" class="validate"/>
						<label for="last_name">Last Name</label>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<input id="email" type="email" class="validate"/>
						<label for="email">Email</label>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<input id="password" type="password" class="validate"/>
						<label for="password">Password</label>
					</div>
				</div>
				<center>
					<button class="btn waves-effect waves-light light-blue" type="submit" name="action">Submit</button>
				</center>
			</div>
		</form>
	</div>
</div>
</body>
</React.Fragment>
  );
}
}
export default Signup;