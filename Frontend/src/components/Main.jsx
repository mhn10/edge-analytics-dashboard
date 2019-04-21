import React, { Component } from "react";
import { Route } from "react-router-dom";

//Import Components
import Navbar from "./Navbar/navbar";
import Home from "./home";
import AddPage from "../pages/add";
import TaskPage from "../pages/task";
import Signup from "./signup";
// Create a Main Component

class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Route exact path="/" component={AddPage} />
        <Route exact path="/test" component={AddPage} />
        <Route exact path="/task" component={TaskPage} />
        <Route exact path="/signup" component={Signup} />
      </div>
    );
  }
}
// class Main extends Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <div>
//                     {/*Render Different Component based on Route*/}
//                     <Route exact path="/" component={Navbar}/>
//                 </div>
//             </Provider>
//         );
//     }
// }

//Export The Main Component
export default Main;
