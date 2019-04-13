import React, { Component } from "react";
import axios from "axios";
import Navbar from "./Navbar/navbar";
import styled from "styled-components";
import Button from 'react-bootstrap/Button'
// import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Select from '@material-ui/core/Select';

import Grid from '@material-ui/core/Grid';

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      model: null,
      data: null,
      type: "",
      modelLocation: "",
      dataLocation: "",
      output: ""
    };
    this.valueChangeHandler = this.valueChangeHandler.bind(this);
    this.getOutput = this.getOutput.bind(this);

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }
  valueChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  };
  submitFile = event => {
    event.preventDefault();
    const formData = new FormData();
    const formModel = new FormData();

    formData.append("file", this.state.data[0]);
    formModel.append("file", this.state.model[0]);

    console.log("state before uplaod", this.state);
    console.log("formdata is : ", formData);
    axios
      .post(`http://localhost:3001/uploaddata`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        //nested calls
        console.log("data upload successful", response);
        this.setState({ dataLocation: response.data.Location });

        axios
          .post(`http://localhost:3001/uploadmodel`, formModel, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            this.setState({ modelLocation: res.data.Location });
            console.log("uploads of model successfull ");
          })
          .catch(err => {
            console.log("Failed to upload model");
          });
        // handle your response;
      })
      .catch(error => {
        console.log("Failed to upload data");
        // handle your error
      });
  };

  handleFileUpload = event => {
    this.setState({ [event.target.name]: event.target.files });
    console.log(this.state);
  };

  sendTask = event => {
    event.preventDefault();

    axios
      .post(`http://localhost:3001/sendtask`, { data: "user1" })
      .then(response => {
        //nested calls
        console.log("data upload successful", response);
      })
      .catch(error => {
        console.log("Failed to send task");
        // handle your error
      });
  };

  getOutput = event => {
    axios.get("http://localhost:3001/output").then(response => {
      console.log("Fetched output = ", response.data.data);
      this.setState({ output: response.data.data });
    });
    console.log("get output");
  };
  //username
  //modelname
  //datafile
  //type of user

  render() {
    var allImgs = Array.prototype.slice.call(this.state.output);
    return (
      <React.Fragment>

<Navbar/>



      
        
        <body>
          <form
            onSubmit={this.submitFile}
            style={{ marginLeft: "100px", marginTop: "150px" }}
          >
         <Grid container className={""} spacing={16}>

         <Grid item xs={12}>
          <Grid container className={"Files"} justify="center" spacing="16">
          <Select
            value={""}
            onChange={this.handleChange}
            inputProps={{
              type: 'classification'
             
            }}
          ></Select>
          
            <Input
              name="model"
              label="upload model"
              type="file"
              onChange={this.handleFileUpload}
  
            />
            <Input
              name="data"
              label="upload datafile"
              type="file"
    
              onChange={this.handleFileUpload}
            />
            <Button variant="primary" type="submit">Send</Button>
          </Grid>
        </Grid>
    </Grid>
            <dl className="form-row">
              <dl className="col-6">
                <div
                  className="card"
                  style={{
                    marginLeft: "3rem",
                    marginRight: "3rem",
                    marginBottom: "1rem",
                    width: "40vh",

                    padding: "1.5rem",
                    //  marginLeft: "3rem",
                    borderRadius: "7px",
                    backgroundColor: "#f0f0f0",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                  }}
                >
                  <a href={this.state.modelLocation}>Model Location</a>
                </div>
              </dl>
              <dl className="col-6">
                <div
                  className="card col-3"
                  style={{
                    marginLeft: "3rem",
                    marginRight: "3rem",
                    marginBottom: "1rem",
                    width: "40vh",
                    padding: "1.5rem",
                    //  marginLeft: "3rem",
                    borderRadius: "7px",
                    backgroundColor: "#f0f0f0",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                  }}
                >
                  <a href={this.state.dataLocation}> Data Location</a>
                </div>
              </dl>
            </dl>
          </form>
          <Button
            type="submit"
            onClick={this.sendTask}
            style={{ marginLeft: "100px", marginTop: "40px" }}
          >
            Send Task
          </Button>
          <Button variant="primary"
            color="primary"
            style={{ marginLeft: "100px", marginTop: "40px" }}
            type="submit"
            onClick={this.getOutput}
          >
            Get Output
          </Button>
          <ul
            className="card"
            style={{ width: "70vh", display: "block", marginLeft: "45px" }}
          >
            {allImgs.map((file, i) => (
              <a href={"https://cmpe295-jetson-s3.s3.amazonaws.com/" + file}>
                <li class="cards__item" id={i}>
                  <div
                    className="card"
                    style={{
                      marginLeft: "3rem",
                      marginRight: "3rem",
                      marginBottom: "1rem",

                      padding: "1.5rem",
                      //  marginLeft: "3rem",
                      borderRadius: "7px",
                      backgroundColor: "#f0f0f0",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                    }}
                  >
                    <p class="card__text">{file}</p>
                  </div>
                </li>
                {console.log("file:", file, "Key: ", i)}
              </a>
            ))}
          </ul>
        </body>
      </React.Fragment>
    );
  }
}

export default FileUpload;

const body = styled.body`
  color: @gray;
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0;
  padding: 1rem;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -moz-font-feature-settings: "liga" on;
`;

const btn = styled.button`
  background-color: #ccc;
  border: 2px solid @gray-light;
  border-radius: 5px;
  color: @gray-dark;
  padding: 0.5rem;
  text-transform: lowercase;
`;

const btnBlock = styled(btn)`
  display: block;
  width: 100%;
`;

const cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const cardsitem = styled.div`
  display: flex;
  padding: 1rem;
`;

const card = styled(cards)`
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const card__content = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 1rem;
`;

const card__title = styled.div`
  color: @gray-dark;
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const card__text = styled.div`
  flex: 1 1 auto;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;
