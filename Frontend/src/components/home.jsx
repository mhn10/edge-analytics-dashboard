import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar/navbar';

class FileUpload extends Component {
  constructor () {
    super();
    this.state = {
      file: null,
      results: ''
    };
    this.valueChangeHandler = this.valueChangeHandler.bind(this);
  }
  valueChangeHandler = (e) => {
    if(e.target.name == 'model'){
      this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
    }
 
       
    
}
  submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    axios.post(`http://localhost:3001/test-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log("file upload successful", response)
      this.setState({results : response.data.Location})
      // handle your response;
    }).catch(error => {
      console.log("error");
      // handle your error
    });
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  render () {
    return (
      <React.Fragment>

        <Navbar/>
        <form onSubmit={this.submitFile} style={{margin:"100px"}}>
        <input name='model' placeholder='Model' label='upload file' type='file' onChange={this.handleFileUpload} />
        <button type='submit'>Send</button>
        <a href={this.state.results}> Location</a>
      </form>

        </React.Fragment>


    );
  }
}

export default FileUpload;