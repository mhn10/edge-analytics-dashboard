import React, { Component }from 'react';
import axios from "axios";
import LoginNavbar from "./Navbar/loginnavbar";
import validate from '../validate';
import {CONSTANTS} from '../Constants';

class Signup extends Component{
	constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
			isRegistered: false,
			isLogged: false,
            messagediv: ''
        }
        // Bind the handlers to this class
		this.doSignUp = this.doSignUp.bind(this);
		this.doLogin = this.doLogin.bind(this);
	}
	
	//SignUp Handler
    doSignUp = (event) => {
        //prevent page from refresh
        event.preventDefault();
        let valid = '';
        // let valid = validate(this.state);
        if(valid === '') {
            const data = {
                ...this.state
            }
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(`${CONSTANTS.BACKEND_URL}/signup`,
            data,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 'Authorization': localStorage.getItem('recruiterToken')
            },
            })
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 201){
                    this.setState({
                        ...this.state,
                        isRegistered : true
                    })
                    // this.props.postJobData(jobData,true);
                    console.log("message:", response.data.message);
                    alert("User registered successfully");
                }else{
                    this.setState({
                        ...this.state,
                        isRegistered : false
                    })
                    // this.props.postJobData(jobData,false);
                    alert("User is not registered successfully");
                }
            })
            .catch(error =>{
                console.log("error:", error);
            });
        } else {
            this.setState({
                ...this.state,
                messagediv: valid
            });
            event.preventDefault();
        }
	}
	
	//Login Handler
    doLogin = (event) => {
        //prevent page from refresh
        event.preventDefault();
        let valid = '';
        // let valid = validate(this.state);
        if(valid === '') {
            const data = {
                ...this.state
            }
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(`${CONSTANTS.BACKEND_URL}/login`,
            data,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 'Authorization': localStorage.getItem('recruiterToken')
            },
            })
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 201){
                    this.setState({
                        ...this.state,
                        isLogged : true
                    })
                    // this.props.postJobData(jobData,true);
                    console.log("message:", response.data.message);
                    alert("User Logged in successfully");
                }else{
                    this.setState({
                        ...this.state,
                        isLogged : false
                    })
                    // this.props.postJobData(jobData,false);
                    alert("User is not logged in successfully");
                }
            })
            .catch(error =>{
                console.log("error:", error);
            });
        } else {
            this.setState({
                ...this.state,
                messagediv: valid
            });
            event.preventDefault();
        }
    }

	render() {
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
											<input id="email" type="email" class="validate" />
											<label for="email">Email</label>
										</div>
									</div>
									<div class="row">
										<div class="input-field col s12">
											<input id="password" type="password" class="validate" />
											<label for="password">Password</label>
										</div>
									</div>
									<br />
									<center>
										<button class="btn waves-effect waves-light light-blue" type="submit" name="action">Connect</button>
										<br />
										<br />
										<a href="">Forgotten password?</a>
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
											<input id="last_name" type="text" class="validate" />
											<label for="last_name">First Name</label>
										</div>
										<div class="input-field col s6">
											<input id="last_name" type="text" class="validate" />
											<label for="last_name">Last Name</label>
										</div>
									</div>
									<div class="row">
										<div class="input-field col s12">
											<input id="email" type="email" class="validate" />
											<label for="email">Email</label>
										</div>
									</div>
									<div class="row">
										<div class="input-field col s12">
											<input id="password" type="password" class="validate" />
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