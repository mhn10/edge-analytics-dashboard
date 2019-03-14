import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar/navbar';

class FileUpload extends Component {
  constructor () {
    super();
    this.state = {
      file: null,
      model: null,
      data: null,
      results: ''
    };
    this.valueChangeHandler = this.valueChangeHandler.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }
  valueChangeHandler = (e) => {

      this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
    
 
       
    
}
  submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const formModel = new FormData();

    formData.append('file', this.state.data[0]);
    formModel.append('file', this.state.model[0])
    axios.post(`http://localhost:3001/uploaddata`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log("data upload successful", response)
      axios.post(`http://localhost:3001/uploadmodel`, formModel, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res=>{
        this.setState({results : res.data.Location})
        console.log("uploads of data successfull ")
      })




      
      // handle your response;
    }).catch(error => {
      console.log("error");
      // handle your error
    });
  }

  handleFileUpload = (event) => {
    this.setState({[event.target.name]: event.target.files});
    console.log(this.state);
  }
//username
//modelname
//datafile
//type of user

  render () {
    return (
      <React.Fragment>

        <Navbar/>
        <form onSubmit={this.submitFile} style={{margin:"100px"}}>
        <input name='model'  label='upload model' type='file' onChange={this.handleFileUpload} />
        <input name='data'  label='upload datafile' type='file' onChange={this.handleFileUpload} />
        <button type='submit'>Send</button>
        <a href={this.state.results}> Location</a>
      </form>

        </React.Fragment>


    );
  }
}

export default FileUpload;